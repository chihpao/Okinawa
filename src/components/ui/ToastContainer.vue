<template>
  <div class="toast-container" id="toastContainer">
    <div 
      v-for="toast in toasts" 
      :key="toast.id" 
      class="toast" 
      :class="{ 'toast-out': toast.removing }"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toasts } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
  z-index: 1000; display: flex; flex-direction: column; gap: 8px;
  pointer-events: none;
}
.toast {
  background: var(--text-primary); color: #fff;
  padding: 12px 24px; border-radius: var(--radius-full);
  font-size: 14px; font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: toastIn .3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
.toast.toast-out {
  animation: toastOut .3s cubic-bezier(0.5, 0, 0.8, 0.2) forwards;
}
</style>
