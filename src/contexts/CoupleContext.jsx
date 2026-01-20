import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { getInitialLanguage } from '../lib/i18n'
import { 
  getCoupleData as getSupabaseCoupleData,
  updateCoupleData as updateSupabaseCoupleData,
  subscribeToCoupleChanges,
  isSupabaseConfigured,
  saveCouple as saveCoupleToLocalStorage,
  updateSavedCoupleNames
} from '../lib/supabase'
import { getCoupleData as getLocalCoupleData, saveCoupleData as saveLocalCoupleData } from '../lib/db'
import { generateDemoData } from '../lib/seedData'

const CoupleContext = createContext(null)

// Demo couple IDs that are read-only
const DEMO_COUPLE_IDS = ['maryjohn', 'demo']

// Default data for new couples
const getDefaultData = (partner1Name, partner2Name) => {
  // Load dark mode from localStorage, default to light
  const savedDarkMode = localStorage.getItem('darkMode')
  const isDark = savedDarkMode === 'true' // Only true if explicitly set
  const currentLang = getInitialLanguage()
  
  return {
    couple: {
      partner1: { name: partner1Name || 'Partner 1', avatar: 'User', birthday: '', color: '#ec4899' },
      partner2: { name: partner2Name || 'Partner 2', avatar: 'UserCircle', birthday: '', color: '#8b5cf6' },
      anniversary: '',
      weddingDate: '',
      relationshipStart: '',
    },
    tasks: [],
    taskCategories: currentLang === 'tr' ? [
      { id: 'wedding', name: 'Düğün', color: '#ec4899', icon: 'Heart' },
      { id: 'home', name: 'Ev', color: '#10b981', icon: 'Home' },
      { id: 'travel', name: 'Seyahat', color: '#06b6d4', icon: 'Plane' },
      { id: 'shopping', name: 'Alışveriş', color: '#f59e0b', icon: 'ShoppingBag' },
      { id: 'health', name: 'Sağlık', color: '#ef4444', icon: 'Activity' },
      { id: 'other', name: 'Diğer', color: '#6b7280', icon: 'Circle' },
    ] : [
      { id: 'wedding', name: 'Wedding', color: '#ec4899', icon: 'Heart' },
      { id: 'home', name: 'Home', color: '#10b981', icon: 'Home' },
      { id: 'travel', name: 'Travel', color: '#06b6d4', icon: 'Plane' },
      { id: 'shopping', name: 'Shopping', color: '#f59e0b', icon: 'ShoppingBag' },
      { id: 'health', name: 'Health', color: '#ef4444', icon: 'Activity' },
      { id: 'other', name: 'Other', color: '#6b7280', icon: 'Circle' },
    ],
    budget: { total: 0, currency: 'TRY', categories: [], expenses: [], income: [] },
    notes: [],
    goals: [],
    events: [],
    wishlist: [],
    memories: [],
    shoppingLists: [],
    loveNotes: [],
    habits: [],
    dateIdeas: [],
    mealPlan: {},
    settings: {
      theme: isDark ? 'dark' : 'light',
      language: getInitialLanguage(), // Auto-detect browser language
      notifications: true,
      weekStartsOn: 'monday',
      dateFormat: 'DD/MM/YYYY',
      currency: 'TRY',
      pin: null,
      email: null,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export function CoupleProvider({ children, coupleId: propCoupleId }) {
  const { coupleId: paramCoupleId } = useParams()
  const coupleId = propCoupleId || paramCoupleId
  const location = useLocation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [syncStatus, setSyncStatus] = useState({ online: true, synced: true })
  const [pinVerified, setPinVerified] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [showDemoModal, setShowDemoModal] = useState(false)
  
  // Check if current couple is demo
  const isDemo = DEMO_COUPLE_IDS.includes(coupleId)

  // Load couple data
  useEffect(() => {
    async function loadData() {
      if (!coupleId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        let coupleData = null
        
        // Try Supabase first if configured
        if (isSupabaseConfigured()) {
          try {
            const supabaseData = await getSupabaseCoupleData(coupleId)
            if (supabaseData) {
              coupleData = supabaseData.data
              // Save to local IndexedDB as cache
              await saveLocalCoupleData(coupleId, coupleData)
            }
          } catch (e) {
            console.log('Supabase fetch failed, trying local:', e)
          }
        }
        
        // Fallback to local IndexedDB
        if (!coupleData) {
          coupleData = await getLocalCoupleData(coupleId)
        }

        // If still no data, create new data
        if (!coupleData) {
          // Special case: maryjohn is the demo couple
          if (coupleId === 'maryjohn') {
            // Generate demo data for maryjohn
            coupleData = generateDemoData()
          } else {
            // Create default data for new couples
            const partner1Name = location.state?.partner1Name
            const partner2Name = location.state?.partner2Name
            coupleData = getDefaultData(partner1Name, partner2Name)
          }
          
          // Save locally
          await saveLocalCoupleData(coupleId, coupleData)
          
          // Note: Couple will be created in Supabase when PIN is set during CreateCouple flow
        }

        // Check if PIN is required (skip for demo)
        const pinVerifiedKey = `pin_verified_${coupleId}`
        const verified = localStorage.getItem(pinVerifiedKey) === 'true'
        
        if (coupleData.settings?.pin && !verified && coupleId !== 'maryjohn') {
          setShowPinModal(true)
        } else {
          setPinVerified(true)
        }

        setData(coupleData)
        setError(null)
        setSyncStatus({ online: isSupabaseConfigured(), synced: true })
        
        // Apply dark mode from settings
        if (coupleData.settings?.theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        
        // Save to recent couples (skip for demo)
        if (coupleId !== 'maryjohn' && coupleData.couple?.partner1?.name && coupleData.couple?.partner2?.name) {
          saveCoupleToLocalStorage(
            coupleId, 
            coupleData.couple.partner1.name, 
            coupleData.couple.partner2.name
          )
        }
      } catch (err) {
        console.error('Error loading couple data:', err)
        setError('Veriler yüklenirken bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [coupleId, location.state])

  // Listen for realtime changes from Supabase
  useEffect(() => {
    if (!coupleId || !isSupabaseConfigured() || !pinVerified) return

    const unsubscribe = subscribeToCoupleChanges(coupleId, async (newData, updatedAt) => {
      // Only update if remote data is newer
      if (!data || new Date(updatedAt) > new Date(data.updatedAt || 0)) {
        setData(newData)
        await saveLocalCoupleData(coupleId, newData)
      }
    })

    return unsubscribe
  }, [coupleId, pinVerified, data])

  // Update data function
  const updateData = useCallback(async (updates, skipDemoCheck = false) => {
    if (!coupleId || !data) return
    
    // Block updates for demo accounts (unless skipDemoCheck is true for settings)
    if (isDemo && !skipDemoCheck) {
      setShowDemoModal(true)
      return
    }

    const newData = {
      ...data,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    setData(newData)
    
    // Save locally first (instant)
    await saveLocalCoupleData(coupleId, newData)
    
    // Then sync to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        await updateSupabaseCoupleData(coupleId, newData)
        setSyncStatus({ online: true, synced: true })
        
        // Update saved couple names if couple info changed
        if (updates.couple) {
          updateSavedCoupleNames(
            coupleId,
            newData.couple.partner1.name,
            newData.couple.partner2.name
          )
        }
      } catch (error) {
        console.error('Supabase sync failed:', error)
        setSyncStatus({ online: false, synced: false })
      }
    }
  }, [coupleId, data, isDemo])

  // Verify PIN
  const verifyPin = useCallback(async (pin) => {
    if (data?.settings?.pin === pin) {
      setPinVerified(true)
      setShowPinModal(false)
      localStorage.setItem(`pin_verified_${coupleId}`, 'true')
      return true
    }
    return false
  }, [data, coupleId])

  // Set PIN
  const setPin = useCallback(async (pin) => {
    await updateData({
      settings: { ...data.settings, pin }
    })
  }, [data, updateData])

  // Remove PIN
  const removePin = useCallback(async () => {
    await updateData({
      settings: { ...data.settings, pin: null }
    })
    localStorage.removeItem(`pin_verified_${coupleId}`)
  }, [data, updateData, coupleId])

  // Force sync
  const forceSync = useCallback(async () => {
    if (coupleId && data && isSupabaseConfigured()) {
      try {
        await updateSupabaseCoupleData(coupleId, data)
        setSyncStatus({ online: true, synced: true })
      } catch (error) {
        console.error('Force sync failed:', error)
        setSyncStatus({ online: false, synced: false })
      }
    }
  }, [coupleId, data])

  const value = {
    coupleId,
    data,
    loading,
    error,
    syncStatus,
    pinVerified,
    showPinModal,
    setShowPinModal,
    updateData,
    verifyPin,
    setPin,
    removePin,
    forceSync,
    isDemo,
    showDemoModal,
    setShowDemoModal,
  }

  return (
    <CoupleContext.Provider value={value}>
      {children}
    </CoupleContext.Provider>
  )
}

export function useCouple() {
  const context = useContext(CoupleContext)
  if (!context) {
    throw new Error('useCouple must be used within a CoupleProvider')
  }
  return context
}
