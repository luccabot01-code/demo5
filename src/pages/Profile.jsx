import { useState } from 'react'
import { Users, Heart, Calendar, Edit3, Check, X, Upload, Camera } from 'lucide-react'
import useStore from '../store/useStore'
import { getAvatarIcon } from '../lib/iconHelper'
import { getTranslation } from '../lib/i18n'

const AVATARS = [
  { icon: 'User', label: 'User 1' },
  { icon: 'UserCircle', label: 'User 2' },
  { icon: 'Users', label: 'Users' },
  { icon: 'Heart', label: 'Heart' },
  { icon: 'Smile', label: 'Smile' },
  { icon: 'Star', label: 'Star' },
]
const COLORS = ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6']

export default function Profile() {
  const { couple, updatePartner, updateCouple, memories, goals, tasks, habits, settings } = useStore()
  const t = (key) => getTranslation(settings.language, key)
  const [editingPartner, setEditingPartner] = useState(null)
  const [editingDates, setEditingDates] = useState(false)
  const [editingCouplePhoto, setEditingCouplePhoto] = useState(false)
  const [partnerForm, setPartnerForm] = useState({})
  const [datesForm, setDatesForm] = useState({
    anniversary: couple.anniversary,
    weddingDate: couple.weddingDate,
    relationshipStart: couple.relationshipStart,
  })
  
  const isDark = settings.theme === 'dark'

  const handlePhotoUpload = (partner, event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (partner === 'couple') {
          updateCouple({ couplePhoto: reader.result })
          setEditingCouplePhoto(false)
        } else {
          updatePartner(partner, { photo: reader.result })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = (partner) => {
    if (partner === 'couple') {
      updateCouple({ couplePhoto: null })
    } else {
      updatePartner(partner, { photo: null })
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return t('notSpecified')
    const date = new Date(dateStr)
    const locale = settings.language === 'tr' ? 'tr-TR' : 'en-US'
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatBirthday = (dateStr) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    const locale = settings.language === 'tr' ? 'tr-TR' : 'en-US'
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long' })
  }

  const handleEditPartner = (partner) => {
    setPartnerForm({ ...couple[partner] })
    setEditingPartner(partner)
  }

  const handleSavePartner = () => {
    if (editingPartner && partnerForm.name?.trim()) {
      updatePartner(editingPartner, partnerForm)
      setEditingPartner(null)
      setPartnerForm({})
    }
  }

  const handleSaveDates = () => {
    updateCouple(datesForm)
    setEditingDates(false)
  }

  const calculateDaysTogether = () => {
    if (!couple.relationshipStart) return null
    const start = new Date(couple.relationshipStart)
    const today = new Date()
    return Math.floor((today - start) / (1000 * 60 * 60 * 24))
  }

  const calculateDaysUntilWedding = () => {
    if (!couple.weddingDate) return null
    const wedding = new Date(couple.weddingDate)
    const today = new Date()
    const diff = Math.floor((wedding - today) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : null
  }

  const daysTogether = calculateDaysTogether()
  const daysUntilWedding = calculateDaysUntilWedding()

  // Stats
  const completedGoals = goals.filter(g => g.current >= g.target).length
  const completedTasks = tasks.filter(t => t.completed).length
  const activeHabits = habits.length

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          <Users className="w-8 h-8 text-pink-500" /> {t('profileTitle')}
        </h1>
        <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('coupleInformation')}</p>
      </div>

      {/* Couple Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-white mb-6 relative">
        {/* Couple Photo Option */}
        <div className="flex flex-col items-center mb-6">
          {couple.couplePhoto ? (
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img src={couple.couplePhoto} alt="Couple" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => setEditingCouplePhoto(true)}
                className="absolute bottom-0 right-0 p-2 bg-white text-pink-500 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingCouplePhoto(true)}
              className="w-32 h-32 rounded-full border-4 border-white border-dashed flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto mb-1" />
                <p className="text-xs">{t('couplePhoto')}</p>
              </div>
            </button>
          )}
        </div>

        {/* Photo Upload Modal */}
        {editingCouplePhoto && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`max-w-md w-full rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {t('couplePhoto')}
              </h3>
              <div className="space-y-4">
                <label className={`block p-6 border-2 border-dashed rounded-xl text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                  <Upload className="w-12 h-12 mx-auto mb-2 text-pink-500" />
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('uploadPhoto')}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload('couple', e)}
                    className="hidden"
                  />
                </label>
                {couple.couplePhoto && (
                  <button
                    onClick={() => {
                      removePhoto('couple')
                      setEditingCouplePhoto(false)
                    }}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  >
                    {t('removePhoto')}
                  </button>
                )}
                <button
                  onClick={() => setEditingCouplePhoto(false)}
                  className={`w-full px-4 py-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="relative group">
              {couple.partner1.photo ? (
                <div className="w-20 h-20 rounded-full mx-auto mb-2 overflow-hidden border-2 border-white">
                  <img src={couple.partner1.photo} alt={couple.partner1.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${couple.partner1.color}40`, color: couple.partner1.color }}>
                  {(() => {
                    const IconComponent = getAvatarIcon(couple.partner1.avatar)
                    return <IconComponent className="w-10 h-10" />
                  })()}
                </div>
              )}
              <label className="absolute bottom-2 right-0 p-1 bg-white text-pink-500 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Camera className="w-3 h-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload('partner1', e)}
                  className="hidden"
                />
              </label>
            </div>
            <p className="font-semibold text-lg">{couple.partner1.name}</p>
          </div>
          <Heart className="w-12 h-12 animate-pulse" />
          <div className="text-center">
            <div className="relative group">
              {couple.partner2.photo ? (
                <div className="w-20 h-20 rounded-full mx-auto mb-2 overflow-hidden border-2 border-white">
                  <img src={couple.partner2.photo} alt={couple.partner2.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${couple.partner2.color}40`, color: couple.partner2.color }}>
                  {(() => {
                    const IconComponent = getAvatarIcon(couple.partner2.avatar)
                    return <IconComponent className="w-10 h-10" />
                  })()}
                </div>
              )}
              <label className="absolute bottom-2 right-0 p-1 bg-white text-pink-500 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Camera className="w-3 h-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload('partner2', e)}
                  className="hidden"
                />
              </label>
            </div>
            <p className="font-semibold text-lg">{couple.partner2.name}</p>
          </div>
        </div>
        {daysTogether && (
          <div className="text-center mt-6">
            <p className="text-white/80">{t('togetherFor')}</p>
            <p className="text-4xl font-bold">{daysTogether} {t('days')}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`rounded-xl p-4 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className="text-3xl font-bold text-pink-500">{memories.length}</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('memory')}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className="text-3xl font-bold text-purple-500">{completedGoals}/{goals.length}</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('goal')}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className="text-3xl font-bold text-green-500">{completedTasks}</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('completedTask')}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className="text-3xl font-bold text-blue-500">{activeHabits}</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('activeHabits')}</p>
        </div>
      </div>

      {/* Partner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {['partner1', 'partner2'].map((partner) => {
          const data = couple[partner]
          const isEditing = editingPartner === partner

          return (
            <div key={partner} className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              {isEditing ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('edit')}</h3>
                    <div className="flex gap-2">
                      <button onClick={handleSavePartner} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg">
                        <Check className="w-5 h-5" />
                      </button>
                      <button onClick={() => setEditingPartner(null)} className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-50'}`}>
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('avatar')}</label>
                    <div className="flex flex-wrap gap-2">
                      {AVATARS.map(({ icon, label }) => {
                        const IconComponent = getAvatarIcon(icon)
                        return (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => setPartnerForm({ ...partnerForm, avatar: icon })}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                              partnerForm.avatar === icon 
                                ? 'bg-pink-100 dark:bg-pink-900/30 ring-2 ring-pink-500 text-pink-600 dark:text-pink-400' 
                                : isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            }`}
                            title={label}
                          >
                            <IconComponent className="w-5 h-5" />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('color')}</label>
                    <div className="flex gap-2">
                      {COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setPartnerForm({ ...partnerForm, color })}
                          className={`w-8 h-8 rounded-full transition-all ${
                            partnerForm.color === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800' : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder={t('name')}
                    value={partnerForm.name || ''}
                    onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                  />

                  <input
                    type="date"
                    placeholder={t('birthday')}
                    value={partnerForm.birthday || ''}
                    onChange={(e) => setPartnerForm({ ...partnerForm, birthday: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${data.color}20`, color: data.color }}
                      >
                        {(() => {
                          const IconComponent = getAvatarIcon(data.avatar)
                          return <IconComponent className="w-8 h-8" />
                        })()}
                      </div>
                      <div>
                        <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>{data.name}</h3>
                        {data.birthday && (
                          <p className={`text-sm flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            <Calendar className="w-4 h-4" />
                            {formatBirthday(data.birthday)}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditPartner(partner)}
                      className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'}`}
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="w-full h-1 rounded-full" style={{ backgroundColor: data.color }} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Important Dates */}
      <div className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Calendar className="w-5 h-5 text-pink-500" /> {t('importantDates')}
          </h3>
          {editingDates ? (
            <div className="flex gap-2">
              <button onClick={handleSaveDates} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg">
                <Check className="w-5 h-5" />
              </button>
              <button onClick={() => setEditingDates(false)} className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-50'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingDates(true)}
              className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'}`}
            >
              <Edit3 className="w-5 h-5" />
            </button>
          )}
        </div>

        {editingDates ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('relationshipStart')}</label>
              <input
                type="date"
                value={datesForm.relationshipStart || ''}
                onChange={(e) => setDatesForm({ ...datesForm, relationshipStart: e.target.value })}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
              />
            </div>
            <div>
              <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('anniversary')}</label>
              <input
                type="date"
                value={datesForm.anniversary || ''}
                onChange={(e) => setDatesForm({ ...datesForm, anniversary: e.target.value })}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
              />
            </div>
            <div>
              <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('weddingDate')}</label>
              <input
                type="date"
                value={datesForm.weddingDate || ''}
                onChange={(e) => setDatesForm({ ...datesForm, weddingDate: e.target.value })}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-pink-900/20' : 'bg-pink-50'}`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>{t('relationshipStart')}</p>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {formatDate(couple.relationshipStart)}
              </p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{t('anniversary')}</p>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {formatDate(couple.anniversary)}
              </p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
              <p className={`text-sm mb-1 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{t('weddingDate')}</p>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {formatDate(couple.weddingDate)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
