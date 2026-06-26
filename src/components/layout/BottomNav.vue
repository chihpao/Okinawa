<template>
  <nav class="bottom-nav" :class="{ hidden: uiStore.isNavHidden }" id="bottomNav">
    <div class="nav-content">
      <button class="fab" @click="emit('add'); $event && ripple($event)" id="btnFab">
        <span class="fab-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.2" fill="none"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </span>
        <span class="fab-label">新增行程</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'
import { useMotion } from '@/composables/useMotion'

const uiStore = useUiStore()
const emit = defineEmits(['add'])
const motion = useMotion()
function ripple(e) {
  if (motion && motion.createRipple) motion.createRipple(e)
}
</script>

<style scoped>
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 90;
  padding-bottom: var(--safe-bottom);
  transition: transform .4s var(--ease-out-expo);
  pointer-events: none;
}
.bottom-nav.hidden { transform: translateY(calc(100% + var(--safe-bottom))); }
.bottom-nav.hidden .fab { transform: translateY(20%) scale(0.9); }
.nav-content {
  display: flex; justify-content: center; align-items: center;
  padding: 0 1rem;
  pointer-events: none;
}
.fab {
  position: relative;
  display: flex; align-items: center; gap: .55rem;
  background: var(--bg-ink); color: var(--text-inverse);
  padding: .95rem 1.5rem;
  border-radius: var(--radius-full);
  font-weight: 500; font-size: var(--fs-caption); letter-spacing: .04em;
  box-shadow: 0 6px 22px rgba(26,25,22,0.18), var(--shadow-sm);
  transition: transform .22s var(--ease-out-back), box-shadow .22s;
  pointer-events: auto;
  overflow: hidden;
}
.fab:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(26,25,22,0.22); }
.fab:active { transform: scale(0.96); }
.fab-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 20px; height: 20px;
  transition: transform .28s var(--ease-out-back);
}
.fab:hover .fab-icon { transform: rotate(90deg); }

@media (max-width: 600px) {
  .bottom-nav {
    background: var(--bg-overlay);
    backdrop-filter: blur(14px) saturate(1.1);
    -webkit-backdrop-filter: blur(14px) saturate(1.1);
    border-top: 1px solid var(--border-light);
  }
  .nav-content { padding: .7rem 1rem; pointer-events: auto; }
  .fab { width: 100%; justify-content: center; }
}

.ripple {
  position: absolute; border-radius: 50%;
  pointer-events: none;
  background: rgba(255,255,255,0.18);
  width: 0; height: 0;
  animation: rippleGo 0.6s var(--ease-out) forwards;
}
</style>