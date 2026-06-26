<template>
  <span class="flip" aria-hidden="true">
    <transition :name="transitionName" mode="out-in">
      <span :key="display" class="flip-cell">{{ display }}</span>
    </transition>
  </span>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  value: { type: [Number, String], default: 0 },
  digit: { type: Number, default: 2 },
  direction: { type: String, default: 'down' }
})

const display = ref('')
const transitionName = ref('flip-down')

watch(() => props.value, (v, old) => {
  if (v > old) transitionName.value = 'flip-down'
  else if (v < old) transitionName.value = 'flip-up'
})

const padded = computed(() => {
  const n = Number(props.value)
  const s = (Number.isFinite(n) ? n : 0).toString()
  return s.padStart(props.digit, '0')
})

watch(padded, (v) => { display.value = v }, { immediate: true })
</script>

<style scoped>
.flip {
  position: relative; display: inline-block;
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 500; color: var(--text-primary);
  line-height: 1; letter-spacing: -.02em;
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  min-width: 1ch; text-align: center;
}
.flip-cell { display: inline-block; }

.flip-up-enter-active,
.flip-up-leave-active,
.flip-down-enter-active,
.flip-down-leave-active {
  transition: transform .35s var(--ease-out-quart), opacity .35s var(--ease-out);
}
.flip-up-enter-from { transform: translateY(100%); opacity: 0; }
.flip-up-leave-to { transform: translateY(-100%); opacity: 0; }
.flip-down-enter-from { transform: translateY(-100%); opacity: 0; }
.flip-down-leave-to { transform: translateY(100%); opacity: 0; }
</style>