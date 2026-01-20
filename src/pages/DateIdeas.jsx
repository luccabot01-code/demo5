import { useState } from 'react'
import { Lightbulb, Plus, Trash2, Check, X, Star, Shuffle, Heart, Sun, Activity, Utensils, Film, Plane } from 'lucide-react'
import useStore from '../store/useStore'
import { getTranslation } from '../lib/i18n'

export default function DateIdeas() {
  const { dateIdeas, addDateIdea, updateDateIdea, toggleDateIdeaDone, rateDateIdea, deleteDateIdea, settings } = useStore()
  const t = (key) => getTranslation(settings.language, key)
  const isDark = settings.theme === 'dark'
  
  const CATEGORIES = [
    { value: 'romantic', label: t('romantic') || 'Romantic', icon: Heart, color: isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-100 text-pink-600' },
    { value: 'outdoor', label: t('outdoor') || 'Outdoor', icon: Sun, color: isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600' },
    { value: 'activity', label: t('activity') || 'Activity', icon: Activity, color: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600' },
    { value: 'food', label: t('food') || 'Food', icon: Utensils, color: isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600' },
    { value: 'entertainment', label: t('entertainment') || 'Entertainment', icon: Film, color: isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600' },
    { value: 'travel', label: t('travel') || 'Travel', icon: Plane, color: isDark ? 'bg-cyan-900/30 text-cyan-400' : 'bg-cyan-100 text-cyan-600' },
  ]
  
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [newIdea, setNewIdea] = useState({ title: '', description: '', category: 'romantic' })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [randomIdea, setRandomIdea] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newIdea.title.trim()) {
      if (editingId) {
        updateDateIdea(editingId, newIdea)
        setEditingId(null)
      } else {
        addDateIdea(newIdea)
      }
      setNewIdea({ title: '', description: '', category: 'romantic' })
      setShowForm(false)
    }
  }

  const handleEdit = (idea) => {
    setNewIdea({ title: idea.title, description: idea.description || '', category: idea.category })
    setEditingId(idea.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteDateIdea(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const handleRate = (id, rating) => {
    rateDateIdea(id, rating)
  }

  const getRandomIdea = () => {
    const pendingIdeas = dateIdeas.filter(i => !i.done)
    if (pendingIdeas.length > 0) {
      const random = pendingIdeas[Math.floor(Math.random() * pendingIdeas.length)]
      setRandomIdea(random)
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setNewIdea({ title: '', description: '', category: 'romantic' })
  }

  const filteredIdeas = dateIdeas.filter(idea => {
    if (filter === 'done' && !idea.done) return false
    if (filter === 'pending' && idea.done) return false
    if (categoryFilter !== 'all' && idea.category !== categoryFilter) return false
    return true
  })

  const stats = {
    total: dateIdeas.length,
    done: dateIdeas.filter(i => i.done).length,
    pending: dateIdeas.filter(i => !i.done).length,
    avgRating: dateIdeas.filter(i => i.rating).reduce((sum, i) => sum + i.rating, 0) / (dateIdeas.filter(i => i.rating).length || 1),
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Lightbulb className="w-8 h-8 text-pink-500" /> {t('dateIdeasTitle')}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('planPerfectDates')}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={getRandomIdea}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            <Shuffle className="w-5 h-5" /> {t('randomDate')}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" /> {t('addIdea')}
          </button>
        </div>
      </div>

      {/* Random Idea Modal */}
      {randomIdea && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setRandomIdea(null)}>
          <div className={`rounded-2xl p-8 max-w-md w-full text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="mb-4">
              {(() => {
                const category = CATEGORIES.find(c => c.value === randomIdea.category)
                const IconComponent = category?.icon || Heart
                return <IconComponent className="w-16 h-16 text-pink-500 mx-auto" />
              })()}
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>{randomIdea.title}</h3>
            {randomIdea.description && (
              <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{randomIdea.description}</p>
            )}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => { toggleDateIdeaDone(randomIdea.id); setRandomIdea(null); }}
                className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
              >
                {t('letsDoIt') || "Let's Do It!"} 🎉
              </button>
              <button
                onClick={getRandomIdea}
                className={`px-6 py-2 rounded-xl ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {t('anotherIdea') || 'Another Idea'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('totalIdeas') || 'Total Ideas'}</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stats.total}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('done')}</p>
          <p className="text-2xl font-bold text-green-500">{stats.done}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('pending')}</p>
          <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('avgRating') || 'Avg. Rating'}</p>
          <p className="text-2xl font-bold text-yellow-500 flex items-center gap-1">
            <Star className="w-5 h-5 fill-current" /> {stats.avgRating.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-2">
          {[
            { value: 'all', label: t('all') },
            { value: 'pending', label: t('pending') },
            { value: 'done', label: t('done') },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === value ? 'bg-pink-500 text-white' : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-2 rounded-xl text-sm transition-all ${categoryFilter === 'all' ? 'bg-gray-800 text-white' : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {t('all')}
          </button>
          {CATEGORIES.map(cat => {
            const IconComponent = cat.icon
            return (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-1 ${categoryFilter === cat.value ? 'bg-gray-800 text-white' : isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <IconComponent className="w-4 h-4" />
              </button>
            )
          })}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{editingId ? t('editIdea') : t('newIdea')}</h3>
            <button type="button" onClick={cancelForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder={t('ideaTitle')}
              value={newIdea.title}
              onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
              required
            />
            <select
              value={newIdea.category}
              onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder={t('ideaDescription')}
            value={newIdea.description}
            onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
            rows={2}
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4 resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
          />
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
              {editingId ? t('update') : t('add')}
            </button>
            <button type="button" onClick={cancelForm} className={`px-6 py-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t('cancel')}
            </button>
          </div>
        </form>
      )}

      {filteredIdeas.length === 0 ? (
        <div className={`rounded-2xl p-12 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <Lightbulb className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('noIdeasYet')}</h3>
          <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>{t('addFirstIdea')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map(idea => {
            const category = CATEGORIES.find(c => c.value === idea.category)
            const IconComponent = category?.icon || Heart
            return (
              <div
                key={idea.id}
                className={`rounded-2xl p-5 shadow-sm border transition-all ${
                  idea.done 
                    ? isDark ? 'border-green-800 bg-green-900/20' : 'border-green-200 bg-green-50/30'
                    : isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-100 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-6 h-6 text-pink-500" />
                    <span className={`text-xs px-2 py-1 rounded-full ${category?.color}`}>{category?.label}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(idea)} className="p-1 text-gray-400 hover:text-blue-500">
                      <Lightbulb className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className={`p-1 ${confirmDelete === idea.id ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      {confirmDelete === idea.id ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <h3 className={`font-semibold mb-2 ${idea.done ? isDark ? 'text-gray-500 line-through' : 'text-gray-500 line-through' : isDark ? 'text-white' : 'text-gray-800'}`}>
                  {idea.title}
                </h3>
                {idea.description && (
                  <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{idea.description}</p>
                )}

                {/* Rating */}
                {idea.done && (
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => handleRate(idea.id, star)}
                        className={`transition-colors ${
                          star <= (idea.rating || 0) ? 'text-yellow-400' : isDark ? 'text-gray-600 hover:text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${star <= (idea.rating || 0) ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => toggleDateIdeaDone(idea.id)}
                  className={`w-full py-2 rounded-xl font-medium transition-all ${
                    idea.done
                      ? isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-md'
                  }`}
                >
                  {idea.done ? t('undoAction') : t('weDid')}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
