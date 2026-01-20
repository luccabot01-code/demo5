import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useCouple } from './contexts/CoupleContext'
import useStore from './store/useStore'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Budget from './pages/Budget'
import Notes from './pages/Notes'
import Goals from './pages/Goals'
import Calendar from './pages/Calendar'
import Wishlist from './pages/Wishlist'
import Memories from './pages/Memories'
import Shopping from './pages/Shopping'
import LoveNotes from './pages/LoveNotes'
import Habits from './pages/Habits'
import DateIdeas from './pages/DateIdeas'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Help from './pages/Help'
import PinModal from './components/PinModal'
import LoadingScreen from './components/LoadingScreen'
import ErrorScreen from './components/ErrorScreen'
import DemoBadge from './components/DemoBadge'
import DemoModal from './components/DemoModal'

export default function CoupleApp() {
  const { coupleId, data, loading, error, pinVerified, showPinModal, updateData, verifyPin, isDemo, showDemoModal, setShowDemoModal } = useCouple()
  const { initializeStore, setOnDataChange, settings } = useStore()

  // Initialize store when data is loaded
  useEffect(() => {
    if (data && coupleId) {
      initializeStore(coupleId, data)
      // Wrap updateData to match the signature expected by triggerSync
      setOnDataChange((updates, skipDemoCheck) => {
        updateData(updates, skipDemoCheck)
      })
    }
  }, [data, coupleId, initializeStore, setOnDataChange, updateData])

  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorScreen message={error} />
  }

  if (showPinModal && !pinVerified) {
    return <PinModal onVerify={verifyPin} />
  }

  return (
    <>
      {isDemo && <DemoBadge />}
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} isDark={settings?.theme === 'dark'} language={settings?.language} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="budget" element={<Budget />} />
          <Route path="notes" element={<Notes />} />
          <Route path="goals" element={<Goals />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="memories" element={<Memories />} />
          <Route path="shopping" element={<Shopping />} />
          <Route path="love-notes" element={<LoveNotes />} />
          <Route path="habits" element={<Habits />} />
          <Route path="date-ideas" element={<DateIdeas />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </>
  )
}
