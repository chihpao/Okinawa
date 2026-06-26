<template>
  <div class="modal-overlay" :class="{ active: visible }" id="deleteModal" @click.self="closeModal">
    <div class="modal modal-confirm" @click.stop>
      <div class="modal-drag-handle"></div>
      <div class="confirm-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
      </div>
      <h3 class="confirm-title">確定要刪除嗎？</h3>
      <p class="confirm-desc">此動作無法復原，刪除後將同步至雲端。</p>
      <div class="confirm-actions">
        <button type="button" class="btn btn-outline" @click="closeModal">取消</button>
        <button type="button" class="btn btn-danger" @click="confirmDelete">確定刪除</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ visible: { type: Boolean, default: false } })
const emit = defineEmits(['close', 'confirm'])
function closeModal() { emit('close') }
function confirmDelete() { emit('confirm') }
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(26,25,22,0.42);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; visibility: hidden; pointer-events: none;
  transition: opacity var(--dur-base) var(--ease-out), visibility var(--dur-base);
}
.modal-overlay.active { opacity: 1; visibility: visible; pointer-events: auto; }

.modal-confirm {
  width: 90%; max-width: 360px;
  background: #fff; border-radius: var(--radius-xl);
  padding: 1.75rem;
  text-align: center;
  box-shadow: var(--shadow-xl);
  transform: scale(0.94) translateY(8px);
  transition: transform var(--dur-page) var(--ease-spring);
}
.modal-overlay.active .modal-confirm { transform: scale(1) translateY(0); }
.modal-drag-handle { display: block; width: 32px; height: 4px; border-radius: 2px; background: var(--border); margin: -0.5rem auto 1rem; }

.confirm-icon {
  width: 42px; height: 42px; border-radius: 50%;
  background: #F8E6E0; color: #C0452F;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1rem;
}
.confirm-title { font-size: 1.125rem; font-weight: 600; margin-bottom: .4rem; letter-spacing: -.01em; }
.confirm-desc { font-size: var(--fs-body); color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6; }
.confirm-actions { display: flex; gap: .65rem; }
.confirm-actions .btn { flex: 1; }
.btn {
  padding: .7rem 1.4rem; border-radius: var(--radius-full);
  font-weight: 500; font-size: var(--fs-body);
  transition: transform .2s var(--ease-out-back), background .2s, color .2s;
}
.btn:active { transform: scale(0.95); }
.btn-outline { background: transparent; border: 1px solid var(--border-strong); color: var(--text-primary); }
.btn-outline:hover { background: var(--bg-deep); }
.btn-danger { background: #C0452F; color: #fff; border: none; }
.btn-danger:hover { background: var(--accent-deep); }

@media (max-width: 600px) {
  .modal-overlay { align-items: flex-end; }
  .modal-confirm {
    width: 100%; max-width: 100%;
    border-radius: 22px 22px 0 0;
    padding: 1.5rem 1.5rem calc(env(safe-area-inset-bottom, 0px) + 1rem);
    transform: translateY(100%);
    transition: transform var(--dur-page) var(--ease-out-expo);
  }
  .modal-overlay.active .modal-confirm { transform: translateY(0); }
  .modal-confirm::before {
    content: ''; display: block; width: 36px; height: 4px; border-radius: 2px;
    background: var(--border); margin: 0 auto 1.25rem;
  }
}
</style>