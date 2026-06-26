<template>
  <header class="top-bar" :class="{ hidden: uiStore.isNavHidden, 'day-view-mode': uiStore.viewMode === 'day', 'compact': isCompact }" id="topBar">
    <div class="top-left" v-if="uiStore.viewMode === 'day'">
      <button
        type="button"
        class="back-btn"
        @click="emit('go-home')"
        aria-label="回首頁"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.4" fill="none"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      </button>
      <div class="top-day-nav" ref="dayNav">
        <div class="top-day-track" id="topDayTrack">
          <span class="tab-indicator" :style="indicatorStyle"></span>
<button
          v-for="(day, i) in tripStore.days"
          :key="i"
          type="button"
          class="top-day-tab"
          :class="{ active: i === uiStore.activeDay }"
          :ref="(el) => { if (el) tabEls[i] = el }"
          @click="uiStore.switchDay(i)"
        >
          <span class="tab-icon" v-html="dayIcons[i]"></span>
          <span class="tab-label">{{ getTabLabel(day.date) }}</span>
        </button>
        </div>
      </div>
    </div>
    <div class="brand" @click="emit('go-home')" id="brandHome">
      <span class="brand-text">OKINAWA</span>
      <span class="brand-year">2026</span>
    </div>
    <div class="sync-indicator" :data-state="tripStore.syncState" id="syncIndicator">
      <span class="sync-dot"></span>
      <span class="sync-percent">{{ tripStore.syncLabel }}</span>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useTripStore } from '@/stores/trip'

const uiStore = useUiStore()
const tripStore = useTripStore()
const emit = defineEmits(['go-home'])

const dayNav = ref(null)
const tabEls = ref([])
const indicatorStyle = ref({ transform: 'translateX(0)', width: '0px' })
const isCompact = ref(false)

// 每天行程主題對應的小圖示（抵達／水族館／世界遺產／購物／回程）
const dayIcons = [
  // 8/13 抵達 — 飛機降落
  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20.5h18"/><path d="M20.5 4 5 11.2l5.4 1.7L9 19l1.3.3 3-4.7 5-1.6 1.6-1.5z"/></svg>`,
  // 8/14 水族館 — 魚
  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12c2-3 5.5-4 9-4s6 1 7 4c-1 3-3.5 4-7 4s-7-1-9-4z"/><path d="M20 12 23 9v6z"/><circle cx="7.5" cy="11" r="0.5" fill="currentColor" stroke="none"/></svg>`,
  // 8/15 世界遺產 — 鳥居
  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4.5Q12 1.5 21.5 4.5"/><path d="M4.5 7.5h15"/><path d="M7 7.5v12.5"/><path d="M17 7.5v12.5"/><path d="M7 12.5h10"/></svg>`,
  // 8/16 購物 — 購物袋
  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 8.5h13l-1 11.5h-11z"/><path d="M9 8.5V6.5a3 3 0 0 1 6 0v2"/></svg>`,
  // 8/17 回程 — 飛機起飛
  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20.5h18"/><path d="M3.5 17 19 9.8l-5.4-1.7L15 5 13.7 4.7l-3 4.7-5 1.6L4.1 12.5z"/></svg>`,
]

function getTabLabel(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function updateIndicator() {
  const active = tabEls.value[uiStore.activeDay]
  if (!active) return
  indicatorStyle.value = {
    transform: `translateX(${active.offsetLeft - 4}px)`,
    width: `${active.offsetWidth}px`,
  }
}

watch(() => uiStore.activeDay, () => nextTick(updateIndicator), { immediate: true })

let ticking = false
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      isCompact.value = window.scrollY > 240
      ticking = false
    })
    ticking = true
  }
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  nextTick(updateIndicator)
  window.addEventListener('resize', updateIndicator)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', updateIndicator)
})
</script>

<style scoped>
.top-bar {
  position: fixed; top: 0; left: 0; right: 0;
  height: var(--top-bar-h);
  background: var(--bg-overlay);
  backdrop-filter: blur(16px) saturate(1.1); -webkit-backdrop-filter: blur(16px) saturate(1.1);
  z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 max(1.25rem, calc((100vw - var(--content-w)) / 2));
  padding-top: var(--safe-top); box-sizing: content-box;
  border-bottom: 1px solid transparent;
  transition: transform .42s var(--ease-out-expo), height .28s var(--ease-out), border-color .28s;
}
.top-bar.compact { height: var(--top-bar-h-compact); border-bottom-color: var(--border-light); }
.top-bar.hidden { transform: translateY(calc(-100% - var(--safe-top))); }

.brand {
  display: inline-flex; align-items: baseline; gap: .4rem;
  font-family: var(--font-display); font-weight: 700; font-size: 1.0625rem;
  letter-spacing: .14em; cursor: pointer; color: var(--text-primary);
}
.brand-year { color: var(--accent); font-style: italic; font-weight: 600; }

.top-left { flex: 1; display: flex; align-items: center; gap: .5rem; min-width: 0; }

.back-btn {
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  width: 36px; height: 36px; border-radius: 50%;
  color: var(--text-primary);
  transition: background .2s, transform .2s var(--ease-out-back);
}
.back-btn:hover { background: var(--bg-deep); }
.back-btn:active { transform: translateX(-3px) scale(0.9); }

.top-bar.day-view-mode .brand { display: none; }

.top-day-nav { flex: 1; display: flex; align-items: center; min-width: 0; }
.top-day-track {
  position: relative;
  display: flex; width: 100%;
  background: var(--bg-deep); padding: 4px;
  border-radius: var(--radius-full);
}
.tab-indicator {
  position: absolute; left: 0; top: 4px; bottom: 4px;
  background: #fff;
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-xs);
  transition: transform .42s var(--ease-spring), width .42s var(--ease-spring);
  z-index: 0;
}
.top-day-tab {
  position: relative; z-index: 1;
  display: inline-flex; align-items: center; justify-content: center;
  gap: .35rem;
  flex: 1 1 0; min-width: 0;
  padding: .3rem .4rem;
  font-size: var(--fs-caption); font-weight: 500;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  transition: color .25s var(--ease-out);
  font-variant-numeric: tabular-nums;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
}
.tab-icon { display: inline-flex; flex-shrink: 0; }
.tab-icon :deep(svg) { display: block; }
.tab-label { text-align: center; }
.top-day-tab.active { color: var(--text-primary); }

.sync-indicator { display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--text-tertiary); letter-spacing: .05em; text-transform: uppercase; }
.sync-dot { width: 6px; height: 6px; border-radius: 50%; background: #9E9E9E; transition: background .3s; }
.sync-indicator[data-state='saved'] .sync-dot { background: #4CAF50; }
.sync-indicator[data-state='syncing'] .sync-dot {
  background: transparent; border: 1.5px solid #FF9800; border-top-color: transparent;
  animation: spin .8s linear infinite;
}
.sync-indicator[data-state='unsaved'] .sync-dot { background: #FF5722; }
.sync-indicator[data-state='offline'] .sync-dot { background: #9E9E9E; }

@media (max-width: 600px) {
  .top-bar.day-view-mode .sync-percent { display: none; }
  .top-day-tab { padding: .25rem .2rem; font-size: .66rem; gap: .2rem; }
  .tab-icon :deep(svg) { width: 12px; height: 12px; }
  .top-day-track { padding: 3px; }
  .top-left { gap: .35rem; }
  .back-btn { width: 32px; height: 32px; }
}
</style>