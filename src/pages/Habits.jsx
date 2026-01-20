import { useState } from 'react'
import { Sparkles, Plus, Trash2, Check, X, Flame, Calendar } from 'lucide-react'
import useStore from '../store/useStore'
import { getHabitIcon } from '../lib/iconHelper'
import { getTranslation } from '../lib/i18n'

const getHabitIcons = (t) => [
  { icon: 'Activity', label: t('activity') },
  { icon: 'Film', label: t('movie') },
  { icon: 'BookOpen', label: t('book') },
  { icon: 'Heart', label: t('heart') },
  { icon: 'Dumbbell', label: t('sports') },
  { icon: 'Coffee', label: t('coffee') },
  { icon: 'Moon', label: t('sleep') },
  { icon: 'Users', label: t('together') },
  { icon: 'Gamepad', label: t('game') },
  { icon: 'Music', label: t('music') },
  { icon: 'Sun', label: t('morning') },
  { icon: 'Utensils', label: t('food') },
]

const getFrequencies = (t) => [
  { value: 'daily', label: t('daily') },
  { value: 'weekly', label: t('weekly') },
]

export default function Habits() {
  const { habits, addHabit, toggleHabitCompletion, deleteHabit, settings } = useStore()
  const t = (key) => getTranslation(settings.language, key)
  const isDark = settings.theme === 'dark'
  const [showForm, setShowForm] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: '', icon: 'Activity', frequency: 'daily' })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const HABIT_ICONS = getHabitIcons(t)
  const FREQUENCIES = getFrequencies(t)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newHabit.name.trim()) {
      addHabit(newHabit)
      setNewHabit({ name: '', icon: 'Activity', frequency: 'daily' })
      setShowForm(false)
    }
  }

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteHabit(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  // Generate last 7 days
  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString(settings.language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        isToday: i === 0,
      })
    }
    return days
  }

  const last7Days = getLast7Days()
  const today = new Date().toISOString().split('T')[0]

  // Calculate overall stats
  const totalCompletionsToday = habits.filter(h => h.completions[today]).length
  const longestStreak = Math.max(...habits.map(h => h.streak), 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Sparkles className="w-8 h-8 text-pink-500" /> {t('habits')}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('habitsDesc')}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> {t('newHabit')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('completedToday')}</p>
          <p className="text-2xl font-bold text-green-500">{totalCompletionsToday}/{habits.length}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('longestStreak')}</p>
          <p className="text-2xl font-bold text-orange-500 flex items-center gap-2">
            <Flame className="w-6 h-6" /> {longestStreak} {t('days')}
          </p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('totalHabits')}</p>
          <p className="text-2xl font-bold text-purple-500">{habits.length}</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('newHabit')}</h3>
            <button type="button" onClick={() => setShowForm(false)} className={isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('selectIcon')}</label>
            <div className="flex flex-wrap gap-2">
              {HABIT_ICONS.map(({ icon, label }) => {
                const IconComponent = getHabitIcon(icon)
                return (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewHabit({ ...newHabit, icon })}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      newHabit.icon === icon 
                        ? 'bg-pink-100 dark:bg-pink-900/30 ring-2 ring-pink-500' 
                        : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
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
              placeholder={t('habitName')}
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200'}`}
              required
            />
            <select
              value={newHabit.frequency}
              onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            >
              {FREQUENCIES.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors">
              {t('add')}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className={`px-6 py-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t('cancel')}
            </button>
          </div>
        </form>
      )}

      {habits.length === 0 ? (
        <div className={`rounded-2xl p-12 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <Sparkles className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('noHabitsYet')}</h3>
          <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>{t('addHabitsTogether')}</p>
        </div>
      ) : (
        <div className={`rounded-2xl shadow-sm border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          {/* Header with days */}
          <div className={`grid grid-cols-[1fr_repeat(7,48px)_80px] gap-2 p-4 border-b ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
            <div className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('habit')}</div>
            {last7Days.map(day => (
              <div key={day.date} className={`text-center ${day.isToday ? 'text-pink-500 font-bold' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="text-xs">{day.day}</div>
                <div className="text-sm">{day.dayNum}</div>
              </div>
            ))}
            <div className={`text-center font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('streak')}</div>
          </div>

          {/* Habits rows */}
          <div className={isDark ? 'divide-y divide-gray-700' : 'divide-y divide-gray-100'}>
            {habits.map(habit => {
              const IconComponent = getHabitIcon(habit.icon)
              return (
                <div key={habit.id} className={`grid grid-cols-[1fr_repeat(7,48px)_80px] gap-2 p-4 items-center ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-6 h-6 text-pink-500" />
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{habit.name}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {FREQUENCIES.find(f => f.value === habit.frequency)?.label}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(habit.id)}
                      className={`ml-auto p-1 ${confirmDelete === habit.id ? 'text-red-500' : isDark ? 'text-gray-600 hover:text-red-400' : 'text-gray-300 hover:text-red-500'}`}
                    >
                      {confirmDelete === habit.id ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                  {last7Days.map(day => {
                    const isCompleted = habit.completions[day.date]
                    return (
                      <button
                        key={day.date}
                        onClick={() => toggleHabitCompletion(habit.id, day.date)}
                        className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : day.isToday
                            ? 'bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 text-pink-500'
                            : isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-400'
                        }`}
                      >
                        {isCompleted ? <Check className="w-5 h-5" /> : ''}
                      </button>
                    )
                  })}
                  <div className="text-center">
                    {habit.streak > 0 ? (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                        <Flame className="w-4 h-4" /> {habit.streak}
                      </span>
                    ) : (
                      <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>-</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Motivation */}
      {habits.length > 0 && totalCompletionsToday === habits.length && (
        <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">{t('greatJobAllCompleted')}</h3>
          <p className="opacity-90">{t('keepItUp')}</p>
        </div>
      )}
    </div>
  )
}
