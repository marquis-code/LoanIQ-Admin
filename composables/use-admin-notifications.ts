import { io, type Socket } from "socket.io-client"
import { ref, onUnmounted, computed } from "vue"

export interface AdminNotification {
  id: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  timestamp: string
  read: boolean
}

export const useAdminNotifications = () => {
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const lastError = ref<string | null>(null)
  const notifications = ref<AdminNotification[]>([])
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  
  // Initialize socket connection
  const initSocket = (url = import.meta.env.VITE_BASE_URL) => {
    console.log(`[AdminNotifications] Initializing socket connection to ${url}`)
    
    socket.value = io(url, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      auth: {
        token: localStorage.getItem('token')
      }
    })

    socket.value.on("connect", () => {
      console.log(`[AdminNotifications] Socket connected with ID: ${socket.value?.id}`)
      isConnected.value = true
      lastError.value = null
    })

    socket.value.on("disconnect", () => {
      console.log("[AdminNotifications] Socket disconnected")
      isConnected.value = false
    })

    socket.value.on("connect_error", (err) => {
      console.log("[AdminNotifications] Connection error:", err)
      lastError.value = err.message
      isConnected.value = false
      
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (socket.value) {
          socket.value.connect()
        }
      }, 5000)
    })
    
    // Listen specifically for admin notifications
    socket.value.on("admin-notification", (data) => {
      console.log("[AdminNotifications] Received admin notification:", data)
      
      // Process the notification and add it to our list
      const notification: AdminNotification = {
        id: data.id || `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message: data.message || "New notification received",
        type: data.type || "info",
        timestamp: data.timestamp || new Date().toISOString(),
        read: false
      }
      
      // Add new notification at the beginning of the array (latest first)
      notifications.value = [notification, ...notifications.value]
    })
  }

  // Mark a notification as read
  const markAsRead = (notificationId: string) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications.value[index].read = true
      // Create a new array to trigger reactivity
      notifications.value = [...notifications.value]
    }
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    notifications.value = notifications.value.map(n => ({ ...n, read: true }))
  }

  // Clear a specific notification
  const clearNotification = (notificationId: string) => {
    notifications.value = notifications.value.filter(n => n.id !== notificationId)
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    notifications.value = []
  }

  // Cleanup function
  const cleanup = () => {
    if (socket.value) {
      console.log(`[AdminNotifications] Cleaning up socket connection`)
      socket.value.off("admin-notification")
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  // Auto-cleanup on component unmount
  onUnmounted(() => {
    cleanup()
  })

  return {
    socket,
    isConnected,
    lastError,
    notifications,
    unreadCount,
    initSocket,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    cleanup,
  }
}