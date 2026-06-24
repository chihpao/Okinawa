<template>
  <header class="top-bar" :class="{ hidden: uiStore.isNavHidden, 'day-view-mode': uiStore.viewMode === 'day' }" id="topBar">
    <button 
      v-if="uiStore.viewMode === 'day'" 
      type="button" 
      class="back-btn" 
      @click="emit('go-home')" 
      aria-label="回首頁"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
    </button>
    <div class="brand" @click="emit('go-home')" id="brandHome">
      OKINAWA <span style="color:var(--accent)">2026</span>
    </div>
    <div class="top-day-nav" v-if="uiStore.viewMode === 'day'">
      <div class="top-day-track" id="topDayTrack">
        <button 
          v-for="(day, i) in tripStore.days" 
          :key="i"
          type="button" 
          class="top-day-tab" 
          :class="{ active: i === uiStore.activeDay }"
          @click="uiStore.switchDay(i)"
        >
          {{ getTabLabel(day.date) }}
        </button>
      </div>
    </div>
    <div class="sync-indicator" :data-state="tripStore.syncState" id="syncIndicator">
      <span class="sync-dot"></span>
      <span class="sync-label" id="syncLabel">{{ tripStore.syncLabel }}</span>
    </div>
  </header>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'
import { useTripStore } from '@/stores/trip'

const uiStore = useUiStore()
const tripStore = useTripStore()
const emit = defineEmits(['go-home'])

function getTabLabel(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return `${date.getMonth() + 1}/${date.getDate()}`
}
</script>

<style scoped>
.top-bar {
  position: fixed; top: 0; left: 0; right: 0; height: var(--top-bar-h);
  background: var(--bg-overlay); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 max(1.5rem, calc((100vw - var(--content-w)) / 2));
  border-bottom: 1px solid var(--border); transition: transform .3s var(--ease-out-expo);
  padding-top: var(--safe-top); box-sizing: content-box;
}
.top-bar.hidden { transform: translateY(calc(-100% - var(--safe-top))); }
.brand { font-family: var(--font-display); font-weight: 700; font-size: 1.125rem; letter-spacing: .08em; cursor: pointer; }
.back-btn { display: none; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; color: var(--text-primary); transition: background .2s; }
.back-btn:hover { background: var(--bg-deep); }
.top-day-nav { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; }
.top-day-track { display: flex; gap: .25rem; background: var(--bg-deep); padding: 4px; border-radius: var(--radius-full); }
.top-day-tab { padding: .35rem .8rem; font-size: var(--fs-caption); border-radius: var(--radius-full); color: var(--text-secondary); font-weight: 500; transition: all .2s; }
.top-day-tab.active { background: #fff; color: var(--text-primary); box-shadow: var(--shadow-sm); }

.sync-indicator { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-tertiary); }
.sync-dot { width: 6px; height: 6px; border-radius: 50%; background: #9E9E9E; transition: background .3s; }
.sync-indicator[data-state='saved'] .sync-dot { background: #4CAF50; }
.sync-indicator[data-state='syncing'] .sync-dot { background: #FF9800; animation: pulse 1s infinite; }
.sync-indicator[data-state='unsaved'] .sync-dot { background: #FF5722; }
.sync-indicator[data-state='offline'] .sync-dot { background: #9E9E9E; }

@media (max-width: 600px) {
  .top-bar.day-view-mode .brand { display: none; }
  .top-bar.day-view-mode .back-btn { display: flex; }
  .top-bar.day-view-mode .top-day-nav { display: flex; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
  .top-bar.day-view-mode .sync-label { display: none; }
  .top-day-nav { display: none; }
}
</style>
