import { useState } from 'react'
import { Camera, Plus, Trash2, Check, Edit3, X, Heart, Image, Upload } from 'lucide-react'
import useStore from '../store/useStore'
import { getMoodIcon } from '../lib/iconHelper'
import { getTranslation } from '../lib/i18n'

const MOODS = [
  { icon: 'Heart', label: 'Heart' },
  { icon: 'Sparkles', label: 'Sparkles' },
  { icon: 'Star', label: 'Star' },
  { icon: 'Smile', label: 'Smile' },
  { icon: 'Sun', label: 'Sun' },
  { icon: 'Moon', label: 'Moon' },
  { icon: 'Coffee', label: 'Coffee' },
  { icon: 'Music', label: 'Music' },
  { icon: 'Gift', label: 'Gift' },
  { icon: 'Cake', label: 'Cake' },
  { icon: 'Plane', label: 'Plane' },
  { icon: 'Home', label: 'Home' },
]

export default function Memories() {
  const { memories, addMemory, updateMemory, deleteMemory, settings } = useStore()
  const t = (key) => getTranslation(settings.language, key)
  const isDark = settings.theme === 'dark'
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newMemory, setNewMemory] = useState({ title: '', date: '', description: '', mood: 'Heart', photos: [] })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [expandedMemory, setExpandedMemory] = useState(null)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [viewingPhoto, setViewingPhoto] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newMemory.title.trim() && newMemory.date) {
      if (editingId) {
        updateMemory(editingId, newMemory)
        setEditingId(null)
      } else {
        addMemory(newMemory)
      }
      setNewMemory({ title: '', date: '', description: '', mood: 'Heart', photos: [] })
      setShowForm(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploadingPhotos(true)
    const newPhotos = []

    for (const file of files) {
      // Convert to base64 for local storage
      const reader = new FileReader()
      reader.onloadend = () => {
        newPhotos.push({
          id: Date.now() + Math.random(),
          url: reader.result,
          name: file.name
        })
        
        if (newPhotos.length === files.length) {
          setNewMemory(prev => ({
            ...prev,
            photos: [...(prev.photos || []), ...newPhotos]
          }))
          setUploadingPhotos(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = (photoId) => {
    setNewMemory(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== photoId)
    }))
  }

  const handleEdit = (memory) => {
    setNewMemory({ 
      title: memory.title, 
      date: memory.date, 
      description: memory.description || '', 
      mood: memory.mood,
      photos: memory.photos || []
    })
    setEditingId(memory.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteMemory(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setNewMemory({ title: '', date: '', description: '', mood: 'Heart', photos: [] })
  }

  const sortedMemories = [...memories].sort((a, b) => new Date(b.date) - new Date(a.date))

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const locale = settings.language === 'tr' ? 'tr-TR' : 'en-US'
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const getDaysSince = (dateStr) => {
    const date = new Date(dateStr)
    const today = new Date()
    const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24))
    if (diff === 0) return t('today')
    if (diff === 1) return t('yesterday')
    if (diff < 30) return t('daysAgo').replace('{count}', diff)
    if (diff < 365) return t('monthsAgo').replace('{count}', Math.floor(diff / 30))
    return t('yearsAgo').replace('{count}', Math.floor(diff / 365))
  }

  // Group memories by year
  const groupedMemories = sortedMemories.reduce((acc, memory) => {
    const year = new Date(memory.date).getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(memory)
    return acc
  }, {})

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Camera className="w-8 h-8 text-pink-500" /> {t('memoriesTitle')}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('saveSpecialMoments')}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> {t('addMemory')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{editingId ? t('editMemory') : t('newMemory')}</h3>
            <button type="button" onClick={cancelForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('mood')}</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(({ icon, label }) => {
                const IconComponent = getMoodIcon(icon)
                return (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewMemory({ ...newMemory, mood: icon })}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      newMemory.mood === icon ? 'bg-pink-100 ring-2 ring-pink-500' : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    title={label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder={t('memoryTitle')}
              value={newMemory.title}
              onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
              required
            />
            <input
              type="date"
              value={newMemory.date}
              onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
              required
            />
          </div>
          <textarea
            placeholder={t('writeAboutMemory')}
            value={newMemory.description}
            onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
            rows={4}
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4 resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
          />

          {/* Photo Upload Section */}
          <div className="mb-4">
            <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Image className="w-4 h-4 inline mr-1" />
              {t('photos') || 'Photos'} ({newMemory.photos?.length || 0})
            </label>
            
            {/* Photo Grid */}
            {newMemory.photos && newMemory.photos.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {newMemory.photos.map((photo) => (
                  <div key={photo.id} className="relative w-fit">
                    <img 
                      src={photo.url} 
                      alt={photo.name}
                      className="h-32 w-auto object-contain rounded-lg border border-gray-200 bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <label className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              uploadingPhotos 
                ? 'opacity-50 cursor-not-allowed' 
                : isDark 
                  ? 'border-gray-600 hover:border-pink-500 hover:bg-gray-700' 
                  : 'border-gray-300 hover:border-pink-500 hover:bg-pink-50'
            }`}>
              <Upload className="w-5 h-5 text-pink-500" />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                {uploadingPhotos ? (t('uploading') || 'Uploading...') : (t('addPhotos') || 'Add Photos')}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                disabled={uploadingPhotos}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
              {editingId ? t('update') : t('save')}
            </button>
            <button type="button" onClick={cancelForm} className={`px-6 py-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t('cancel')}
            </button>
          </div>
        </form>
      )}

      {memories.length === 0 ? (
        <div className={`rounded-2xl p-12 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('noMemoriesYet')}</h3>
          <p className="text-gray-400">{t('addFirstMemory')}</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 to-purple-500 hidden md:block" />

          {Object.entries(groupedMemories).sort((a, b) => b[0] - a[0]).map(([year, yearMemories]) => (
            <div key={year} className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold z-10">
                  {year.slice(2)}
                </div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{year}</h2>
              </div>

              <div className="space-y-4 md:ml-16">
                {yearMemories.map(memory => {
                  const IconComponent = getMoodIcon(memory.mood)
                  return (
                    <div
                      key={memory.id}
                      className={`rounded-2xl p-5 shadow-sm border hover:shadow-md transition-all cursor-pointer ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
                      onClick={() => setExpandedMemory(expandedMemory === memory.id ? null : memory.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-pink-500" />
                          </div>
                          <div>
                            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{memory.title}</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{formatDate(memory.date)} • {getDaysSince(memory.date)}</p>
                          </div>
                        </div>
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => handleEdit(memory)} className="p-2 text-gray-400 hover:text-blue-500">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(memory.id)}
                            className={`p-2 ${confirmDelete === memory.id ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                          >
                            {confirmDelete === memory.id ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {(expandedMemory === memory.id || memory.description) && (
                        <div className={`mt-4 ${expandedMemory === memory.id ? '' : 'line-clamp-2'}`}>
                          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{memory.description || t('noDescriptionAdded')}</p>
                        </div>
                      )}

                      {/* Photos Grid */}
                      {memory.photos && memory.photos.length > 0 && (
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-1">
                            {memory.photos.slice(0, expandedMemory === memory.id ? undefined : 4).map((photo) => (
                              <div key={photo.id} className="w-fit">
                                <img
                                  src={photo.url}
                                  alt={photo.name}
                                  className="h-48 w-auto object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 bg-gray-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setViewingPhoto(photo)
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          {!expandedMemory && memory.photos.length > 4 && (
                            <p className="text-sm text-pink-500 mt-2">+{memory.photos.length - 4} {t('morePhotos') || 'more photos'}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {memories.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white text-center">
          <Heart className="w-12 h-12 mx-auto mb-3 animate-pulse" />
          <h3 className="text-xl font-bold mb-2">{t('totalMemories').replace('{count}', memories.length)}</h3>
          <p className="opacity-90">{t('everyMomentPrecious')}</p>
        </div>
      )}

      {/* Photo Viewer Modal */}
      {viewingPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingPhoto(null)}
        >
          <button
            onClick={() => setViewingPhoto(null)}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={viewingPhoto.url}
            alt={viewingPhoto.name}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
