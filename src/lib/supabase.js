import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is configured
export function isSupabaseConfigured() {
  return !!(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'your_supabase_project_url' && 
    supabaseAnonKey !== 'your_supabase_anon_key' &&
    supabaseUrl.startsWith('http')
  )
}

// Create Supabase client only if configured
let supabase = null
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  }
} catch (error) {
  console.warn('Supabase not configured, running in local-only mode')
  supabase = null
}

export { supabase }

// Generate unique couple ID
export function generateCoupleId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Hash PIN for secure storage
async function hashPin(pin) {
  const encoder = new TextEncoder()
  const data = encoder.encode(pin)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// ============ COUPLE OPERATIONS ============

// Create new couple
export async function createCouple(coupleData, pin = null) {
  if (!isSupabaseConfigured() || !supabase) {
    // Local-only mode - just return the coupleId
    return { coupleId: coupleData.coupleId || generateCoupleId(), data: coupleData }
  }

  const coupleId = coupleData.coupleId || generateCoupleId()
  const hashedPin = pin ? await hashPin(pin) : null

  const { data, error } = await supabase
    .from('demo5_couples')
    .insert({
      demo5_id: coupleId,
      demo5_pin_hash: hashedPin,
      demo5_data: coupleData,
      demo5_created_at: new Date().toISOString(),
      demo5_updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return { coupleId, data }
}

// Verify couple PIN
export async function verifyPin(coupleId, pin) {
  if (!isSupabaseConfigured() || !supabase) {
    return true // Offline mode
  }

  try {
    const hashedPin = await hashPin(pin)

    const { data, error} = await supabase
      .from('demo5_couples')
      .select('demo5_pin_hash')
      .eq('demo5_id', coupleId)
      .single()

    if (error) return false
    if (!data.demo5_pin_hash) return true // No PIN set
    return data.demo5_pin_hash === hashedPin
  } catch {
    return false
  }
}

// Get couple data
export async function getCoupleData(coupleId) {
  if (!isSupabaseConfigured() || !supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('demo5_couples')
    .select('demo5_data, demo5_updated_at')
    .eq('demo5_id', coupleId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }

  return { data: data.demo5_data, updated_at: data.demo5_updated_at }
}

// Update couple data
export async function updateCoupleData(coupleId, coupleData) {
  if (!isSupabaseConfigured() || !supabase) {
    return coupleData
  }

  const { data, error } = await supabase
    .from('demo5_couples')
    .update({
      demo5_data: coupleData,
      demo5_updated_at: new Date().toISOString()
    })
    .eq('demo5_id', coupleId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Check if couple exists
export async function coupleExists(coupleId) {
  if (!isSupabaseConfigured() || !supabase) {
    return false
  }

  const { data, error } = await supabase
    .from('demo5_couples')
    .select('demo5_id')
    .eq('demo5_id', coupleId)
    .single()

  return !error && !!data
}

// ============ REALTIME SYNC ============

// Subscribe to couple data changes
export function subscribeToCoupleChanges(coupleId, callback) {
  if (!isSupabaseConfigured() || !supabase) {
    return () => {} // No-op unsubscribe
  }

  const channel = supabase
    .channel(`couple:${coupleId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'demo5_couples',
        filter: `demo5_id=eq.${coupleId}`
      },
      (payload) => {
        callback(payload.new.demo5_data, payload.new.demo5_updated_at)
      }
    )
    .subscribe()

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel)
  }
}

// ============ SAVED COUPLES (Local Storage) ============

const SAVED_COUPLES_KEY = 'couple-hq-saved-couples'

export function getSavedCouples() {
  try {
    const saved = localStorage.getItem(SAVED_COUPLES_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function saveCouple(coupleId, partner1Name, partner2Name) {
  const saved = getSavedCouples()
  const existing = saved.find(c => c.id === coupleId)
  
  if (!existing) {
    saved.push({
      id: coupleId,
      partner1: partner1Name,
      partner2: partner2Name,
      lastAccessed: new Date().toISOString()
    })
    localStorage.setItem(SAVED_COUPLES_KEY, JSON.stringify(saved))
  } else {
    // Update last accessed
    existing.lastAccessed = new Date().toISOString()
    localStorage.setItem(SAVED_COUPLES_KEY, JSON.stringify(saved))
  }
}

export function removeSavedCouple(coupleId) {
  const saved = getSavedCouples()
  const filtered = saved.filter(c => c.id !== coupleId)
  localStorage.setItem(SAVED_COUPLES_KEY, JSON.stringify(filtered))
}

export function updateSavedCoupleNames(coupleId, partner1Name, partner2Name) {
  const saved = getSavedCouples()
  const couple = saved.find(c => c.id === coupleId)
  if (couple) {
    couple.partner1 = partner1Name
    couple.partner2 = partner2Name
    localStorage.setItem(SAVED_COUPLES_KEY, JSON.stringify(saved))
  }
}
