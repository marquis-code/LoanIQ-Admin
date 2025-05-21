import { io, type Socket } from "socket.io-client"
import { ref, onUnmounted, computed } from "vue"
import { useUser } from "@/composables/auth/user";

const { getDecryptedAuthData } = useUser()
const decryptedData = getDecryptedAuthData();

export interface AdminNotification {
  id: string
  title?: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  timestamp: string
  read: boolean
}

export const useAdminNotifications = (adminId?: string) => {
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const lastError = ref<string | null>(null)
  const notifications = ref<AdminNotification[]>([])
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  
  // Initialize socket connection
  const initSocket = () => {
    console.log(`[AdminNotifications] Initializing socket connection`)
    
    // Close existing connection if any
    if (socket.value) {
      socket.value.disconnect();
    }
    
    // Initialize with the adminId in the query params
    // FIXED: Use the exact URL from the working example instead of VITE_BASE_URL
    socket.value = io('https://rave.loaniq.ng', {
      query: { adminId: decryptedData?.adminDTO?.id },
      transports: ['websocket'], // Only use websocket transport like in the working example
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })

    socket.value.on("connect", () => {
      console.log(`[AdminNotifications] Socket connected with ID: ${socket.value?.id}`)
      isConnected.value = true
      lastError.value = null
      
      // Join admin room if we have an adminId
      const currentAdminId = decryptedData?.adminDTO?.id
      if (currentAdminId && socket.value) {
        socket.value.emit('join-admin-room', currentAdminId)
        console.log(`[AdminNotifications] Joined admin room for ID: ${currentAdminId}`)
      }
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
        title: data.title,
        message: data.message || "New notification received",
        type: data.type || "info",
        timestamp: data.timestamp || new Date().toISOString(),
        read: false
      }
      
      // Add new notification at the beginning of the array (latest first)
      notifications.value = [notification, ...notifications.value]
      
      // Show desktop notification if supported and permission is granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title || 'Admin Notification', {
          body: notification.message,
          icon: '/notification-icon.png'
        });
      }
    })
  }

  // Request notification permissions
  const requestNotificationPermission = () => {
    if (!('Notification' in window)) {
      console.log('[AdminNotifications] This browser does not support desktop notifications')
      return Promise.resolve(false)
    }
    
    if (Notification.permission === 'granted') {
      return Promise.resolve(true)
    } else if (Notification.permission !== 'denied') {
      return Notification.requestPermission().then(permission => {
        return permission === 'granted'
      })
    }
    
    return Promise.resolve(false)
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
  
  // Send a test notification to all admins (for testing purposes)
  const sendTestNotification = async (title: string, message: string, type: string) => {
    try {
      // FIXED: Use the exact URL from the working example
      const apiUrl = `https://rave.loaniq.ng/api/v1/trigger-notification`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          message,
          type,
          adminId: decryptedData?.adminDTO?.id
        })
      })
      
      const result = await response.json()
      return result
    } catch (error) {
      console.error('[AdminNotifications] Error sending test notification:', error)
      throw error
    }
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
    sendTestNotification,
    requestNotificationPermission,
    cleanup,
  }
}