import { Cloud, CloudOff, RefreshCw, Check } from 'lucide-react'
import { getTranslation, getInitialLanguage } from '../lib/i18n'

export default function SyncStatus({ status }) {
  const lang = getInitialLanguage()
  const t = (key) => getTranslation(lang, key)
  
  if (!status) return null

  const { online = true, syncing = false, synced = true, pendingChanges = 0 } = status

  if (online && synced && !syncing) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg ${
        !online ? 'bg-gray-800 text-white' :
        syncing ? 'bg-blue-500 text-white' :
        pendingChanges > 0 ? 'bg-orange-500 text-white' :
        'bg-green-500 text-white'
      }`}>
        {!online ? (
          <>
            <CloudOff className="w-4 h-4" />
            <span className="text-sm font-medium">{t('offline')}</span>
          </>
        ) : syncing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">{t('syncing')}</span>
          </>
        ) : pendingChanges > 0 ? (
          <>
            <Cloud className="w-4 h-4" />
            <span className="text-sm font-medium">{pendingChanges} {t('changesPending')}</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">{t('synced')}</span>
          </>
        )}
      </div>
    </div>
  )
}
