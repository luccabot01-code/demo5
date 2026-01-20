import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Heart, LayoutDashboard, CheckSquare, Wallet, StickyNote, Target, Calendar, Gift, Camera, ShoppingCart, Mail, Sparkles, Lightbulb, Settings, Users, Menu, X, ChevronDown, LogOut, HelpCircle } from 'lucide-react'
import useStore from '../store/useStore'
import { getTranslation } from '../lib/i18n'

const navGroups = [
  {
    title: 'main',
    items: [
      { to: '', icon: LayoutDashboard, label: 'dashboard' },
      { to: 'calendar', icon: Calendar, label: 'calendar' },
    ]
  },
  {
    title: 'planning',
    items: [
      { to: 'tasks', icon: CheckSquare, label: 'tasks' },
      { to: 'goals', icon: Target, label: 'goals' },
      { to: 'budget', icon: Wallet, label: 'budget' },
    ]
  },
  {
    title: 'life',
    items: [
      { to: 'shopping', icon: ShoppingCart, label: 'shopping' },
      { to: 'wishlist', icon: Gift, label: 'wishlist' },
      { to: 'habits', icon: Sparkles, label: 'habits' },
    ]
  },
  {
    title: 'together',
    items: [
      { to: 'date-ideas', icon: Lightbulb, label: 'dateIdeas' },
      { to: 'love-notes', icon: Mail, label: 'loveNotes' },
      { to: 'memories', icon: Camera, label: 'memories' },
      { to: 'notes', icon: StickyNote, label: 'notes' },
    ]
  },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState(['main', 'planning', 'life', 'together'])
  const { couple, loveNotes, settings, currentUser } = useStore()
  const unreadNotes = loveNotes.filter(n => !n.read && n.to === currentUser).length
  const t = (key) => getTranslation(settings.language, key)
  const navigate = useNavigate()
  const location = useLocation()
  
  const isDark = settings.theme === 'dark'
  
  const handleLogout = () => {
    // Son erişilen çifti temizle
    localStorage.removeItem('lastAccessedCouple')
    // Ana sayfaya yönlendir
    navigate('/')
  }

  const toggleGroup = (title) => {
    setExpandedGroups(prev => 
      prev.includes(title) ? prev.filter(g => g !== title) : [...prev, title]
    )
  }

  const NavContent = () => (
    <>
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-pink-100'}`}>
        <NavLink to="profile" className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-pink-50'}`}>
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className={sidebarOpen ? 'block' : 'hidden'}>
            <h1 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>Couple HQ</h1>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{couple.partner1.name} & {couple.partner2.name}</p>
          </div>
        </NavLink>
      </div>
      <nav className="p-2 flex-1 overflow-y-auto scrollbar-hide">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-2">
            <button
              onClick={() => toggleGroup(group.title)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} ${!sidebarOpen && 'justify-center'}`}
            >
              {sidebarOpen && <span>{t(group.title)}</span>}
              {sidebarOpen && (
                <ChevronDown className={`w-4 h-4 transition-transform ${expandedGroups.includes(group.title) ? '' : '-rotate-90'}`} />
              )}
            </button>
            {(expandedGroups.includes(group.title) || !sidebarOpen) && (
              <div className="space-y-1">
                {group.items.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === ''}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                          : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-pink-50'
                      } ${!sidebarOpen && 'justify-center'}`
                    }
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      {to === 'love-notes' && unreadNotes > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadNotes}
                        </span>
                      )}
                    </div>
                    {sidebarOpen && <span className="font-medium text-sm">{t(label)}</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className={`p-2 border-t ${isDark ? 'border-gray-700' : 'border-pink-100'}`}>
        <NavLink
          to="settings"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              isActive
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-pink-50'
            } ${!sidebarOpen && 'justify-center'}`
          }
        >
          <Settings className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium text-sm">{t('settings')}</span>}
        </NavLink>
        
        <NavLink
          to="help"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mt-2 ${
              isActive
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-pink-50'
            } ${!sidebarOpen && 'justify-center'}`
          }
        >
          <HelpCircle className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium text-sm">{t('help')}</span>}
        </NavLink>
        
        <button
          onClick={() => {
            setMobileOpen(false)
            handleLogout()
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mt-2 ${
            isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-pink-50'
          } ${!sidebarOpen && 'justify-center'}`}
        >
          <LogOut className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium text-sm">{t('logout')}</span>}
        </button>
      </div>
    </>
  )

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'}`}>
      {/* Mobile Header */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-50 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-pink-100'} border-b`}>
        <button onClick={() => setMobileOpen(true)} className={isDark ? 'p-2 text-gray-300' : 'p-2 text-gray-600'}>
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-500" />
          <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Couple HQ</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className={`absolute left-0 top-0 h-full w-64 shadow-xl flex flex-col overflow-hidden scrollbar-hide ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <button onClick={() => setMobileOpen(false)} className={`absolute top-4 right-4 p-2 z-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <X className="w-5 h-5" />
            </button>
            <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-hide">
              <NavContent />
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex fixed left-0 top-0 h-full shadow-lg flex-col transition-all duration-300 z-40 overflow-y-auto scrollbar-hide ${sidebarOpen ? 'w-56' : 'w-16'} ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-pink-100'} border-r`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute -right-3 top-20 w-6 h-6 border rounded-full flex items-center justify-center shadow-sm ${isDark ? 'bg-gray-800 border-gray-600 text-gray-400 hover:text-gray-200' : 'bg-white border-pink-200 text-gray-400 hover:text-gray-600'}`}
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-90' : '-rotate-90'}`} />
        </button>
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-56' : 'lg:ml-16'} pt-16 lg:pt-0 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-white to-purple-50'}`}>
        <div key={location.pathname} className="p-4 lg:p-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
