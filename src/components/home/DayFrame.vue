<template>
  <div class="day-frame" :class="{ active: isActive }" @click="emit('select')">
    <div class="frame-top">
      <span class="frame-rec"></span>
    </div>
    <span class="frame-num">{{ day.dayNumber }}</span>
    <span class="frame-date">{{ formattedDate }}</span>
    <span class="frame-sub" v-if="day.subtitle">{{ day.subtitle }}</span>
    <div class="frame-bottom"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  day: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

const formattedDate = computed(() => {
  const date = new Date(props.day.date + 'T00:00:00')
  const m = date.getMonth() + 1
  const d = date.getDate()
  const dlabel = props.day.dayOfWeek ? `(${props.day.dayOfWeek})` : ''
  return `${m}月${d}日 ${dlabel}`
})
</script>

<style scoped>
.day-frame {
  flex: 1 1 0;
  max-width: calc((100vw - 24px - (var(--frame-gap, 3px) * 4)) / 5);
  background: var(--bg-base); position: relative;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  aspect-ratio: 4/3; text-align: center; padding: 1.5rem 1rem;
  cursor: pointer; user-select: none;
  transition: transform .3s var(--ease-out-expo), filter .3s;
  filter: grayscale(100%) opacity(0.7);
}
@media (min-width: 1000px) {
  .day-frame { max-width: 200px; }
}
.day-frame::after {
  content: ''; position: absolute; inset: 0;
  box-shadow: inset 0 0 40px rgba(0,0,0,0.1);
  pointer-events: none;
}
.day-frame:hover { filter: grayscale(50%) opacity(0.9); }
.day-frame.active {
  filter: grayscale(0) opacity(1);
  transform: scale(1.02); z-index: 2;
}

.frame-top { position: absolute; top: 1rem; left: 1rem; right: 1rem; display: flex; justify-content: flex-end; }
.frame-rec {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--border-strong);
}
.day-frame.active .frame-rec { background: var(--accent); box-shadow: 0 0 8px var(--accent-glow); animation: pulse 2s infinite; }

.frame-num {
  font-family: var(--font-display); font-size: 3rem;
  line-height: 1; font-weight: 500; color: var(--text-primary);
}
.frame-date {
  font-size: var(--fs-micro); color: var(--text-secondary);
  letter-spacing: .1em; margin-top: .5rem; font-weight: 500;
}
.frame-sub {
  font-size: var(--fs-caption); color: var(--text-tertiary);
  margin-top: .25rem; font-style: italic;
}

.frame-bottom {
  position: absolute; bottom: 1rem; left: 1rem; right: 1rem;
  display: flex; justify-content: center;
  font-size: 10px; color: var(--text-tertiary); letter-spacing: .05em; text-transform: uppercase;
}

@media (max-width: 600px) {
  .day-frame {
    aspect-ratio: 2/3;
    padding: 0.5rem 0.2rem;
  }
  .frame-num { font-size: 1.5rem; }
  .frame-date { font-size: 9px; letter-spacing: 0; transform: scale(0.9); white-space: nowrap; }
  .frame-sub { display: none; }
  .frame-bottom { bottom: 0.5rem; font-size: 8px; transform: scale(0.8); white-space: nowrap; }
  .frame-top { top: 0.5rem; right: 0.5rem; }
  .frame-rec { width: 6px; height: 6px; }
}
</style>
