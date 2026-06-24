import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    activeDay: 0,
    viewMode: 'home',
    lastScrollY: 0,
    isNavHidden: false
  }),
  actions: {
    init() {
      const savedDay = localStorage.getItem('okinawa-active-day-v5')
      if (savedDay !== null) {
        this.activeDay = parseInt(savedDay, 10)
      }
    },
    switchDay(index) {
      this.viewMode = 'day'
      this.activeDay = index
      this.isNavHidden = false
      localStorage.setItem('okinawa-active-day-v5', index)
    },
    goHome() {
      this.viewMode = 'home'
      this.activeDay = 0
      localStorage.setItem('okinawa-active-day-v5', 0)
    },
    getSmartDefaultDay(daysLength) {
      if (this.activeDay >= 0 && this.activeDay < daysLength) return this.activeDay
      return 0
    }
  }
})
