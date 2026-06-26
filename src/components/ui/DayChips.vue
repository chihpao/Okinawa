<template>
  <div class="day-chips">
    <button
      v-for="(day, i) in days"
      :key="i"
      type="button"
      class="day-chip"
      :class="{ active: i === selectedDay }"
      @click="emit('update:selectedDay', i)"
    >
      <span class="chip-day">Day {{ day.dayNumber }}</span>
      <span class="chip-date">{{ getChipLabel(day.date) }} · {{ day.dayOfWeek }}</span>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  days: { type: Array, required: true },
  selectedDay: { type: Number, required: true }
})
const emit = defineEmits(['update:selectedDay'])

function getChipLabel(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return `${date.getMonth() + 1}/${date.getDate()}`
}
</script>

<style scoped>
.day-chips {
  display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 1.25rem;
}
.day-chip {
  display: inline-flex; flex-direction: column; gap: 2px;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  background: var(--bg-deep); color: var(--text-secondary);
  border: 1px solid transparent;
  transition: transform .18s var(--ease-out-back), background .2s, color .2s, box-shadow .2s;
  text-align: left;
  line-height: 1;
}
.day-chip:active { transform: scale(0.93); }
.day-chip.active {
  background: var(--accent-soft); color: var(--accent-deep);
  border-color: var(--accent-glow);
  box-shadow: var(--shadow-xs);
}
.chip-day {
  font-size: 12px; font-weight: 600; letter-spacing: .04em;
}
.chip-date {
  font-size: 10px; opacity: 0.7; font-variant-numeric: tabular-nums;
  letter-spacing: .04em;
}
.day-chip.active .chip-date { opacity: 0.85; }
</style>