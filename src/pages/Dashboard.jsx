import { CheckSquare, Wallet, Target, Heart, Calendar, AlertCircle, Gift, Sparkles, Mail, Camera, Check, Shuffle, ShoppingCart, Plus, Copy, Share2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useStore from '../store/useStore'
import { getGoalIcon } from '../lib/iconHelper'
import { getTranslation } from '../lib/i18n'

export default function Dashboard() {
  const { coupleId } = useParams()
  const { couple, tasks, budget, goals, events, wishlist, memories, loveNotes, habits, dateIdeas, settings, currentUser } = useStore()
  const t = (key) => getTranslation(settings.language, key)
  const [showWelcome, setShowWelcome] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const isDark = settings.theme === 'dark'
  
  // Check if this is first visit for this couple
  useEffect(() => {
    if (coupleId) {
      const welcomeShownKey = `welcome_shown_${coupleId}`
      const hasSeenWelcome = localStorage.getItem(welcomeShownKey)
      if (!hasSeenWelcome) {
        setShowWelcome(true)
      }
    }
  }, [coupleId])

  const handleCloseWelcome = () => {
    if (coupleId) {
      localStorage.setItem(`welcome_shown_${coupleId}`, 'true')
    }
    setShowWelcome(false)
  }

  const handleCopyLink = async () => {
    const link = window.location.href
    try {
      await navigator.clipboard.writeText(link)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = link
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }
  
  const completedTasks = tasks.filter(t => t.completed).length
  const totalGoalProgress = goals.length > 0 ? goals.reduce((acc, g) => acc + (g.current / g.target) * 100, 0) / goals.length : 0
  const totalSpent = budget.categories.reduce((sum, c) => sum + c.spent, 0)
  const budgetUsed = budget.total > 0 ? (totalSpent / budget.total) * 100 : 0
  const overdueTasks = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
  const unreadLoveNotes = loveNotes.filter(n => !n.read && n.to === currentUser).length
  const today = new Date().toISOString().split('T')[0]
  const todayHabits = habits.filter(h => h.completions[today]).length
  const pendingWishlist = wishlist.filter(w => !w.purchased).length

  const formatMoney = (amount) => {
    const locale = settings.language === 'tr' ? 'tr-TR' : 'en-US'
    return new Intl.NumberFormat(locale, { style: 'currency', currency: settings.currency || 'TRY' }).format(amount)
  }

  // Calculate days together
  const daysTogether = couple.relationshipStart 
    ? Math.floor((new Date() - new Date(couple.relationshipStart)) / (1000 * 60 * 60 * 24))
    : null

  // Days until wedding
  const daysUntilWedding = couple.weddingDate && new Date(couple.weddingDate) > new Date()
    ? Math.floor((new Date(couple.weddingDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  // Upcoming events (next 7 days)
  const upcomingEvents = events.filter(e => {
    const eventDate = new Date(e.date)
    const now = new Date()
    const weekLater = new Date()
    weekLater.setDate(weekLater.getDate() + 7)
    return eventDate >= now && eventDate <= weekLater
  }).sort((a, b) => new Date(a.date) - new Date(b.date))

  const stats = [
    { label: t('tasks'), value: `${completedTasks}/${tasks.length}`, icon: CheckSquare, color: 'from-blue-500 to-cyan-500', link: 'tasks' },
    { label: t('budget'), value: `%${budgetUsed.toFixed(0)}`, icon: Wallet, color: 'from-green-500 to-emerald-500', link: 'budget' },
    { label: t('goals'), value: `%${totalGoalProgress.toFixed(0)}`, icon: Target, color: 'from-purple-500 to-pink-500', link: 'goals' },
    { label: t('habits'), value: `${todayHabits}/${habits.length}`, icon: Sparkles, color: 'from-orange-500 to-yellow-500', link: 'habits' },
  ]

  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999'))
    .slice(0, 4)

  const recentExpenses = [...budget.expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4)

  return (
    <div>
      {/* Welcome Modal - First Time Users */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">{t('welcomeModalTitle')}</h2>
              <p className="text-sm opacity-90 mt-2">{couple.partner1.name} & {couple.partner2.name}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className={`text-center mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('welcomeModalDesc')}
              </p>

              {/* Link Box */}
              <div className={`rounded-xl p-4 mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-xs font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Share2 className="w-4 h-4" /> {t('shareThisLink')}
                </p>
                <div className={`flex items-center gap-2 p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? window.location.href : ''}
                    className={`flex-1 text-sm bg-transparent outline-none ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      linkCopied 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-md'
                    }`}
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        {t('linkCopied')}
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        {t('copyLink')}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseWelcome}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {t('gotIt')} 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <div className="relative z-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 mb-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              {t('welcome')} <Heart className="w-8 h-8 animate-pulse" />
            </h1>
            <p className="opacity-90 mt-1">{couple.partner1.name} & {couple.partner2.name}</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            {daysTogether && (
              <div className="text-center">
                <p className="text-3xl font-bold">{daysTogether}</p>
                <p className="text-sm opacity-80">{t('daysTogether')}</p>
              </div>
            )}
            {daysUntilWedding && (
              <div className="text-center border-l border-white/30 pl-4">
                <p className="text-3xl font-bold">{daysUntilWedding}</p>
                <p className="text-sm opacity-80">{t('daysUntilWedding')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-3 mb-6">
        {overdueTasks > 0 && (
          <Link to="tasks" className={`block rounded-xl p-4 flex items-center gap-3 transition-colors ${isDark ? 'bg-red-900/20 border border-red-800 hover:bg-red-900/30' : 'bg-red-50 border border-red-200 hover:bg-red-100'}`}>
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <p className={`font-medium ${isDark ? 'text-red-400' : 'text-red-700'}`}>{overdueTasks} {t('overdueTasks')}</p>
              <p className={`text-sm ${isDark ? 'text-red-500' : 'text-red-600'}`}>{t('goToTasks')}</p>
            </div>
          </Link>
        )}
        {unreadLoveNotes > 0 && (
          <Link to="love-notes" className={`block rounded-xl p-4 flex items-center gap-3 transition-colors ${isDark ? 'bg-pink-900/20 border border-pink-800 hover:bg-pink-900/30' : 'bg-pink-50 border border-pink-200 hover:bg-pink-100'}`}>
            <Mail className="w-6 h-6 text-pink-500 flex-shrink-0" />
            <div>
              <p className={`font-medium ${isDark ? 'text-pink-400' : 'text-pink-700'}`}>{unreadLoveNotes} {t('unreadLoveNotes')}</p>
              <p className={`text-sm ${isDark ? 'text-pink-500' : 'text-pink-600'}`}>{t('readNotes')}</p>
            </div>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color, link }) => (
          <Link
            key={label}
            to={link}
            className={`rounded-2xl p-4 shadow-sm border hover:shadow-md transition-all group ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
            <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{value}</p>
          </Link>
        ))}
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className={`rounded-2xl p-5 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <Calendar className="w-5 h-5 text-purple-500" /> {t('upcomingEvents')}
            </h2>
            <Link to="calendar" className="text-sm text-pink-500 hover:underline">{t('calendar')}</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                className="flex-shrink-0 p-3 rounded-xl border-l-4"
                style={{ borderColor: event.color, backgroundColor: isDark ? `${event.color}20` : `${event.color}10`, minWidth: '200px' }}
              >
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{event.title}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(event.date).toLocaleDateString(settings.language === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short' })}
                  {event.time && ` • ${event.time}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tasks */}
        <div className={`rounded-2xl p-5 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <CheckSquare className="w-5 h-5 text-blue-500" /> {t('upcomingTasks')}
            </h2>
            <Link to="tasks" className="text-sm text-pink-500 hover:underline">{t('all')}</Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-4">
              <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>{t('noTasks')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map(task => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
                return (
                  <div key={task.id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isOverdue ? 'bg-red-500' : 'bg-blue-500'}`} />
                    <span className={`flex-1 truncate text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{task.title}</span>
                    {task.dueDate && (
                      <span className={`text-xs flex-shrink-0 ${isOverdue ? 'text-red-500' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {task.dueDate}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Goals */}
        <div className={`rounded-2xl p-5 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <Target className="w-5 h-5 text-purple-500" /> {t('goals')}
            </h2>
            <Link to="goals" className="text-sm text-pink-500 hover:underline">{t('all')}</Link>
          </div>
          {goals.length === 0 ? (
            <p className={`text-center py-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('noGoals')}</p>
          ) : (
            <div className="space-y-3">
              {goals.slice(0, 3).map(goal => {
                const progress = (goal.current / goal.target) * 100
                const isComplete = progress >= 100
                const IconComponent = getGoalIcon(goal.icon)
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <IconComponent className="w-4 h-4" /> {goal.title}
                      </span>
                      <span className={`text-xs ${isComplete ? 'text-green-500' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        %{Math.min(progress, 100).toFixed(0)}
                      </span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div 
                        className={`h-full rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recent Expenses */}
        <div className={`rounded-2xl p-5 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`font-semibold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <Wallet className="w-4 h-4 text-green-500" /> {t('recentExpenses')}
            </h3>
            <Link to="budget" className="text-xs text-pink-500 hover:underline">→</Link>
          </div>
          {recentExpenses.length === 0 ? (
            <p className={`text-center py-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('noExpenses')}</p>
          ) : (
            <div className="space-y-2">
              {recentExpenses.slice(0, 3).map(expense => (
                <div key={expense.id} className="flex items-center justify-between">
                  <span className={`text-sm truncate flex-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{expense.description}</span>
                  <span className="text-sm font-medium text-red-500 ml-2">-{formatMoney(expense.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist */}
        <div className={`rounded-2xl p-5 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`font-semibold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <Gift className="w-4 h-4 text-pink-500" /> {t('wishlist')}
            </h3>
            <Link to="wishlist" className="text-xs text-pink-500 hover:underline">→</Link>
          </div>
          <div className="text-center py-2">
            <p className="text-3xl font-bold text-pink-500">{pendingWishlist}</p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('pendingWishes')}</p>
          </div>
        </div>

        {/* Memories */}
        <div className={`rounded-2xl p-5 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`font-semibold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <Camera className="w-4 h-4 text-purple-500" /> {t('memories')}
            </h3>
            <Link to="memories" className="text-xs text-pink-500 hover:underline">→</Link>
          </div>
          <div className="text-center py-2">
            <p className="text-3xl font-bold text-purple-500">{memories.length}</p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('specialMoments')}</p>
          </div>
        </div>

        {/* Date Ideas */}
        <div className={`rounded-2xl p-5 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`font-semibold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              <Heart className="w-4 h-4 text-red-500" /> {t('dateIdeas')}
            </h3>
            <Link to="date-ideas" className="text-xs text-pink-500 hover:underline">→</Link>
          </div>
          <div className="text-center py-2">
            <p className="text-3xl font-bold text-red-500">{dateIdeas.filter(d => !d.done).length}</p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('activitiesToDo')}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`mt-6 rounded-2xl p-5 border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-r from-gray-50 to-pink-50 border-gray-100'}`}>
        <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('quickActions')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <Link to="tasks" className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 hover:scale-95 active:scale-90 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-blue-900/30 hover:border-blue-500' : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300 shadow-sm hover:shadow-md'}`}>
            <div className={`p-3 rounded-full transition-colors ${isDark ? 'bg-blue-900/30 group-hover:bg-blue-500' : 'bg-blue-100 group-hover:bg-blue-500'}`}>
              <CheckSquare className={`w-5 h-5 transition-colors ${isDark ? 'text-blue-400 group-hover:text-white' : 'text-blue-500 group-hover:text-white'}`} />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('addTask')}</span>
          </Link>
          <Link to="notes" className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 hover:scale-95 active:scale-90 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-yellow-900/30 hover:border-yellow-500' : 'bg-white border-gray-200 hover:bg-yellow-50 hover:border-yellow-300 shadow-sm hover:shadow-md'}`}>
            <div className={`p-3 rounded-full transition-colors ${isDark ? 'bg-yellow-900/30 group-hover:bg-yellow-500' : 'bg-yellow-100 group-hover:bg-yellow-500'}`}>
              <Plus className={`w-5 h-5 transition-colors ${isDark ? 'text-yellow-400 group-hover:text-white' : 'text-yellow-500 group-hover:text-white'}`} />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('addNote')}</span>
          </Link>
          <Link to="goals" className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 hover:scale-95 active:scale-90 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-purple-900/30 hover:border-purple-500' : 'bg-white border-gray-200 hover:bg-purple-50 hover:border-purple-300 shadow-sm hover:shadow-md'}`}>
            <div className={`p-3 rounded-full transition-colors ${isDark ? 'bg-purple-900/30 group-hover:bg-purple-500' : 'bg-purple-100 group-hover:bg-purple-500'}`}>
              <Target className={`w-5 h-5 transition-colors ${isDark ? 'text-purple-400 group-hover:text-white' : 'text-purple-500 group-hover:text-white'}`} />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('addGoal')}</span>
          </Link>
          <Link to="love-notes" className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 hover:scale-95 active:scale-90 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-pink-900/30 hover:border-pink-500' : 'bg-white border-gray-200 hover:bg-pink-50 hover:border-pink-300 shadow-sm hover:shadow-md'}`}>
            <div className={`p-3 rounded-full transition-colors ${isDark ? 'bg-pink-900/30 group-hover:bg-pink-500' : 'bg-pink-100 group-hover:bg-pink-500'}`}>
              <Mail className={`w-5 h-5 transition-colors ${isDark ? 'text-pink-400 group-hover:text-white' : 'text-pink-500 group-hover:text-white'}`} />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('sendLoveNote')}</span>
          </Link>
          <Link to="date-ideas" className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 hover:scale-95 active:scale-90 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-red-900/30 hover:border-red-500' : 'bg-white border-gray-200 hover:bg-red-50 hover:border-red-300 shadow-sm hover:shadow-md'}`}>
            <div className={`p-3 rounded-full transition-colors ${isDark ? 'bg-red-900/30 group-hover:bg-red-500' : 'bg-red-100 group-hover:bg-red-500'}`}>
              <Heart className={`w-5 h-5 transition-colors ${isDark ? 'text-red-400 group-hover:text-white' : 'text-red-500 group-hover:text-white'}`} />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('randomDate')}</span>
          </Link>
          <Link to="shopping" className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 hover:scale-95 active:scale-90 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-orange-900/30 hover:border-orange-500' : 'bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-300 shadow-sm hover:shadow-md'}`}>
            <div className={`p-3 rounded-full transition-colors ${isDark ? 'bg-orange-900/30 group-hover:bg-orange-500' : 'bg-orange-100 group-hover:bg-orange-500'}`}>
              <ShoppingCart className={`w-5 h-5 transition-colors ${isDark ? 'text-orange-400 group-hover:text-white' : 'text-orange-500 group-hover:text-white'}`} />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('shoppingList')}</span>
          </Link>
          <Link to="calendar" className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 hover:scale-95 active:scale-90 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-cyan-900/30 hover:border-cyan-500' : 'bg-white border-gray-200 hover:bg-cyan-50 hover:border-cyan-300 shadow-sm hover:shadow-md'}`}>
            <div className={`p-3 rounded-full transition-colors ${isDark ? 'bg-cyan-900/30 group-hover:bg-cyan-500' : 'bg-cyan-100 group-hover:bg-cyan-500'}`}>
              <Calendar className={`w-5 h-5 transition-colors ${isDark ? 'text-cyan-400 group-hover:text-white' : 'text-cyan-500 group-hover:text-white'}`} />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('addEvent')}</span>
          </Link>
          <Link to="budget" className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 hover:scale-95 active:scale-90 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-green-900/30 hover:border-green-500' : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300 shadow-sm hover:shadow-md'}`}>
            <div className={`p-3 rounded-full transition-colors ${isDark ? 'bg-green-900/30 group-hover:bg-green-500' : 'bg-green-100 group-hover:bg-green-500'}`}>
              <Wallet className={`w-5 h-5 transition-colors ${isDark ? 'text-green-400 group-hover:text-white' : 'text-green-500 group-hover:text-white'}`} />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('addExpense')}</span>
          </Link>
          <Link to="wishlist" className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 hover:scale-95 active:scale-90 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-indigo-900/30 hover:border-indigo-500' : 'bg-white border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 shadow-sm hover:shadow-md'}`}>
            <div className={`p-3 rounded-full transition-colors ${isDark ? 'bg-indigo-900/30 group-hover:bg-indigo-500' : 'bg-indigo-100 group-hover:bg-indigo-500'}`}>
              <Gift className={`w-5 h-5 transition-colors ${isDark ? 'text-indigo-400 group-hover:text-white' : 'text-indigo-500 group-hover:text-white'}`} />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('addWish')}</span>
          </Link>
          <Link to="memories" className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 hover:scale-95 active:scale-90 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-fuchsia-900/30 hover:border-fuchsia-500' : 'bg-white border-gray-200 hover:bg-fuchsia-50 hover:border-fuchsia-300 shadow-sm hover:shadow-md'}`}>
            <div className={`p-3 rounded-full transition-colors ${isDark ? 'bg-fuchsia-900/30 group-hover:bg-fuchsia-500' : 'bg-fuchsia-100 group-hover:bg-fuchsia-500'}`}>
              <Camera className={`w-5 h-5 transition-colors ${isDark ? 'text-fuchsia-400 group-hover:text-white' : 'text-fuchsia-500 group-hover:text-white'}`} />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('addMemory')}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
