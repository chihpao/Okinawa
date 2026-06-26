<template>
  <div class="day-frame" :class="{ active: isActive }" @click="emit('select')">
    <div class="frame-top"><span class="frame-rec"></span></div>
    <span class="frame-num">{{ day.dayNumber }}</span>
    <span class="frame-date">{{ formattedDate }}</span>
    <span class="frame-sub" v-if="day.subtitle && showSubtitle">{{ day.subtitle }}</span>
    <div class="frame-corner frame-corner-bl"></div>
    <div class="frame-corner frame-corner-br"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  day: { type: Object, required: true },
  index: { type: Number, required: true },
  isActive: { type: Boolean, default: false }
})
const emit = defineEmits(['select'])

const showSubtitle = computed(() => true)

const formattedDate = computed(() => {
  const date = new Date(props.day.date + 'T00:00:00')
  const m = date.getMonth() + 1
  const d = date.getDate()
  const dlabel = props.day.dayOfWeek ? `(${props.day.dayOfWeek})` : ''
  return `${m}/${d} ${dlabel}`
})
</script>

<style scoped>
.day-frame {
  flex: 1 1 0;
  max-width: calc((100vw - 24px - (var(--frame-gap) * 4)) / 5);
  background: linear-gradient(170deg, var(--paper-2) 0%, var(--paper-3) 100%);
  position: relative; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  aspect-ratio: 4/3; text-align: center; padding: 1.5rem 1rem;
  cursor: pointer; user-select: none;
  transition: transform .38s var(--ease-spring), filter .32s var(--ease-out), box-shadow .32s var(--ease-out);
  filter: grayscale(80%) opacity(0.78);
  box-shadow: var(--shadow-xs);
}
@media (min-width: 1000px) {
  .day-frame { max-width: 200px; }
}
.day-frame::after {
  content: ''; position: absolute; inset: 0; border-radius: 2px;
  box-shadow: inset 0 0 36px rgba(0,0,0,0.10);
  pointer-events: none;
}
.day-frame:hover { filter: grayscale(35%) opacity(0.94); transform: translateY(-3px) scale(1.01); }
.day-frame.active {
  filter: grayscale(0) opacity(1);
  transform: scale(1.035) translateY(-4px); z-index: 3;
  background: linear-gradient(170deg, var(--paper-2) 0%, #fff 60%, var(--paper-2) 100%);
  box-shadow: var(--shadow-md), 0 0 0 1.5px var(--accent);
}

.frame-top { position: absolute; top: .85rem; left: 1rem; right: 1rem; display: flex; justify-content: flex-end; }
.frame-rec {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--border-strong);
  transition: background .25s, box-shadow .25s;
}
.day-frame.active .frame-rec {
  background: var(--accent);
  box-shadow: 0 0 0 0 var(--accent-glow);
  animation: softPing 2.4s ease-out infinite;
}

.frame-num {
  font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 3rem);
  line-height: 1; font-weight: 500; color: var(--text-primary);
  font-style: italic;
}
.frame-date {
  font-size: .6875rem; color: var(--text-secondary);
  letter-spacing: .08em; margin-top: .45rem; font-weight: 500;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.frame-sub {
  font-size: .75rem; color: var(--text-tertiary);
  margin-top: .25rem; font-style: italic;
}

.frame-corner {
  position: absolute; width: 12px; height: 12px;
  border-color: var(--text-tertiary); border-style: solid;
  opacity: 0; transition: opacity .32s var(--ease-out);
}
.frame-corner-bl { bottom: 6px; left: 6px; border-width: 0 0 1.5px 1.5px; }
.frame-corner-br { bottom: 6px; right: 6px; border-width: 0 1.5px 1.5px 0; }
.day-frame.active .frame-corner { opacity: 0.7; }

@media (max-width: 600px) {
  .day-frame {
    aspect-ratio: 3/4;
    padding: 0.5rem 0.2rem;
    border-radius: 2px;
  }
  .frame-num { font-size: 1.5rem; }
  .frame-date { font-size: 8px; letter-spacing: 0; transform: scale(0.92); }
  .frame-sub { display: none; }
  .frame-top { top: 0.4rem; left: 0.4rem; right: 0.4rem; }
  .frame-rec { width: 5px; height: 5px; }
  .day-frame.active { transform: scale(1.05); }
  .frame-corner { width: 8px; height: 8px; }
}
</style>