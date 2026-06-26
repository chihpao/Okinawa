<template>
  <div class="day-view" :class="{ active: isActive }" :data-day-index="dayIndex">
    <div class="day-banner">
      <div class="day-banner-eyebrow">
        <span class="day-banner-dot"></span>
        Day {{ day.dayNumber }} · {{ day.date }}
      </div>
      <h2 class="day-banner-title">
        <span class="day-banner-num">0{{ day.dayNumber }}</span>
        <span class="day-banner-name">{{ day.label }}</span>
      </h2>
      <p v-if="day.subtitle" class="day-banner-sub">{{ day.subtitle }}</p>
      <div v-if="badges.length > 0" class="day-badges">
        <span v-for="(badge, i) in badges" :key="i" class="day-badge">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {{ badge }} 已回程
        </span>
      </div>
    </div>

    <div class="timeline" ref="timeline">
      <div v-if="!day.activities || day.activities.length === 0" class="timeline-empty">
        <div class="empty-title">這天還沒有安排<br>也許是最好的一天</div>
        <div class="empty-sub">由你來寫下這一頁</div>
      </div>

      <ActivityCard
        v-for="(act, i) in sortedActivities"
        :key="act.id"
        :activity="act"
        :day-index="dayIndex"
        :stagger-index="i"
        @edit="(id, dIdx) => emit('edit', id, dIdx)"
        @delete="(id, dIdx) => emit('delete', id, dIdx)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useTripStore, sortActivities } from '@/stores/trip'
import { useMotion } from '@/composables/useMotion'
import ActivityCard from './ActivityCard.vue'

const props = defineProps({
  day: { type: Object, required: true },
  dayIndex: { type: Number, required: true },
  isActive: { type: Boolean, default: false }
})

const emit = defineEmits(['edit', 'delete'])
const tripStore = useTripStore()
const motion = useMotion()
const timeline = ref(null)

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

watch(() => props.isActive, (v) => {
  if (v) nextTick(staggerCards)
})

function staggerCards() {
  if (!timeline.value) return
  const els = timeline.value.querySelectorAll('.activity-item')
  els.forEach((el, i) => {
    el.style.animationDelay = `${ i * 80 }ms`
    el.classList.remove('stagger-in')
    void el.offsetWidth
    el.classList.add('stagger-in')
  })
}
</script>

<style scoped>
.day-view {
  opacity: 0; pointer-events: none;
  margin-top: calc(var(--top-bar-h) + var(--safe-top) - 1rem);
  padding: 0 max(1.25rem, calc((100vw - var(--content-w)) / 2)) 2rem;
}
.day-view.active {
  opacity: 1; pointer-events: auto;
  animation: dayEnter .45s var(--ease-out-quart) both;
}

.day-banner {
  margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
  padding: clamp(1.75rem, 4vw, 2.75rem) 0 1.5rem;
  border-bottom: 1px solid var(--border);
  position: relative;
}
.day-banner-eyebrow {
  display: inline-flex; align-items: center; gap: .55rem;
  font-family: var(--font-body);
  font-size: .6875rem; letter-spacing: .24em; text-transform: uppercase;
  color: var(--text-tertiary); margin-bottom: .9rem; font-weight: 500;
}
.day-banner-dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
}
.day-banner-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 9vw, 4.4rem);
  font-weight: 500; line-height: 0.95;
  display: flex; align-items: baseline; gap: .8rem; flex-wrap: wrap;
}
.day-banner-num {
  font-style: italic; color: var(--accent); font-size: .85em;
  letter-spacing: -.04em;
}
.day-banner-name { letter-spacing: -.02em; }
.day-banner-sub {
  font-family: var(--font-body);
  font-size: var(--fs-subhead);
  color: var(--text-secondary);
  margin-top: .55rem; font-weight: 300; font-style: italic;
}

.day-badges { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1rem; }
.day-badge {
  display: inline-flex; align-items: center; gap: .35rem;
  font-size: 11px; font-weight: 500; color: var(--text-tertiary);
  background: var(--bg-deep); padding: .3rem .75rem;
  border-radius: var(--radius-full);
}

.timeline {
  display: flex; flex-direction: column; gap: .85rem;
  position: relative; padding-left: 28px;
}
.timeline::before {
  content: ''; position: absolute; left: 11px; top: 12px; bottom: 12px; width: 2px;
  background: linear-gradient(180deg, var(--accent) 0%, var(--accent) 8%, var(--border-light) 8%, var(--border-light) 100%);
  z-index: -1; border-radius: 2px;
}

.timeline-empty {
  padding: 4rem 0; text-align: center; padding-left: 0;
}
.empty-title {
  font-family: var(--font-display); font-size: clamp(1.4rem, 4vw, 2rem);
  color: var(--text-tertiary); font-style: italic; line-height: 1.35;
}
.empty-sub {
  margin-top: .85rem;
  font-size: var(--fs-caption); color: var(--text-muted);
  letter-spacing: .12em; text-transform: uppercase;
}

@media (max-width: 600px) {
  .timeline { padding-left: 22px; }
  .timeline::before { left: 7px; }
}

.day-enter { animation: dayEnter .4s var(--ease-out) both; }
.day-exit { animation: dayExit .3s var(--ease-out) both; }
</style>