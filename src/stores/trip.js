import { toRef } from 'vue'
import { defineStore } from 'pinia'
import { useCloudSync } from '../composables/useCloudSync'

const STORAGE_KEYS = {
  data: 'okinawa-data-v5'
}

export const DEFAULT_DATA = {
  "trip": {
    "title": "8月沖繩輕旅",
    "startDate": "2026-08-13",
    "endDate": "2026-08-17",
    "travelers": [
      { "name": "姊姊", "departureDate": "2026-08-16" },
      { "name": "姊夫", "departureDate": "2026-08-16" },
      { "name": "老媽", "departureDate": "2026-08-17" },
      { "name": "阿保", "departureDate": "2026-08-17" },
      { "name": "孜仁", "departureDate": "2026-08-17" }
    ]
  },
  "days": [
    {
      "date": "2026-08-13", "dayOfWeek": "四", "dayNumber": 1, "label": "第一天", "subtitle": "抵達沖繩", "hasRentalCar": false,
      "activities": [
        { "id": "d1-1", "startTime": "18:05", "endTime": "20:50", "title": "抵達沖繩", "description": "樂桃航空 MM930", "mapUrl": "", "notes": "" },
        { "id": "d1-2", "startTime": "20:55", "endTime": "", "title": "抵達那霸機場", "description": "", "mapUrl": "", "notes": "" },
        { "id": "d1-3", "startTime": "21:30", "endTime": "", "title": "國際通逛逛", "description": "居酒屋／餐廳吃宵夜（國際通屋台村）", "mapUrl": "https://maps.app.goo.gl/6u6qhNjxAkMXf7x57", "notes": "" }
      ]
    },
    {
      "date": "2026-08-14", "dayOfWeek": "五", "dayNumber": 2, "label": "第二天", "subtitle": "水族館 & 南部探索", "hasRentalCar": true,
      "activities": [
        { "id": "d2-1", "startTime": "09:00", "endTime": "19:00", "title": "DMM 水族館", "description": "營業時間 09:00–19:00", "mapUrl": "https://maps.app.goo.gl/J3Sxn8GvXF48GBxb6", "notes": "" },
        { "id": "d2-2", "startTime": "10:00", "endTime": "21:00", "title": "iias 沖繩豐崎", "description": "商場，跟水族館同棟（營業時間 10:00–21:00）", "mapUrl": "https://maps.app.goo.gl/J3Sxn8GvXF48GBxb6", "notes": "" },
        { "id": "d2-3", "startTime": "12:00", "endTime": "", "title": "糸滿魚市場", "description": "在地海鮮市場", "mapUrl": "https://maps.app.goo.gl/odFCotQHGYccxCqG7", "notes": "" },
        { "id": "d2-4", "startTime": "13:30", "endTime": "", "title": "波上宮", "description": "沖繩著名神社", "mapUrl": "https://maps.app.goo.gl/ufJrKjWWRGVAFXww9", "notes": "" },
        { "id": "d2-5", "startTime": "14:30", "endTime": "", "title": "波之上海灘", "description": "那霸市區的美麗海灘", "mapUrl": "https://maps.app.goo.gl/NDVUCtHN36rbvnJr7", "notes": "" },
        { "id": "d2-6", "startTime": "16:00", "endTime": "", "title": "瀨長島", "description": "白色希臘風商店街＋海景", "mapUrl": "https://maps.app.goo.gl/PMqp8EFApnQTmFux5", "notes": "" },
        { "id": "d2-7", "startTime": "19:30", "endTime": "", "title": "晚餐時間", "description": "", "mapUrl": "", "notes": "" },
        { "id": "d2-8", "startTime": "22:00", "endTime": "", "title": "居酒屋", "description": "", "mapUrl": "", "notes": "" }
      ]
    },
    {
      "date": "2026-08-15", "dayOfWeek": "六", "dayNumber": 3, "label": "第三天", "subtitle": "世界遺產 & 美國村", "hasRentalCar": true,
      "activities": [
        { "id": "d3-1", "startTime": "09:00", "endTime": "", "title": "首里城", "description": "世界文化遺產，琉球王國的象徵", "mapUrl": "https://maps.app.goo.gl/x6PA2FSKSXnzPLaG7", "notes": "" },
        { "id": "d3-2", "startTime": "10:30", "endTime": "", "title": "西來院（達摩寺）", "description": "寧靜的古寺", "mapUrl": "https://maps.app.goo.gl/Zy9CaEhQg6Z45rG66", "notes": "" },
        { "id": "d3-3", "startTime": "13:00", "endTime": "", "title": "殘波岬（燈塔）", "description": "壯觀的海岬與白色燈塔", "mapUrl": "https://maps.app.goo.gl/uTzHZ6GgooheYwFZ7", "notes": "" },
        { "id": "d3-4", "startTime": "16:00", "endTime": "", "title": "美國村", "description": "逛街 & Chill", "mapUrl": "https://maps.app.goo.gl/63dfhXpJ9nyLvwxj7", "notes": "" },
        { "id": "d3-5", "startTime": "17:30", "endTime": "", "title": "日落海灘", "description": "海灘看夕陽", "mapUrl": "https://maps.app.goo.gl/JEtSz7oXeaVYTXTJ7", "notes": "" },
        { "id": "d3-6", "startTime": "19:00", "endTime": "", "title": "AEON Mall 永旺夢樂城", "description": "購物中心", "mapUrl": "https://maps.app.goo.gl/fJ2viTEp2RU9pFcd7", "notes": "" },
        { "id": "d3-7", "startTime": "22:00", "endTime": "", "title": "居酒屋", "description": "", "mapUrl": "", "notes": "" }
      ]
    },
    {
      "date": "2026-08-16", "dayOfWeek": "日", "dayNumber": 4, "label": "第四天", "subtitle": "購物 & 姊姊姊夫回程", "hasRentalCar": false,
      "activities": [
        { "id": "d4-1", "startTime": "10:00", "endTime": "22:00", "title": "PARCO CITY", "description": "營業時間 10:00–22:00", "mapUrl": "https://maps.app.goo.gl/aEx75spVL1JSMWWk9", "notes": "" },
        { "id": "d4-2", "startTime": "16:00", "endTime": "", "title": "姊姊 & 姊夫前往機場", "description": "直接從 PARCO CITY 出發去機場", "mapUrl": "", "notes": "" },
        { "id": "d4-3", "startTime": "18:20", "endTime": "18:55", "title": "姊姊 & 姊夫回程", "description": "越捷航空 VZ569", "mapUrl": "", "notes": "" },
        { "id": "d4-4", "startTime": "20:00", "endTime": "", "title": "唐吉訶德最後補給", "description": "阿保、孜仁", "mapUrl": "", "notes": "" },
        { "id": "d4-5", "startTime": "22:00", "endTime": "", "title": "居酒屋", "description": "", "mapUrl": "", "notes": "" }
      ]
    },
    {
      "date": "2026-08-17", "dayOfWeek": "一", "dayNumber": 5, "label": "第五天", "subtitle": "回程", "hasRentalCar": false,
      "activities": [
        { "id": "d5-1", "startTime": "10:10", "endTime": "10:40", "title": "老媽 & 阿保 & 孜仁回程", "description": "虎航 IT231", "mapUrl": "", "notes": "" }
      ]
    }
  ]
}

