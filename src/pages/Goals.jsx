import { useState } from 'react'
import { Target, Plus, TrendingUp, Trash2, Edit3, X, Check, Minus, History } from 'lucide-react'
import useStore from '../store/useStore'
import { getGoalIcon } from '../lib/iconHelper'
import { getTranslation } from '../lib/i18n'

const ICONS = [
  { icon: 'Home', label: 'Home' },
  { icon: 'Plane', label: 'Plane' },
  { icon: 'Shield', label: 'Shield' },
  { icon: 'Heart', label: 'Heart' },
  { icon: 'Car', label: 'Car' },
  { icon: 'Baby', label: 'Baby' },
  { icon: 'BookOpen', label: 'Book' },
  { icon: 'DollarSign', label: 'Money' },
  { icon: 'GraduationCap', label: 'Graduation' },
  { icon: 'Palmtree', label: 'Vacation' },
  { icon: 'Laptop', label: 'Laptop' },
  { icon: 'Gift', label: 'Gift' },
  { icon: 'Gem', label: 'Diamond' },
  { icon: 'Building', label: 'Building' },
  { icon: 'Target', label: 'Target' },
]
const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#6366f1', '#14b8a6']

export default function Goals() {
  const { goals, addGoal, updateGoal, updateGoalProgress, deleteGoal, deleteGoalContribution, settings } = useStore()
  const t = (key) => getTranslation(settings.language, key)
  const isDark = settings.theme === 'dark'
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newGoal, setNewGoal] = useState({ title: '', target: '', deadline: '', icon: 'Target', color: '#10b981' })
  const [addAmount, setAddAmount] = useState({})
  const [addNote, setAddNote] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [expandedGoal, setExpandedGoal] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newGoal.title.trim() && newGoal.target) {
      if (editingId) {
        updateGoal(editingId, { ...newGoal, target: Number(newGoal.target) })
        setEditingId(null)
      } else {
        addGoal({ ...newGoal, target: Number(newGoal.target) })
      }
      setNewGoal({ title: '', target: '', deadline: '', icon: '🎯', color: '#10b981' })
      setShowForm(false)
    }
  }

  const handleEdit = (goal) => {
    setNewGoal({ title: goal.title, target: goal.target, deadline: goal.deadline, icon: goal.icon, color: goal.color || '#10b981' })
    setEditingId(goal.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteGoal(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const handleAddProgress = (goalId, isSubtract = false) => {
    const amount = Number(addAmount[goalId] || 0)
    if (amount > 0) {
      updateGoalProgress(goalId, isSubtract ? -amount : amount, addNote[goalId] || '')
      setAddAmount({ ...addAmount, [goalId]: '' })
      setAddNote({ ...addNote, [goalId]: '' })
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setNewGoal({ title: '', target: '', deadline: '', icon: 'Target', color: '#10b981' })
  }

  const formatMoney = (amount) => {
    const locale = settings.language === 'tr' ? 'tr-TR' : 'en-US'
    return new Intl.NumberFormat(locale, { style: 'currency', currency: settings.currency || 'TRY' }).format(amount)
  }

  // Stats
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0)
  const totalCurrent = goals.reduce((sum, g) => sum + g.current, 0)
  const completedGoals = goals.filter(g => g.current >= g.target).length

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Target className="w-8 h-8 text-pink-500" /> {t('sharedGoals')}
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('reachDreamsTogether')}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> {t('newGoal')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('totalGoals')}</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{goals.length}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('completedGoals')}</p>
          <p className="text-2xl font-bold text-green-500">{completedGoals}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('totalSaved')}</p>
          <p className="text-2xl font-bold text-blue-500">{formatMoney(totalCurrent)}</p>
        </div>
        <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('targetAmount')}</p>
          <p className="text-2xl font-bold text-purple-500">{formatMoney(totalTarget)}</p>
        </div>
      </div>

      {/* Overall Progress */}
      {goals.length > 0 && (
        <div className={`rounded-2xl p-5 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between mb-2">
            <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('overallProgress')}</span>
            <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>%{totalTarget > 0 ? ((totalCurrent / totalTarget) * 100).toFixed(0) : 0}</span>
          </div>
          <div className={`h-4 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${totalTarget > 0 ? Math.min((totalCurrent / totalTarget) * 100, 100) : 0}%` }}
            />
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{editingId ? t('editGoal') : t('addNewGoal')}</h3>
            <button type="button" onClick={cancelForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('selectIcon')}</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(({ icon, label }) => {
                const IconComponent = getGoalIcon(icon)
                return (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewGoal({ ...newGoal, icon })}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      newGoal.icon === icon ? 'bg-pink-100 ring-2 ring-pink-500' : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
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
            <label className={`block text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('selectColor')}</label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewGoal({ ...newGoal, color })}
                  className={`w-8 h-8 rounded-full transition-all ${newGoal.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder={t('goalName')}
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
              required
            />
            <input
              type="number"
              placeholder={t('targetAmountPlaceholder')}
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
              required
            />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            />
          </div>
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

      {goals.length === 0 ? (
        <div className={`rounded-2xl p-12 shadow-sm border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t('noGoalsYet')}</h3>
          <p className="text-gray-400">{t('addFirstGoal')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map(goal => {
            const progress = (goal.current / goal.target) * 100
            const remaining = goal.target - goal.current
            const isComplete = goal.current >= goal.target
            const isExpanded = expandedGoal === goal.id

            return (
              <div key={goal.id} className={`rounded-2xl shadow-sm border transition-all ${isComplete ? 'border-green-200 bg-green-50/30 dark:bg-green-900/10 dark:border-green-800' : isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${goal.color}20` }}
                      >
                        {(() => {
                          const IconComponent = getGoalIcon(goal.icon)
                          return <IconComponent className="w-6 h-6" style={{ color: goal.color }} />
                        })()}
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{goal.title}</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('deadline')}: {goal.deadline || t('notSpecified')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <History className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className={`p-2 transition-colors ${confirmDelete === goal.id ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        {confirmDelete === goal.id ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right mb-2">
                    <p className={`text-2xl font-bold ${isComplete ? 'text-green-500' : isDark ? 'text-white' : 'text-gray-800'}`}>
                      %{Math.min(progress, 100).toFixed(0)} {isComplete && '✓'}
                    </p>
                  </div>
                  
                  <div className={`h-3 rounded-full overflow-hidden mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: isComplete ? '#10b981' : goal.color }}
                    />
                  </div>

                  <div className="flex justify-between text-sm mb-4">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{t('saved')}: <span className="text-green-600 font-medium">{formatMoney(goal.current)}</span></span>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{t('remaining')}: <span className="text-orange-500 font-medium">{formatMoney(Math.max(0, remaining))}</span></span>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder={t('enterAmount')}
                      value={addAmount[goal.id] || ''}
                      onChange={(e) => setAddAmount({ ...addAmount, [goal.id]: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                    />
                    <input
                      type="text"
                      placeholder={t('noteOptional')}
                      value={addNote[goal.id] || ''}
                      onChange={(e) => setAddNote({ ...addNote, [goal.id]: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddProgress(goal.id, true)}
                        className="flex-1 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <Minus className="w-4 h-4" /> {t('subtract')}
                      </button>
                      <button
                        onClick={() => handleAddProgress(goal.id)}
                        className="flex-1 py-2 text-white rounded-xl hover:opacity-90 transition-colors flex items-center justify-center gap-1"
                        style={{ backgroundColor: goal.color }}
                      >
                        <TrendingUp className="w-4 h-4" /> {t('add')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contribution History */}
                {isExpanded && goal.contributions?.length > 0 && (
                  <div className={`border-t p-4 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <p className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('contributionHistory')}</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {[...goal.contributions].reverse().map(contrib => (
                        <div key={contrib.id} className={`flex items-center justify-between p-2 rounded-lg text-sm ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <div>
                            <span className={contrib.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                              {contrib.amount > 0 ? '+' : ''}{formatMoney(contrib.amount)}
                            </span>
                            {contrib.note && <span className="text-gray-400 ml-2">• {contrib.note}</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">{contrib.date}</span>
                            <button
                              onClick={() => deleteGoalContribution(goal.id, contrib.id)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
