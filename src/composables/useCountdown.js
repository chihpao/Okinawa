import { ref, onMounted, onUnmounted } from 'vue'

export function useCountdown(tripRef) {
  const state = ref('before') 
  const days = ref(0)
  const hours = ref(0)
  const minutes = ref(0)
  const seconds = ref(0)
  const currentDay = ref(0)
  const totalDays = ref(0)
  const remaining = ref(0)
  const daysSince = ref(0)
  const memoirText = ref('那段時光還在這裡。')
  
  let countdownInterval = null

  function updateCountdown() {
    if (!tripRef.value || !tripRef.value.startDate || !tripRef.value.endDate) return

    const startDate = new Date(tripRef.value.startDate + 'T00:00:00')
    const endDate = new Date(tripRef.value.endDate + 'T23:59:59')
    const now = new Date()

    if (now >= startDate && now <= endDate) {
      state.value = 'during'
      currentDay.value = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1
      totalDays.value = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      remaining.value = totalDays.value - currentDay.value
      return
    }

    if (now > endDate) {
      state.value = 'after'
      daysSince.value = Math.floor((now - endDate) / (1000 * 60 * 60 * 24))
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
      return
    }

    state.value = 'before'
    const diff = startDate - now
    days.value = Math.floor(diff / (1000 * 60 * 60 * 24))
    hours.value = Math.floor((diff / (1000 * 60 * 60)) % 24)
    minutes.value = Math.floor((diff / 1000 / 60) % 60)
    seconds.value = Math.floor((diff / 1000) % 60)
  }

  onMounted(() => {
    updateCountdown()
    countdownInterval = setInterval(updateCountdown, 1000)
  })

  onUnmounted(() => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
    }
  })

  return {
    state,
    days,
    hours,
    minutes,
    seconds,
    currentDay,
    totalDays,
    remaining,
    daysSince,
    memoirText
  }
}