const ACT_KEYWORDS = {
  transit: ['抵達', '機場', '回程', '航空', '前往', '出發'],
  food: ['居酒屋', '晚餐', '宵夜', '市場', '餐廳', '吃'],
  shop: ['PARCO', 'AEON', '唐吉訶德', '商場', '購物', 'iias', 'Mall'],
  sight: ['水族館', '海灘', '神社', '寺', '城', '岬', '島', '美國村', '通', '宮'],
  hotel: ['飯店', '民宿', '旅館', '住宿', 'hotel', 'Hotel', 'Hostel', 'チェックイン']
}

export function getActivityType(title) {
  if (!title) return 'other'
  for (const [type, keywords] of Object.entries(ACT_KEYWORDS)) {
    if (keywords.some(kw => title.includes(kw))) return type
  }
  return 'other'
}

export function sortActivities(activities) {
  return [...activities].sort((a, b) => {
    const ta = a.startTime || '99:99'
    const tb = b.startTime || '99:99'
    return ta.localeCompare(tb)
  })
}

export function timeDisplay(act) {
  if (act.startTime && act.endTime) return act.startTime + ' — ' + act.endTime
  if (act.startTime) return act.startTime
  return ''
}

export function escapeHtml(unsafe) {
  if (!unsafe) return ''
  return unsafe.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

export const useTripStore = defineStore('trip', {
  state: () => ({
    appData: null,
    editingActivityId: null,
    editingDayIndex: null,
    pendingDeleteId: null,
    pendingDeleteDay: null,
    cloudSync: useCloudSync()
  }),
  getters: {
    trip: (state) => state.appData?.trip || {},
    days: (state) => state.appData?.days || [],
    travelers: (state) => state.appData?.trip?.travelers || [],
    syncState: (state) => state.cloudSync.syncState,
    syncLabel: (state) => state.cloudSync.syncLabel
  },
  actions: {
    async loadData(onUpdate) {
      try {
        await this.cloudSync.syncFromCloud(toRef(this, 'appData'), true, onUpdate)
        if (!this.appData) {
          const saved = localStorage.getItem(STORAGE_KEYS.data)
          if (saved) {
            try { 
              this.appData = JSON.parse(saved) 
            } catch (e) { 
              this.appData = JSON.parse(JSON.stringify(DEFAULT_DATA)) 
            }
          } else {
            this.appData = JSON.parse(JSON.stringify(DEFAULT_DATA))
          }
          await this.cloudSync.syncToCloud(this.appData)
        }
        this.cloudSync.startPolling(toRef(this, 'appData'), onUpdate)
      } catch (err) {
        console.error('Init error:', err)
        throw err
      }
    },
    saveData() {
      localStorage.setItem(STORAGE_KEYS.data, JSON.stringify(this.appData))
      this.cloudSync.scheduleSave(this.appData)
    },
    saveActivity(formData, originalDayIndex) {
      const targetDay = this.appData.days[this.editingDayIndex]
      const originalDay = (originalDayIndex !== undefined && originalDayIndex !== null) ? this.appData.days[originalDayIndex] : targetDay
      
      const activityData = {
        startTime: formData.startTime,
        endTime: formData.endTime,
        title: formData.title,
        description: formData.description,
        mapUrl: formData.mapUrl,
      }

      if (this.editingActivityId && originalDay) {
        const idx = originalDay.activities.findIndex(a => a.id === this.editingActivityId)
        if (idx !== -1) {
          activityData.notes = originalDay.activities[idx].notes || ''
          activityData.id = this.editingActivityId
          
          if (this.editingDayIndex === originalDayIndex || originalDayIndex === undefined) {
            originalDay.activities[idx] = activityData
          } else {
            originalDay.activities.splice(idx, 1)
            targetDay.activities.push(activityData)
          }
        }
      } else {
        activityData.notes = ''
        activityData.id = 'd' + (this.editingDayIndex + 1) + '-' + Date.now()
        targetDay.activities.push(activityData)
      }
      sortActivities(targetDay.activities)
      if (originalDay !== targetDay) sortActivities(originalDay.activities)
      this.saveData()
    },
    requestDelete(id, dayIndex) {
      this.pendingDeleteId = id
      this.pendingDeleteDay = dayIndex
    },
    confirmDelete() {
      if (this.pendingDeleteId === null || this.pendingDeleteDay === null) return
      const day = this.appData.days[this.pendingDeleteDay]
      day.activities = day.activities.filter(a => a.id !== this.pendingDeleteId)
      this.saveData()
      this.pendingDeleteId = null
      this.pendingDeleteDay = null
    },
    cancelDelete() {
      this.pendingDeleteId = null
      this.pendingDeleteDay = null
    }
  }
})
