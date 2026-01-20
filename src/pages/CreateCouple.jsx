import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ArrowRight, Loader, Users, Trash2, Clock, Globe, ChevronDown } from 'lucide-react'
import { generateCoupleId, createCouple, saveCouple, getSavedCouples, removeSavedCouple, isSupabaseConfigured } from '../lib/supabase'
import { saveCoupleData } from '../lib/db'
import { getTranslation, getInitialLanguage, languages } from '../lib/i18n'

export default function CreateCouple() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [partner1, setPartner1] = useState('')
  const [partner2, setPartner2] = useState('')
  const [currentLang, setCurrentLang] = useState('tr')
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [error, setError] = useState('')
  const [savedCouples, setSavedCouples] = useState([])
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

  // Detect language on mount and apply dark mode
  useEffect(() => {
    const initialLang = getInitialLanguage()
    setCurrentLang(initialLang)
    
    // Load saved couples
    const couples = getSavedCouples()
    setSavedCouples(couples)
    
    // Apply dark mode from localStorage (default to light)
    const savedDarkMode = localStorage.getItem('darkMode')
    const isDark = savedDarkMode === 'true'
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const t = (key) => getTranslation(currentLang, key)

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!partner1.trim() || !partner2.trim()) {
      setError(t('enterBothNames') || 'Lütfen her iki ismi de girin')
      return
    }

    setLoading(true)

    try {
      const coupleId = generateCoupleId()
      
      // Prepare initial data
      const initialData = {
        couple: {
          partner1: { name: partner1.trim(), avatar: 'User', birthday: '', color: '#ec4899' },
          partner2: { name: partner2.trim(), avatar: 'UserCircle', birthday: '', color: '#8b5cf6' },
          anniversary: '',
          weddingDate: '',
          relationshipStart: '',
        },
        tasks: [],
        taskCategories: currentLang === 'tr' ? [
          { id: 'wedding', name: 'Düğün', color: '#ec4899', icon: 'Heart' },
          { id: 'home', name: 'Ev', color: '#10b981', icon: 'Home' },
          { id: 'travel', name: 'Seyahat', color: '#06b6d4', icon: 'Plane' },
          { id: 'shopping', name: 'Alışveriş', color: '#f59e0b', icon: 'ShoppingBag' },
          { id: 'health', name: 'Sağlık', color: '#ef4444', icon: 'Activity' },
          { id: 'other', name: 'Diğer', color: '#6b7280', icon: 'Circle' },
        ] : [
          { id: 'wedding', name: 'Wedding', color: '#ec4899', icon: 'Heart' },
          { id: 'home', name: 'Home', color: '#10b981', icon: 'Home' },
          { id: 'travel', name: 'Travel', color: '#06b6d4', icon: 'Plane' },
          { id: 'shopping', name: 'Shopping', color: '#f59e0b', icon: 'ShoppingBag' },
          { id: 'health', name: 'Health', color: '#ef4444', icon: 'Activity' },
          { id: 'other', name: 'Other', color: '#6b7280', icon: 'Circle' },
        ],
        budget: { total: 0, currency: 'TRY', categories: [], expenses: [], income: [] },
        notes: [],
        goals: [],
        events: [],
        wishlist: [],
        memories: [],
        shoppingLists: [],
        loveNotes: [],
        habits: [],
        dateIdeas: [],
        mealPlan: {},
        settings: {
          theme: localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light',
          language: getInitialLanguage(),
          notifications: true,
          weekStartsOn: 'monday',
          dateFormat: 'DD/MM/YYYY',
          currency: 'TRY',
          pin: null,
          email: null,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      // Save locally first
      await saveCoupleData(coupleId, initialData)
      
      // Create in Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          // Add coupleId to initialData before sending to Supabase
          const dataWithId = { ...initialData, coupleId }
          await createCouple(dataWithId, null)
        } catch (error) {
          console.error('Supabase creation failed, continuing with local:', error)
        }
      }
      
      // Save to recent couples
      saveCouple(coupleId, partner1.trim(), partner2.trim())
      
      // Navigate to couple dashboard
      navigate(`/c/${coupleId}`, { 
        state: { 
          partner1Name: partner1.trim(), 
          partner2Name: partner2.trim() 
        } 
      })
    } catch (error) {
      console.error('Error creating couple:', error)
      setError(t('errorOccurred') || 'Bir hata oluştu, lütfen tekrar deneyin')
      setLoading(false)
    }
  }

  const handleSelectCouple = (coupleId) => {
    navigate(`/c/${coupleId}`)
  }

  const handleRemoveCouple = (e, coupleId) => {
    e.stopPropagation()
    if (confirm(t('confirmDelete'))) {
      removeSavedCouple(coupleId)
      setSavedCouples(getSavedCouples())
    }
  }

  const formatLastAccess = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return t('today')
    if (diffDays === 1) return t('yesterday')
    if (diffDays < 7) return `${diffDays} ${t('daysAgo').replace('{count}', '').trim()}`
    
    return date.toLocaleDateString(currentLang === 'tr' ? 'tr-TR' : 'en-US', {
      day: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors">
      {/* Language Selector - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 min-w-[160px] flex items-center justify-between gap-2 hover:scale-105 transition-transform shadow-lg ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-pink-500" />
              <span className="text-lg">{languages.find(l => l.code === currentLang)?.flag}</span>
              <span className="text-sm font-medium">{languages.find(l => l.code === currentLang)?.name}</span>
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {langDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setLangDropdownOpen(false)}
              />
              <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border py-2 z-50 max-h-96 overflow-y-auto scrollbar-hide ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code)
                      localStorage.setItem('preferredLanguage', lang.code)
                      setLangDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 transition-colors ${
                      currentLang === lang.code ? 'bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20' : ''
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className={`text-sm font-medium ${
                      currentLang === lang.code 
                        ? 'text-pink-600 dark:text-pink-400' 
                        : isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {lang.name}
                    </span>
                    {currentLang === lang.code && (
                      <span className="ml-auto text-pink-500">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('welcomeMessage')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('startPlanning')}
          </p>
        </div>

        {/* Saved Couples Section */}
        {savedCouples.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-500" />
              {t('savedCouples')}
            </h2>
            <div className="space-y-3">
              {savedCouples.map((couple) => (
                <div
                  key={couple.id}
                  onClick={() => handleSelectCouple(couple.id)}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-xl cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {couple.partner1} & {couple.partner2}
                      </p>
                      {couple.lastAccessed && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {t('lastAccess')}: {formatLastAccess(couple.lastAccessed)}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleRemoveCouple(e, couple.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title={t('removeFromList')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create New Couple Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {savedCouples.length > 0 && (
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {t('newCouple')}
            </h2>
          )}
          <form onSubmit={handleCreate}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('partner1')}
              </label>
              <input
                type="text"
                value={partner1}
                onChange={(e) => setPartner1(e.target.value)}
                placeholder={t('enterName')}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('partner2')}
              </label>
              <input
                type="text"
                value={partner2}
                onChange={(e) => setPartner2(e.target.value)}
                placeholder={t('enterName')}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {t('creating')}
                </>
              ) : (
                <>
                  {t('start')} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
