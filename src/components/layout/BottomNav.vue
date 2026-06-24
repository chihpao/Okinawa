<template>
  <nav class="bottom-nav" :class="{ hidden: uiStore.isNavHidden }" id="bottomNav">
    <div class="nav-content">
      <button class="nav-item primary" @click="emit('add')" id="btnFab">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>新增行程</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
const emit = defineEmits(['add'])
</script>

<style scoped>
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  z-index: 90;
  padding-bottom: var(--safe-bottom);
  transition: transform .3s var(--ease-out-expo);
}
.bottom-nav.hidden {
  transform: translateY(calc(100% + var(--safe-bottom)));
}
.nav-content {
  display: flex; justify-content: center; align-items: center;
  padding: 1rem;
}
.nav-item.primary {
  display: flex; align-items: center; gap: .5rem;
  background: var(--text-primary); color: #fff;
  padding: 1rem 1.75rem; border-radius: var(--radius-full);
  font-weight: 500; font-size: var(--fs-caption);
  box-shadow: var(--shadow-md);
  transition: transform .2s, box-shadow .2s;
}
.nav-item.primary:active { transform: scale(0.96); }

@media (max-width: 600px) {
  .bottom-nav {
    background: var(--bg-overlay);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-top: 1px solid var(--border);
  }
  .nav-content { padding: .75rem 1rem; }
  .nav-item.primary { width: 100%; justify-content: center; }
}
</style>
