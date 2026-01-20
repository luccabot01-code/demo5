import { Heart } from 'lucide-react'

export default function LoadingScreen({ minimal = false }) {
  if (minimal) {
    // Minimal loading for page transitions
    return (
      <div className="flex items-center justify-center p-8">
        <div className="relative">
          <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
        </div>
      </div>
    )
  }
  
  // Full loading screen for initial load
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Heart className="w-16 h-16 text-pink-500 mx-auto animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
