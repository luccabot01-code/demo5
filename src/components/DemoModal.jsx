import { ShoppingBag, X, Sparkles } from 'lucide-react'
import { getTranslation } from '../lib/i18n'

export default function DemoModal({ isOpen, onClose, isDark, language }) {
  if (!isOpen) return null

  const t = (key) => getTranslation(language, key)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className={`max-w-md w-full rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8" />
            <h2 className="text-2xl font-bold">{t('demoMode')}</h2>
          </div>
          <p className="text-sm opacity-90">{t('demoModeSubtitle')}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('demoModeDescription')}
          </p>

          <div className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-pink-900/20 border border-pink-800' : 'bg-pink-50 border border-pink-200'}`}>
            <h3 className={`font-semibold mb-2 ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
              ✨ {t('whenYouPurchase')}
            </h3>
            <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• {t('demoFeature1')}</li>
              <li>• {t('demoFeature2')}</li>
              <li>• {t('demoFeature3')}</li>
              <li>• {t('demoFeature4')}</li>
              <li>• {t('demoFeature5')}</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <a
              href="https://etsy.com/shop/FlorMontana"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              <ShoppingBag className="w-5 h-5" />
              {t('buyFromEtsy')}
            </a>
            <button
              onClick={onClose}
              className={`w-full px-6 py-3 rounded-xl transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              {t('continueExploring')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
