import { CheckSquare, Wallet, Target, Heart, Calendar, Gift, Sparkles, Mail, Camera, ShoppingCart, Book, Zap, Users, LayoutDashboard, Lightbulb, StickyNote } from 'lucide-react'
import useStore from '../store/useStore'
import { getTranslation } from '../lib/i18n'

export default function Help() {
  const { settings } = useStore()
  const t = (key) => getTranslation(settings.language, key)
  const isDark = settings.theme === 'dark'

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-8 rounded-2xl mb-6">
        <div className="flex items-center gap-3">
          <Book className="w-10 h-10" />
          <div>
            <h1 className="text-3xl font-bold">{t('userGuide')}</h1>
            <p className="text-sm opacity-90 mt-1">{t('userGuideSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Overview */}
        <section className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-xl font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Heart className="w-6 h-6 text-pink-500" />
            {t('whatIsCoupleHQ')}
          </h2>
          <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('whatIsCoupleHQDesc')}
          </p>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-pink-50'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>💡 {t('tip')}:</strong> {t('dataTip')}
            </p>
          </div>
        </section>

        {/* Features */}
        <section className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Zap className="w-6 h-6 text-yellow-500" />
            {t('featuresAndUsage')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dashboard */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <LayoutDashboard className="w-5 h-5 text-blue-500" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Dashboard</h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('dashboardDesc')}
              </p>
            </div>

            {/* Tasks */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <CheckSquare className="w-5 h-5 text-blue-500" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('tasks')}</h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('tasksDesc')}
              </p>
            </div>

            {/* Budget */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-green-500" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('budget')}</h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('budgetDesc')}
              </p>
            </div>

            {/* Goals */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-500" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('goals')}</h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('goalsDesc')}
              </p>
            </div>

            {/* Calendar */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-red-500" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('calendar')}</h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('calendarDesc2')}
              </p>
            </div>

            {/* Wishlist */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-pink-500" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('wishlist')}</h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('wishlistDesc2')}
              </p>
            </div>

            {/* Memories */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-5 h-5 text-purple-500" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('memories')}</h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('memoriesDesc2')}
              </p>
            </div>

            {/* Shopping */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('shopping')}</h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('shoppingDesc')}
              </p>
            </div>

            {/* Love Notes */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-red-500" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('loveNotes')}</h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('loveNotesDesc2')}
              </p>
            </div>

            {/* Habits */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('habits')}</h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('habitsDesc2')}
              </p>
            </div>

            {/* Date Ideas */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('dateIdeas')}</h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('dateIdeasDesc')}
              </p>
            </div>

            {/* Notes */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="w-5 h-5 text-blue-500" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('notes')}</h3>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('notesDesc')}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Tips */}
        <section className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Zap className="w-6 h-6 text-yellow-500" />
            {t('quickTips')}
          </h2>
          <div className="space-y-3">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
              <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                <strong>🔗 {t('saveLink')}:</strong> {t('saveLinkTip')}
              </p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
              <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                <strong>💾 {t('dataManagement')}:</strong> {t('backupTip')}
              </p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-purple-900/20 border border-purple-800' : 'bg-purple-50 border border-purple-200'}`}>
              <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
                <strong>🌙 {t('darkMode')}:</strong> {t('darkModeTip')}
              </p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-pink-900/20 border border-pink-800' : 'bg-pink-50 border border-pink-200'}`}>
              <p className={`text-sm ${isDark ? 'text-pink-300' : 'text-pink-800'}`}>
                <strong>🌍 {t('language')}:</strong> {t('multiLanguageTip')}
              </p>
            </div>
          </div>
        </section>

        {/* How to Start */}
        <section className={`rounded-2xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Users className="w-6 h-6 text-pink-500" />
            {t('howToStart')}
          </h2>
          <ol className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>{t('step1')}</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>{t('step2')}</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>{t('step3')}</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>{t('step4')}</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
              <span>{t('step5')}</span>
            </li>
          </ol>
        </section>

        {/* Footer */}
        <div className={`text-center py-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <p className="text-sm">
            {t('helpFooter')}
          </p>
          <p className="text-sm mt-3">
            {t('supportContact') || 'Destek:'}{' '}
            <a 
              href="mailto:sahinturkzehra@gmail.com" 
              className="text-pink-500 hover:text-pink-600 transition-colors"
            >
              sahinturkzehra@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
