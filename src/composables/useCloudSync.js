import { ref } from 'vue'

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyyOxIV_zj1nLN97jCWl8uPY1ecYPDKkbHd3cUjrEH86cPhbphzFL_GzecPzGSSopu5/exec'
const POLL_MS = 15000
const DEBOUNCE_MS = 2000

export function useCloudSync() {
  const syncState = ref('saved')
  const syncLabel = ref('已同步')
  
  let pollInterval = null
  let syncTimeout = null
  let lastKnownHash = null
  let isSyncing = false
  let needsSync = false

  function getDeviceId() {
    let id = localStorage.getItem('okinawa-device-id')
    if (!id) {
      id = 'dev-' + Math.random().toString(36).slice(2, 10)
      localStorage.setItem('okinawa-device-id', id)
    }
    return id
  }

  function setState(state) {
    syncState.value = state
    const labels = { saved: '已同步', syncing: '同步中...', unsaved: '未儲存', offline: '離線' }
    syncLabel.value = labels[state] || ''
  }

  async function syncToCloud(appData) {
    if (isSyncing) {
      needsSync = true
      return
    }
    isSyncing = true
    setState('syncing')
    needsSync = false
    
    try {
      appData._lastModified = Date.now()
      appData._modifiedBy = getDeviceId()
      const body = JSON.stringify(appData)
      
      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body
      })
      
      if (!res.ok) throw new Error(`POST failed: ${res.status}`)
      
      lastKnownHash = body
      setState('saved')
      localStorage.setItem('okinawa-data-v5', body)
      console.log('[Sync] Pushed to cloud')
    } catch (err) {
      console.error('[Sync] Push failed:', err)
      setState('offline')
    } finally {
      isSyncing = false
      if (needsSync) {
        scheduleSave(appData)
      }
    }
  }

  async function syncFromCloud(appDataRef, silent = false, onUpdate = null) {
    try {
      const res = await fetch(`${GAS_URL}?t=${Date.now()}`)
      if (!res.ok) throw new Error(`GET failed: ${res.status}`)
      
      const data = await res.json()
      const hash = JSON.stringify(data)
      
      if (hash !== lastKnownHash) {
        const wasOurWrite = data._modifiedBy === getDeviceId() && data._lastModified && (Date.now() - data._lastModified < POLL_MS + 2000)
        
        if (!wasOurWrite || !lastKnownHash) {
          appDataRef.value = data
          lastKnownHash = hash
          localStorage.setItem('okinawa-data-v5', hash)
          if (!silent && onUpdate) {
            onUpdate()
          }
          console.log('[Sync] Pulled remote update')
        } else {
          lastKnownHash = hash
        }
      }
      setState('saved')
      return true
    } catch (err) {
      console.error('[Sync] Pull failed:', err)
      if (!silent) setState('offline')
      return false
    }
  }

  function startPolling(appDataRef, onUpdate) {
    if (pollInterval) clearInterval(pollInterval)
    
    pollInterval = setInterval(() => {
      if (!document.hidden) syncFromCloud(appDataRef, false, onUpdate)
    }, POLL_MS)
    
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) syncFromCloud(appDataRef, false, onUpdate)
    })
    
    console.log('[Sync] Polling started')
  }

  function scheduleSave(appData) {
    setState('unsaved')
    if (syncTimeout) clearTimeout(syncTimeout)
    syncTimeout = setTimeout(() => {
      syncToCloud(appData)
    }, DEBOUNCE_MS)
  }

  return {
    syncState,
    syncLabel,
    syncToCloud,
    syncFromCloud,
    startPolling,
    scheduleSave,
    setState
  }
}
