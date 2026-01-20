import { AlertCircle } from 'lucide-react'
import { getTranslation, getInitialLanguage } from '../lib/i18n'

export default function ErrorScreen({ message }) {
  const lang = getInitialLanguage()
  const t = (key) => getTranslation(lang, key)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-200 max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('errorOccurred')}</h2>
        <p className="text-gray-600 mb-6">{message || t('unexpectedError')}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
        >
          {t('refreshPage')}
        </button>
      </div>
    </div>
  )
}
