<template>
  <div class="modal-overlay" :class="{ active: visible }" id="deleteModal" @click.self="closeModal">
    <div class="modal modal-confirm" @click.stop>
      <div class="confirm-icon">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      </div>
      <h3 class="confirm-title">確定要刪除嗎？</h3>
      <p class="confirm-desc">此動作無法復原，刪除後將會同步至雲端。</p>
      <div class="confirm-actions">
        <button type="button" class="btn btn-outline" @click="closeModal">取消</button>
        <button type="button" class="btn btn-danger" @click="confirmDelete">確定刪除</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'confirm'])

function closeModal() {
  emit('close')
}

function confirmDelete() {
  emit('confirm')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(28,28,26,0.4); backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; visibility: hidden; pointer-events: none;
  transition: opacity .3s var(--ease-out), visibility .3s;
}
.modal-overlay.active {
  opacity: 1; visibility: visible; pointer-events: auto;
}

.modal-confirm {
  width: 90%; max-width: 360px;
  background: #fff; border-radius: var(--radius-xl);
  padding: 2rem; text-align: center;
  box-shadow: var(--shadow-xl);
  transform: scale(0.95); transition: transform .3s var(--ease-out-back);
}
.modal-overlay.active .modal-confirm { transform: scale(1); }

.confirm-icon {
  width: 48px; height: 48px; border-radius: 50%;
  background: #ffebee; color: #F44336;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1rem;
}
.confirm-title { font-size: 1.25rem; font-weight: 600; margin-bottom: .5rem; }
.confirm-desc { font-size: var(--fs-body); color: var(--text-secondary); margin-bottom: 2rem; }
.confirm-actions { display: flex; gap: 1rem; }
.confirm-actions .btn { flex: 1; }

.btn {
  padding: .75rem 1.5rem; border-radius: var(--radius-full);
  font-weight: 500; font-size: var(--fs-body); transition: all .2s;
}
.btn-outline { background: transparent; border: 1px solid var(--border-strong); color: var(--text-primary); }
.btn-outline:hover { background: var(--bg-deep); }
.btn-danger { background: #F44336; color: #fff; border: none; }
.btn-danger:hover { background: #d32f2f; }
</style>
