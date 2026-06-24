<template>
  <div class="day-nav-container" :class="{ 'nav-hidden': uiStore.viewMode === 'day' }">
    <div class="day-perf-top"></div>
    <div class="day-nav-track" id="dayTabsTrack">
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
import { useUiStore } from '@/stores/ui'
import { useTripStore } from '@/stores/trip'
import DayFrame from './DayFrame.vue'

const uiStore = useUiStore()
const tripStore = useTripStore()
</script>

<style scoped>
.day-nav-container {
  position: relative; width: 100vw; margin-left: calc(-50vw + 50%); margin-top: 2rem;
  background: var(--film-bar); padding: 1.5rem 0;
  overflow: hidden;
  transition: all .5s var(--ease-out-expo);
}
.day-nav-container.nav-hidden {
  opacity: 0; pointer-events: none; height: 0;
  padding-top: 0; padding-bottom: 0; margin: 0;
}
.day-perf-top, .day-perf-bot {
  position: absolute; left: 0; right: 0; height: 12px;
  background-image: radial-gradient(circle, var(--film-hole) 40%, transparent 42%);
  background-size: 24px 24px; background-position: center;
}
.day-perf-top { top: 4px; }
.day-perf-bot { bottom: 4px; }

.day-nav-track {
  display: flex; 
  gap: var(--frame-gap);
  padding: 0 12px;
  justify-content: center;
}
</style>
