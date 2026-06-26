<template>
  <button
    class="back-to-top"
    :class="{ visible: uiStore.lastScrollY > 480 }"
    @click="scrollToTop"
    id="backToTop"
    aria-label="回到頂部"
  >
    <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
  </button>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'
import { useMotion } from '@/composables/useMotion'

const uiStore = useUiStore()
const motion = useMotion()

function scrollToTop() {
  motion.scrollToTop()
}
</script>

<style scoped>
.back-to-top {
  position: fixed; bottom: calc(var(--bottom-nav-h) + var(--safe-bottom) + 1.25rem);
  right: 1.25rem; z-index: 80;
  width: 42px; height: 42px;
  background: var(--bg-raised);
  border: 1px solid var(--border-light);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-secondary);
  box-shadow: var(--shadow-md);
  opacity: 0; pointer-events: none;
  transform: translateY(14px) scale(0.85);
  transition: all .38s var(--ease-out-expo);
}
.back-to-top .arrow {
  width: 18px; height: 18px;
  stroke-dasharray: 1, 28;
  stroke-dashoffset: 28;
  transition: stroke-dashoffset .4s var(--ease-out-quart);
}
.back-to-top.visible {
  opacity: 1; pointer-events: auto;
  transform: translateY(0) scale(1);
}
.back-to-top.visible .arrow {
  stroke-dashoffset: 0;
  animation: nudgeY 2.6s ease-in-out infinite 1s;
}
.back-to-top:hover { color: var(--accent); border-color: var(--accent-glow); box-shadow: var(--shadow-lg); }
.back-to-top:active { transform: scale(0.92); }

@media (max-width: 600px) {
  .back-to-top { bottom: calc(var(--bottom-nav-h) + var(--safe-bottom) + 4.5rem); right: 1rem; }
}
</style>