import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  function showToast(message) {
    const id = Date.now() + Math.random().toString(36).substring(2)
    const toast = { id, message, removing: false }
    
    toasts.value.push(toast)
    
    setTimeout(() => {
      const index = toasts.value.findIndex(t => t.id === id)
      if (index !== -1) {
        toasts.value[index].removing = true
        setTimeout(() => {
          const rmIndex = toasts.value.findIndex(t => t.id === id)
          if (rmIndex !== -1) {
            toasts.value.splice(rmIndex, 1)
          }
        }, 350)
      }
    }, 2500)
  }

  return {
    toasts,
    showToast
  }
}
