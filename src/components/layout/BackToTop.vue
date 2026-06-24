<template>
  <button 
    class="back-to-top" 
    :class="{ visible: uiStore.lastScrollY > 500 }" 
    @click="scrollToTop"
    id="backToTop"
    aria-label="回到頂部"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
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
  position: fixed; bottom: calc(var(--bottom-nav-h) + var(--safe-bottom) + 1.5rem);
  right: 1.5rem; z-index: 80;
  width: 44px; height: 44px;
  background: var(--bg-raised); border: 1px solid var(--border);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  color: var(--text-secondary);
  box-shadow: var(--shadow-md);
  opacity: 0; pointer-events: none;
  transform: translateY(16px);
  transition: all .3s var(--ease-out-expo);
}
.back-to-top svg { width: 20px; height: 20px; }
.back-to-top.visible {
  opacity: 1; pointer-events: auto; transform: translateY(0);
}
.back-to-top:active { background: var(--bg-deep); }
@media (max-width: 600px) {
  .back-to-top { bottom: calc(var(--bottom-nav-h) + var(--safe-bottom) + 5rem); right: 1rem; }
}
</style>
