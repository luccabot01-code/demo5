import { Eye } from 'lucide-react'

export default function DemoBadge() {
  return (
    <div className="fixed top-4 right-4 z-50 lg:top-8 lg:right-8">
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg animate-pulse">
        <Eye className="w-4 h-4" />
        <span className="font-semibold text-sm">DEMO</span>
      </div>
    </div>
  )
}
