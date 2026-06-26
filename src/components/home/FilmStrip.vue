<template>
  <div class="day-nav-container" :class="{ 'nav-hidden': uiStore.viewMode === 'day' }" ref="root">
    <div class="day-perf-top"></div>
    <div class="day-nav-track" id="dayTabsTrack" ref="track">
      <DayFrame
        v-for="(day, i) in tripStore.days"
        :key="i"
        :day="day"
        :index="i"
        :is-active="i === uiStore.activeDay"
        @select="uiStore.switchDay(i)"
      />
    </div>
    <div class="day-perf-bot"></div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useTripStore } from '@/stores/trip'
import DayFrame from './DayFrame.vue'

const uiStore = useUiStore()
const tripStore = useTripStore()
const track = ref(null)

function scrollToActive() {
  nextTick(() => {
    const el = track.value && track.value.querySelector('.day-frame.active')
    if (el && track.value) {
      const t = track.value.getBoundingClientRect()
      const e = el.getBoundingClientRect()
      const target = el.offsetLeft - (t.width / 2) + (e.width / 2)
      track.value.scrollTo({ left: target, behavior: 'smooth' })
    }
  })
}

watch(() => uiStore.activeDay, () => scrollToActive(), { immediate: true })
</script>

<style scoped>
.day-nav-container {
  position: relative; width: 100%; margin-top: 2.5rem;
  background: var(--film-bar); padding: clamp(1.25rem, 3vw, 1.75rem) 0;
  overflow: hidden;
  transition: all .55s var(--ease-out-expo);
}
.day-nav-container.nav-hidden {
  opacity: 0; pointer-events: none; height: 0;
  padding-top: 0; padding-bottom: 0; margin: 0;
}
.day-perf-top, .day-perf-bot {
  position: absolute; left: 0; right: 0; height: 12px;
  background-image: radial-gradient(circle, var(--film-hole) 38%, transparent 40%);
  background-size: 22px 22px; background-position: center;
  pointer-events: none;
}
.day-perf-top { top: 5px; }
.day-perf-bot { bottom: 5px; }

.day-nav-track {
  display: flex;
  gap: var(--frame-gap);
  padding: 0 12px;
  justify-content: center;
  scroll-behavior: smooth;
}

@media (max-width: 600px) {
  .day-nav-track {
    justify-content: flex-start;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding: 0 calc((100vw - 90vw) / 2);
  }
  .day-nav-track::-webkit-scrollbar { display: none; }
  .day-nav-track :deep(.day-frame) {
    scroll-snap-align: center;
    scroll-snap-stop: normal;
  }
}
</style>