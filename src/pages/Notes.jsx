import { useState } from 'react'
import { StickyNote, Plus, Trash2, Edit3, X, Check, Search } from 'lucide-react'
import useStore from '../store/useStore'
import { getTranslation } from '../lib/i18n'

const NOTE_COLORS = [
  { value: '#fef3c7', label: 'Yellow' },
  { value: '#dbeafe', label: 'Blue' },
  { value: '#dcfce7', label: 'Green' },
  { value: '#fce7f3', label: 'Pink' },
  { value: '#f3e8ff', label: 'Purple' },
  { value: '#fed7aa', label: 'Orange' },
]

export default function Notes() {
  const { notes, couple, addNote, updateNote, deleteNote, settings } = useStore()
  const t = (key) => getTranslation(settings.language, key)
  const isDark = settings.theme === 'dark'
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [newNote, setNewNote] = useState({ title: '', content: '', author: 'partner1', color: '#fef3c7' })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [expandedNote, setExpandedNote] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newNote.title.trim() && newNote.content.trim()) {
      if (editingId) {
        updateNote(editingId, newNote)
        setEditingId(null)
      } else {
        addNote(newNote)
      }
      setNewNote({ title: '', content: '', author: 'partner1', color: '#fef3c7' })
      setShowForm(false)
    }
  }

  const handleEdit = (note) => {
    setNewNote({ title: note.title, content: note.content, author: note.author, color: note.color || '#fef3c7' })
    setEditingId(note.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteNote(id)
      setConfirmDelete(null)
      if (expandedNote === id) setExpandedNote(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setNewNote({ title: '', content: '', author: 'partner1', color: '#fef3c7' })
  }

  const authorLabels = { 
    partner1: couple.partner1.name, 
    partner2: couple.partner2.name 
  }
  const authorColors = { partner1: 'bg-pink-100 text-pink-600', partner2: 'bg-purple-100 text-purple-600' }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <StickyNote className="w-8 h-8 text-pink-500" /> {t('sharedNotes')}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('shareIdeasPlans')}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> {t('newNote')}
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={t('searchInNotes')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
        />
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{editingId ? t('editNote') : t('addNewNote')}</h3>
            <button type="button" onClick={cancelForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('noteColor')}</label>
            <div className="flex gap-2">
              {NOTE_COLORS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setNewNote({ ...newNote, color: value })}
                  className={`w-8 h-8 rounded-lg transition-all ${newNote.color === value ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                  style={{ backgroundColor: value }}
                  title={label}
                />
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder={t('noteTitle')}
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
          />
          <textarea
            placeholder={t('noteContent')}
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            rows={4}
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4 resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
          />
          <div className="flex gap-4 items-center">
            <select
              value={newNote.author}
              onChange={(e) => setNewNote({ ...newNote, author: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            >
              <option value="partner1">{couple.partner1.name}</option>
              <option value="partner2">{couple.partner2.name}</option>
            </select>
            <button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
              {editingId ? t('update') : t('save')}
            </button>
            <button type="button" onClick={cancelForm} className={`px-6 py-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t('cancel')}
            </button>
          </div>
        </form>
      )}

      {filteredNotes.length === 0 ? (
        <div className={`rounded-2xl p-12 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <StickyNote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {searchQuery ? t('noResultFound') : t('noNotesYet')}
          </h3>
          <p className="text-gray-400">
            {searchQuery ? t('tryDifferentSearch') : t('addFirstNote')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className="rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              style={{ backgroundColor: note.color || '#fef3c7' }}
              onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800">{note.title}</h3>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className={`p-1 transition-colors ${confirmDelete === note.id ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                  >
                    {confirmDelete === note.id ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className={`text-gray-600 text-sm mb-4 ${expandedNote === note.id ? '' : 'line-clamp-3'}`}>
                {note.content}
              </p>
              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${authorColors[note.author]}`}>
                  {authorLabels[note.author]}
                </span>
                <span className="text-xs text-gray-500">{note.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
