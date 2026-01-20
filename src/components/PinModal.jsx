import { useState } from 'react'
import { Lock, X } from 'lucide-react'
import { getTranslation, getInitialLanguage } from '../lib/i18n'

export default function PinModal({ onVerify }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const lang = getInitialLanguage()
  const t = (key) => getTranslation(lang, key)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const verified = await onVerify(pin)
    if (verified) {
      setError(false)
    } else {
      setError(true)
      setPin('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-pink-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('pinEntry')}</h2>
          <p className="text-gray-600">{t('enterPinToAccess')}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength="6"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder={t('pinCode')}
            className={`w-full px-4 py-3 border-2 rounded-xl text-center text-2xl tracking-widest focus:outline-none focus:ring-2 ${
              error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500'
            }`}
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{t('wrongPin')}</p>
          )}
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            {t('login')}
          </button>
        </form>
      </div>
    </div>
  )
}
