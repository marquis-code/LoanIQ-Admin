import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  timeout: number
}

export const useToast = () => {
  const toasts = ref<Toast[]>([])
  let toastId = 0

  const addToast = (message: string, type: Toast['type'], timeout = 3000) => {
    const id = toastId++
    const toast = { id, message, type, timeout }
    toasts.value.push(toast)
    
    setTimeout(() => {
      removeToast(id)
    }, timeout)
    
    return id
  }

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  const success = (message: string, timeout?: number) => addToast(message, 'success', timeout)
  const error = (message: string, timeout?: number) => addToast(message, 'error', timeout)
  const info = (message: string, timeout?: number) => addToast(message, 'info', timeout)
  const warning = (message: string, timeout?: number) => addToast(message, 'warning', timeout)

  return {
    toasts,
    success,
    error,
    info,
    warning,
    removeToast
  }
}