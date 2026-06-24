<template>
  <div class="day-view" :class="{ active: isActive }" :data-day-index="dayIndex">
    <div class="day-header">
      <div class="day-header-text">
        <h2><span class="day-num">Day {{ day.dayNumber }}</span> · {{ day.label }}</h2>
        <p v-if="day.subtitle" class="day-subtitle">{{ day.subtitle }}</p>
      </div>
      <div v-if="badges.length > 0" class="day-badges">
        <span v-for="(badge, i) in badges" :key="i" class="day-badge">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {{ badge }} 已回程
        </span>
      </div>
    </div>
    
    <div class="timeline">
      <div v-if="!day.activities || day.activities.length === 0" class="timeline-empty">
        <div class="empty-title">這天還沒有安排，也許是最好的一天。</div>
      </div>
      
      <ActivityCard 
        v-for="act in sortedActivities" 
        :key="act.id" 
        :activity="act" 
        :day-index="dayIndex"
        @edit="(id, dIdx) => emit('edit', id, dIdx)"
        @delete="(id, dIdx) => emit('delete', id, dIdx)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTripStore, sortActivities } from '@/stores/trip'
import ActivityCard from './ActivityCard.vue'

const props = defineProps({
  day: {
    type: Object,
    required: true
  },
  dayIndex: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete'])
const tripStore = useTripStore()

const sortedActivities = computed(() => {
  if (!props.day.activities) return []
  return sortActivities(props.day.activities)
})

const badges = computed(() => {
  const departedTravelers = []
  const travelers = tripStore.travelers || []
  travelers.forEach(t => {
    if (props.day.date > t.departureDate.split('T')[0]) {
      departedTravelers.push(t.name)
    }
  })
  return departedTravelers
})
</script>

<style scoped>
.day-view {
  display: none; opacity: 0;
  padding: calc(var(--top-bar-h) + var(--safe-top) + 1.25rem) max(1.5rem, calc((100vw - var(--content-w)) / 2)) 2rem;
}
.day-view.active {
  display: block; opacity: 1;
}

.day-header {
  margin: clamp(2rem, 5vw, 3.5rem) 0 clamp(1.5rem, 3vw, 2rem);
  padding-bottom: 1.25rem; border-bottom: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: flex-end;
  flex-wrap: wrap; gap: 1rem;
}
.day-header h2 {
  font-family: var(--font-display);
  font-size: var(--fs-heading); font-weight: 500;
  line-height: 1.2; letter-spacing: -.02em;
}
.day-num { font-style: italic; color: var(--accent); }
.day-subtitle {
  font-size: var(--fs-subhead); color: var(--text-secondary);
  margin-top: .5rem; letter-spacing: .02em; font-weight: 300;
}

.day-badges { display: flex; flex-wrap: wrap; gap: .5rem; }
.day-badge {
  display: flex; align-items: center; gap: .35rem;
  font-size: 11px; font-weight: 500; color: var(--text-tertiary);
  background: var(--bg-deep); padding: .3rem .8rem;
  border-radius: var(--radius-full);
}

.timeline {
  display: flex; flex-direction: column; gap: 1rem;
  position: relative;
}
.timeline::before {
  content: ''; position: absolute; left: 40px; top: 0; bottom: 0; width: 1px;
  background: var(--border-light); z-index: -1;
}

.timeline-empty {
  padding: 4rem 0; text-align: center;
}
.empty-title {
  font-family: var(--font-display); font-size: var(--fs-subhead);
  color: var(--text-tertiary); font-style: italic;
}

@media (max-width: 600px) {
  .timeline::before { display: none; }
}

.day-enter { animation: dayEnter .4s var(--ease-out) both; }
.day-exit { animation: dayExit .3s var(--ease-out) both; }
</style>
