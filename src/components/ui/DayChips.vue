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
      Day {{ day.dayNumber }} · {{ getChipLabel(day.date) }} ({{ day.dayOfWeek }})
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  days: {
    type: Array,
    required: true
  },
  selectedDay: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:selectedDay'])

function getChipLabel(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return `${date.getMonth() + 1}/${date.getDate()}`
}
</script>

<style scoped>
.day-chips {
  display: flex; gap: 8px; overflow-x: auto;
  padding-bottom: 8px; margin-bottom: 1rem;
  scrollbar-width: none;
}
.day-chips::-webkit-scrollbar { display: none; }
.day-chip {
  flex-shrink: 0; padding: 6px 12px;
  border-radius: var(--radius-full); font-size: 13px;
  background: var(--bg-deep); color: var(--text-secondary);
  border: 1px solid transparent; transition: all .2s;
}
.day-chip.active {
  background: var(--accent-soft); color: var(--accent-deep);
  border-color: var(--accent-glow); font-weight: 500;
}
</style>
