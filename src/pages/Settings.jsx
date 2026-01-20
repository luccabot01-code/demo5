import { useState, useRef } from 'react'
import { Settings as SettingsIcon, Download, Upload, Trash2, Check, AlertTriangle, Moon, Sun, Globe, Bell, Languages, ChevronDown } from 'lucide-react'
import useStore from '../store/useStore'
import { useCouple } from '../contexts/CoupleContext'
import { languages, getTranslation } from '../lib/i18n'

export default function Settings() {
  const { settings, updateSettings, exportData, importData, resetAllData, couple, updateCouple, updatePartner, tasks, notes, goals, memories, wishlist, shoppingLists, loveNotes, habits, dateIdeas, events, budget } = useStore()
  const { updateData: updateCoupleData } = useCouple()
  const t = (key) => getTranslation(settings.language, key)
  const isDark = settings.theme === 'dark'
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importStatus, setImportStatus] = useState(null)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false)
  const fileInputRef = useRef(null)

  const currencies = [
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: '₣', name: 'Swiss Franc' },
  ]

  const handleExport = () => {
    setShowExportModal(false)
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `couple-hq-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = importData(event.target?.result)
        setImportStatus(result ? 'success' : 'error')
        setShowImportModal(false)
        setTimeout(() => setImportStatus(null), 3000)
      }
      reader.readAsText(file)
    }
  }

  const handleReset = () => {
    resetAllData()
    setShowResetConfirm(false)
  }
  
  const handleNotificationToggle = () => {
    setShowNotificationModal(false)
    updateSettings({ notifications: !settings.notifications })
  }
  
  const handleExportClick = () => {
    setShowExportModal(true)
  }
  
  const handleImportClick = () => {
    setShowImportModal(true)
  }
  
  const handleNotificationClick = () => {
    setShowNotificationModal(true)
  }
  
  const handleResetClick = () => {
    setShowResetConfirm(true)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          <SettingsIcon className="w-8 h-8 text-pink-500" /> {t('settingsTitle')}
        </h1>
        <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('managePreferences')}</p>
      </div>

      {/* Appearance */}
      <div className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h2 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          <Sun className="w-5 h-5 text-yellow-500" /> {t('appearance')}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('theme')}</p>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('selectTheme')}</p>
            </div>
            <div className="flex items-center gap-3">
              <Sun className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-yellow-500'}`} />
              <button
                onClick={() => updateSettings({ theme: isDark ? 'light' : 'dark' })}
                className={`w-14 h-8 rounded-full transition-all relative ${
                  isDark ? 'bg-pink-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                    isDark ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
              <Moon className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-gray-400'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h2 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          <Globe className="w-5 h-5 text-blue-500" /> {t('preferences')}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('language')}</p>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('applicationLanguage')}</p>
            </div>
            
            {/* Custom Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 min-w-[200px] flex items-center justify-between gap-2 hover:scale-105 transition-transform ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{languages.find(l => l.code === settings.language)?.flag}</span>
                  <span className="text-sm font-medium">{languages.find(l => l.code === settings.language)?.name}</span>
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
                          updateSettings({ language: lang.code })
                          localStorage.setItem('preferredLanguage', lang.code)
                          setLangDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 transition-colors ${
                          settings.language === lang.code ? 'bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20' : ''
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span className={`text-sm font-medium ${
                          settings.language === lang.code 
                            ? 'text-pink-600 dark:text-pink-400' 
                            : isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {lang.name}
                        </span>
                        {settings.language === lang.code && (
                          <span className="ml-auto text-pink-500">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('currency')}</p>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('currencyForBudget')}</p>
            </div>
            
            {/* Custom Currency Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 min-w-[180px] flex items-center justify-between gap-2 hover:scale-105 transition-transform ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{currencies.find(c => c.code === settings.currency)?.symbol}</span>
                  <span className="text-sm font-medium">{settings.currency}</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {currencyDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setCurrencyDropdownOpen(false)}
                  />
                  <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-2xl border py-2 z-50 max-h-96 overflow-y-auto scrollbar-hide ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    {currencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          updateSettings({ currency: currency.code })
                          setCurrencyDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 transition-colors ${
                          settings.currency === currency.code ? 'bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20' : ''
                        }`}
                      >
                        <span className="text-2xl">{currency.symbol}</span>
                        <div className="flex-1">
                          <span className={`text-sm font-medium block ${
                            settings.currency === currency.code 
                              ? 'text-pink-600 dark:text-pink-400' 
                              : isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {currency.code}
                          </span>
                          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {currency.name}
                          </span>
                        </div>
                        {settings.currency === currency.code && (
                          <span className="ml-auto text-pink-500">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('weekStart')}</p>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('weekStartDay')}</p>
            </div>
            <select
              value={settings.weekStartsOn}
              onChange={(e) => updateSettings({ weekStartsOn: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            >
              <option value="monday">{t('monday')}</option>
              <option value="sunday">{t('sunday')}</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('dateFormat')}</p>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('dateDisplayFormat')}</p>
            </div>
            <select
              value={settings.dateFormat}
              onChange={(e) => updateSettings({ dateFormat: e.target.value })}
              className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'}`}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className={`rounded-2xl p-6 shadow-sm border mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h2 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          <Bell className="w-5 h-5 text-purple-500" /> {t('notifications')}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{t('enableNotifications')}</p>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('notificationsDesc')}</p>
          </div>
          <button
            onClick={handleNotificationClick}
            className={`w-14 h-8 rounded-full transition-all relative ${
              settings.notifications ? 'bg-pink-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                settings.notifications ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`rounded-2xl p-6 border ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
        <h2 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
          <AlertTriangle className="w-5 h-5" /> {t('dangerZone')}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${isDark ? 'text-red-400' : 'text-red-700'}`}>{t('deleteAllData')}</p>
            <p className={`text-sm ${isDark ? 'text-red-500' : 'text-red-500'}`}>{t('cannotBeUndone')}</p>
          </div>
          {showResetConfirm ? (
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                <Check className="w-4 h-4" /> {t('yesDelete')}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className={`px-4 py-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
              >
                {t('cancel')}
              </button>
            </div>
          ) : (
            <button
              onClick={handleResetClick}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> {t('reset')}
            </button>
          )}
        </div>
      </div>

      {/* Version Info */}
      <div className={`mt-8 text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        <p>{t('versionInfo')}</p>
        <p className="mt-1">{t('madeWithLove')}</p>
        <div className="mt-4 space-y-2">
          <p>
            {t('supportContact') || 'Destek:'}{' '}
            <a 
              href="mailto:sahinturkzehra@gmail.com" 
              className="text-pink-500 hover:text-pink-600 transition-colors"
            >
              sahinturkzehra@gmail.com
            </a>
          </p>
          <p>
            <a 
              href="https://etsy.com/shop/FlorMontana" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 transition-colors"
            >
              {t('visitOurShop') || 'Visit Our Etsy Shop'}
            </a>
          </p>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-purple-500" />
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {settings.notifications ? t('disableNotifications') || 'Disable Notifications?' : t('enableNotifications')}
              </h3>
            </div>
            <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {settings.notifications 
                ? t('disableNotificationsDesc') || 'You will no longer receive reminders and updates.'
                : t('notificationsDesc')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleNotificationToggle}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                {t('confirm') || 'Confirm'}
              </button>
              <button
                onClick={() => setShowNotificationModal(false)}
                className={`flex-1 px-4 py-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-6 h-6 text-green-500" />
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {t('exportData')}
              </h3>
            </div>
            <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('exportDataDesc') || 'Download all your data as a JSON backup file. You can use this file to restore your data later.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-semibold"
              >
                {t('download')}
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className={`flex-1 px-4 py-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-6 h-6 text-blue-500" />
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {t('importData')}
              </h3>
            </div>
            <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('importDataDesc') || 'Restore your data from a backup file. This will replace all current data.'}
            </p>
            <div className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
              <p className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                ⚠️ {t('importWarning') || 'Warning: This will overwrite all your current data!'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  fileInputRef.current?.click()
                }}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
              >
                {t('selectFile') || 'Select File'}
              </button>
              <button
                onClick={() => setShowImportModal(false)}
                className={`flex-1 px-4 py-2 rounded-xl transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
