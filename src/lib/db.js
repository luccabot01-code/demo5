import { openDB } from 'idb'

const DB_NAME = 'couple-hq-db'
const DB_VERSION = 1

// Initialize IndexedDB
export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Store for couple data
      if (!db.objectStoreNames.contains('couples')) {
        db.createObjectStore('couples', { keyPath: 'id' })
      }
      // Store for sync queue (offline changes)
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true })
        syncStore.createIndex('coupleId', 'coupleId')
        syncStore.createIndex('timestamp', 'timestamp')
      }
      // Store for metadata
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'key' })
      }
    }
  })
}

// Get couple data from IndexedDB
export async function getCoupleData(coupleId) {
  const db = await initDB()
  return db.get('couples', coupleId)
}

// Save couple data to IndexedDB
export async function saveCoupleData(coupleId, data) {
  const db = await initDB()
  await db.put('couples', { id: coupleId, ...data, updatedAt: Date.now() })
}

// Add to sync queue (for offline changes)
export async function addToSyncQueue(coupleId, action, data) {
  const db = await initDB()
  await db.add('syncQueue', {
    coupleId,
    action,
    data,
    timestamp: Date.now(),
    synced: false
  })
}

// Get pending sync items
export async function getPendingSyncItems(coupleId) {
  const db = await initDB()
  const tx = db.transaction('syncQueue', 'readonly')
  const index = tx.store.index('coupleId')
  return index.getAll(coupleId)
}

// Clear synced items
export async function clearSyncedItems(ids) {
  const db = await initDB()
  const tx = db.transaction('syncQueue', 'readwrite')
  for (const id of ids) {
    await tx.store.delete(id)
  }
}

// Get metadata
export async function getMetadata(key) {
  const db = await initDB()
  const result = await db.get('metadata', key)
  return result?.value
}

// Set metadata
export async function setMetadata(key, value) {
  const db = await initDB()
  await db.put('metadata', { key, value })
}

// Check if online
export function isOnline() {
  return navigator.onLine
}

// Generate unique couple ID
export function generateCoupleId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
