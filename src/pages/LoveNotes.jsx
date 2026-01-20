import { useState, useEffect } from 'react'
import { Mail, Send, Heart, Trash2, Check, Inbox, PenLine } from 'lucide-react'
import useStore from '../store/useStore'
import { getTranslation } from '../lib/i18n'

const getTemplates = (t) => [
  t('loveTemplate1'),
  t('loveTemplate2'),
  t('loveTemplate3'),
  t('loveTemplate4'),
  t('loveTemplate5'),
  t('loveTemplate6'),
]

export default function LoveNotes() {
  const { loveNotes, couple, addLoveNote, markLoveNoteRead, deleteLoveNote, settings, currentUser, setCurrentUser } = useStore()
  const t = (key) => getTranslation(settings.language, key)
  const isDark = settings.theme === 'dark'
  const [showCompose, setShowCompose] = useState(false)
  const [activeTab, setActiveTab] = useState('inbox')
  const [newNote, setNewNote] = useState({ message: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)

  const TEMPLATES = getTemplates(t)
  const myNotes = loveNotes.filter(n => n.to === currentUser)
  const sentNotes = loveNotes.filter(n => n.from === currentUser)
  const unreadCount = myNotes.filter(n => !n.read).length

  const handleSend = (e) => {
    e.preventDefault()
    if (newNote.message.trim()) {
      addLoveNote({
        from: currentUser,
        to: currentUser === 'partner1' ? 'partner2' : 'partner1',
        message: newNote.message,
      })
      setNewNote({ message: '' })
      setShowCompose(false)
    }
  }

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteLoveNote(id)
      setConfirmDelete(null)
      if (selectedNote?.id === id) setSelectedNote(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const handleSelectNote = (note) => {
    setSelectedNote(note)
    if (!note.read && note.to === currentUser) {
      markLoveNoteRead(note.id)
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return t('now')
    if (minutes < 60) return `${minutes} ${t('minutesAgo')}`
    if (hours < 24) return `${hours} ${t('hoursAgo')}`
    if (days < 7) return `${days} ${t('daysAgo')}`
    return date.toLocaleDateString(settings.language === 'tr' ? 'tr-TR' : 'en-US')
  }

  const displayNotes = activeTab === 'inbox' ? myNotes : sentNotes
  const partnerName = currentUser === 'partner1' ? couple.partner2.name : couple.partner1.name
  const myName = currentUser === 'partner1' ? couple.partner1.name : couple.partner2.name

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Mail className="w-8 h-8 text-pink-500" /> {t('loveNotes')}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('loveNotesDesc')}</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <PenLine className="w-5 h-5" /> {t('write')}
        </button>
      </div>

      {/* User Switch */}
      <div className={`rounded-2xl p-4 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('currentlyLoggedIn')}:</p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentUser('partner1')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              currentUser === 'partner1' ? 'bg-pink-500 text-white' : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {couple.partner1.name}
          </button>
          <button
            onClick={() => setCurrentUser('partner2')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              currentUser === 'partner2' ? 'bg-purple-500 text-white' : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {couple.partner2.name}
          </button>
        </div>
      </div>

      {showCompose && (
        <form onSubmit={handleSend} className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <Heart className="w-5 h-5 inline text-pink-500 mr-2" />
              {t('writeMessageTo')} {partnerName}
            </h3>
            <button type="button" onClick={() => setShowCompose(false)} className={isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}>
              ✕
            </button>
          </div>

          <div className="mb-4">
            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('quickTemplates')}:</p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNewNote({ message: template })}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${isDark ? 'bg-pink-900/30 text-pink-400 hover:bg-pink-900/50' : 'bg-pink-50 text-pink-600 hover:bg-pink-100'}`}
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder={t('writeYourMessage')}
            value={newNote.message}
            onChange={(e) => setNewNote({ message: e.target.value })}
            rows={4}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4 resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowCompose(false)} className={`px-6 py-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t('cancel')}
            </button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
              <Send className="w-4 h-4" /> {t('send')}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className={`rounded-2xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  activeTab === 'inbox' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' : isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Inbox className="w-5 h-5" />
                  <span className="font-medium">{t('inbox')}</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  activeTab === 'sent' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' : isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Send className="w-5 h-5" />
                <span className="font-medium">{t('sent')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="lg:col-span-2">
          <div className={`rounded-2xl shadow-sm border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            {displayNotes.length === 0 ? (
              <div className="p-12 text-center">
                <Mail className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activeTab === 'inbox' ? t('inboxEmpty') : t('noSentMessages')}
                </h3>
                <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                  {activeTab === 'inbox' ? `${t('waitingForMessage')} ${partnerName}...` : t('sendFirstLoveNote')}
                </p>
              </div>
            ) : (
              <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {displayNotes.sort((a, b) => new Date(b.date) - new Date(a.date)).map(note => {
                  const isUnread = !note.read && note.to === currentUser
                  const senderName = note.from === 'partner1' ? couple.partner1.name : couple.partner2.name

                  return (
                    <div
                      key={note.id}
                      onClick={() => handleSelectNote(note)}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedNote?.id === note.id 
                          ? isDark ? 'bg-pink-900/30' : 'bg-pink-100'
                          : isUnread 
                            ? isDark ? 'bg-pink-900/20' : 'bg-pink-50'
                            : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-100 text-pink-600'}`}>
                          {senderName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-medium ${isUnread ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-400' : 'text-gray-600')}`}>
                              {activeTab === 'inbox' ? senderName : `→ ${partnerName}`}
                            </span>
                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{formatDate(note.date)}</span>
                          </div>
                          <p className={`truncate ${isUnread ? (isDark ? 'text-gray-300 font-medium' : 'text-gray-800 font-medium') : (isDark ? 'text-gray-500' : 'text-gray-500')}`}>
                            {note.message}
                          </p>
                        </div>
                        {isUnread && (
                          <div className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                          className={`p-1 flex-shrink-0 ${confirmDelete === note.id ? 'text-red-500' : isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                        >
                          {confirmDelete === note.id ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Selected Note Detail */}
          {selectedNote && (
            <div className={`mt-4 rounded-2xl p-6 border ${isDark ? 'bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-800' : 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-100'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-100 text-pink-600'}`}>
                  {(selectedNote.from === 'partner1' ? couple.partner1.name : couple.partner2.name).charAt(0)}
                </div>
                <div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {selectedNote.from === 'partner1' ? couple.partner1.name : couple.partner2.name}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(selectedNote.date)}</p>
                </div>
              </div>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{selectedNote.message}</p>
              <div className="mt-4 flex justify-center">
                <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
