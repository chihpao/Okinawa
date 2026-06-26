<template>
  <header class="top-bar" :class="{ hidden: uiStore.isNavHidden, 'day-view-mode': uiStore.viewMode === 'day', 'compact': isCompact }" id="topBar">
    <button
      v-if="uiStore.viewMode === 'day'"
      type="button"
      class="back-btn"
      @click="emit('go-home')"
      aria-label="回首頁"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.4" fill="none"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
    </button>
    <div class="brand" @click="emit('go-home')" id="brandHome">
      <span class="brand-text">OKINAWA</span>
      <span class="brand-year">2026</span>
    </div>
    <div class="top-day-nav" v-if="uiStore.viewMode === 'day'" ref="dayNav">
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
          {{ getTabLabel(day.date) }}
        </button>
      </div>
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

.back-btn {
  display: none; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 50%;
  color: var(--text-primary);
  transition: background .2s, transform .2s var(--ease-out-back);
}
.back-btn:hover { background: var(--bg-deep); }
.back-btn:active { transform: translateX(-3px) scale(0.9); }

.top-day-nav { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
.top-day-track {
  position: relative;
  display: flex; gap: 2px;
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
  padding: .32rem .75rem;
  font-size: var(--fs-caption); font-weight: 500;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  transition: color .25s var(--ease-out);
  font-variant-numeric: tabular-nums;
}
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
  .top-bar.day-view-mode .brand { display: none; }
  .top-bar.day-view-mode .back-btn { display: flex; }
  .top-bar.day-view-mode .top-day-nav {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  }
  .top-bar.day-view-mode .sync-percent { display: none; }
  .top-day-nav { display: none; }
}
</style>