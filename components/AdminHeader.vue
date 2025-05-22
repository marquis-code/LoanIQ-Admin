<template>
    <header class="w-full">
      <div class="container">
        <div class="header-content">
          <div class="logo-section">
            <slot name="logo">
              <!-- <button>Toggle</button> -->
              <h1 class="logo">Admin Dashboard</h1>
            </slot>
          </div>
          
          <div class="actions-section">
            <slot name="actions"></slot>
            
            <!-- Notification Bell -->
            <div class="notification-wrapper">
              <button 
                class="notification-bell" 
                @click="toggleNotifications"
                :class="{ 'has-unread': unreadCount > 0 }"
              >
                <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
                <BellIcon v-if="!isOpen" class="bell-icon" />
                <BellOffIcon v-else class="bell-icon" />
              </button>
              
              <!-- Notification Dropdown -->
              <transition name="dropdown">
                <div v-if="isOpen" class="notification-dropdown">
                  <div class="notification-header">
                    <h3>Notifications</h3>
                    <div class="notification-actions">
                      <button 
                        class="action-button" 
                        @click="markAllAsRead"
                        :disabled="!hasNotifications || allRead"
                      >
                        <CheckIcon size="16" />
                        <span>Mark all read</span>
                      </button>
                      <button 
                        class="action-button" 
                        @click="clearAllNotifications"
                        :disabled="!hasNotifications"
                      >
                        <TrashIcon size="16" />
                        <span>Clear all</span>
                      </button>
                    </div>
                  </div>
                  
                  <div class="notification-list" v-if="hasNotifications">
                    <transition-group name="notification-item">
                      <div 
                        v-for="notification in notifications" 
                        :key="notification.id"
                        class="notification-item"
                        :class="{ 
                          'unread': !notification.read,
                          [`type-${notification.type}`]: true 
                        }"
                      >
                        <div class="notification-icon">
                          <InfoIcon v-if="notification.type === 'info'" />
                          <AlertTriangleIcon v-else-if="notification.type === 'warning'" />
                          <AlertCircleIcon v-else-if="notification.type === 'error'" />
                          <CheckCircleIcon v-else-if="notification.type === 'success'" />
                        </div>
                        <div class="notification-content">
                          <p class="notification-message">{{ notification.message }}</p>
                          <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
                        </div>
                        <div class="notification-actions">
                          <button 
                            class="action-icon" 
                            @click.stop="markAsRead(notification.id)"
                            v-if="!notification.read"
                            title="Mark as read"
                          >
                            <CheckIcon size="16" />
                          </button>
                          <button 
                            class="action-icon" 
                            @click.stop="clearNotification(notification.id)"
                            title="Remove notification"
                          >
                            <XIcon size="16" />
                          </button>
                        </div>
                      </div>
                    </transition-group>
                  </div>
                  
                  <div v-else class="empty-notifications">
                    <InboxIcon size="48" class="empty-icon" />
                    <p>No notifications yet</p>
                  </div>
                </div>
              </transition>
            </div>
            
            <slot name="user-menu"></slot>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { 
    BellIcon, BellOffIcon, CheckIcon, TrashIcon, 
    InfoIcon, AlertTriangleIcon, AlertCircleIcon, 
    CheckCircleIcon, XIcon, InboxIcon 
  } from 'lucide-vue-next'
  import { useAdminNotifications } from '@/composables/use-admin-notifications'
  
  const isOpen = ref(false)
  const { 
    notifications, 
    unreadCount, 
    initSocket, 
    markAsRead, 
    markAllAsRead, 
    clearNotification, 
    clearAllNotifications 
  } = useAdminNotifications()
  
  const hasNotifications = computed(() => notifications.value.length > 0)
  const allRead = computed(() => notifications.value.every(n => n.read))
  
  // Toggle notification dropdown
  const toggleNotifications = () => {
    isOpen.value = !isOpen.value
    
    // If opening and there are unread notifications, mark them as read after a delay
    if (isOpen.value) {
      setTimeout(() => {
        if (unreadCount.value > 0) {
          markAllAsRead()
        }
      }, 5000) // Mark as read after 5 seconds of viewing
    }
  }
  
  // Format timestamp to relative time (e.g., "2 minutes ago")
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.round(diffMs / 1000)
    const diffMin = Math.round(diffSec / 60)
    const diffHour = Math.round(diffMin / 60)
    const diffDay = Math.round(diffHour / 24)
  
    if (diffSec < 60) {
      return 'just now'
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString()
    }
  }
  
  // Close dropdown when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (isOpen.value && !target.closest('.notification-wrapper')) {
      isOpen.value = false
    }
  }
  
  // Initialize WebSocket connection
  onMounted(() => {
    initSocket()
    document.addEventListener('click', handleClickOutside)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  </script>
  
  <style scoped>
  .admin-header {
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 100;
    height: 64px;
    display: flex;
    align-items: center;
  }
  
  /* .container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
  }
   */
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo-section {
    display: flex;
    align-items: center;
  }
  
  .logo {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
  
  .actions-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  /* Notification Bell */
  .notification-wrapper {
    position: relative;
  }
  
  .notification-bell {
    position: relative;
    background: transparent;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .notification-bell:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .bell-icon {
    color: #555;
    transition: transform 0.3s ease;
  }
  
  .notification-bell:hover .bell-icon {
    transform: rotate(15deg);
  }
  
  .notification-bell.has-unread .bell-icon {
    color: #f43f5e;
    animation: bell-shake 2s infinite;
  }
  
  .notification-badge {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #f43f5e;
    color: white;
    border-radius: 10px;
    padding: 0 6px;
    font-size: 0.7rem;
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }
  
  /* Notification Dropdown */
  .notification-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 360px;
    max-width: 90vw;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    z-index: 1000;
  }
  
  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }
  
  .notification-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
  }
  
  .notification-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .action-button {
    display: flex;
    align-items: center;
    gap: 4px;
    background: transparent;
    border: none;
    font-size: 0.8rem;
    color: #555;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .action-button:hover:not(:disabled) {
    background-color: rgba(0, 0, 0, 0.05);
    color: #333;
  }
  
  .action-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .notification-list {
    max-height: 400px;
    overflow-y: auto;
  }
  
  .notification-item {
    display: flex;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s ease;
    position: relative;
  }
  
  .notification-item:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  .notification-item.unread {
    background-color: rgba(244, 63, 94, 0.05);
  }
  
  .notification-item.unread:hover {
    background-color: rgba(244, 63, 94, 0.08);
  }
  
  .notification-icon {
    margin-right: 12px;
    display: flex;
    align-items: flex-start;
    color: #555;
  }
  
  .type-info .notification-icon {
    color: #3b82f6;
  }
  
  .type-warning .notification-icon {
    color: #f59e0b;
  }
  
  .type-error .notification-icon {
    color: #ef4444;
  }
  
  .type-success .notification-icon {
    color: #10b981;
  }
  
  .notification-content {
    flex: 1;
  }
  
  .notification-message {
    margin: 0 0 4px 0;
    font-size: 0.9rem;
    color: #333;
    line-height: 1.4;
  }
  
  .notification-time {
    font-size: 0.75rem;
    color: #888;
  }
  
  .notification-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .notification-item:hover .notification-actions {
    opacity: 1;
  }
  
  .action-icon {
    background: transparent;
    border: none;
    color: #777;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  
  .action-icon:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #333;
  }
  
  .empty-notifications {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #888;
  }
  
  .empty-icon {
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  /* Animations */
  @keyframes bell-shake {
    0% { transform: rotate(0); }
    5% { transform: rotate(15deg); }
    10% { transform: rotate(-15deg); }
    15% { transform: rotate(0); }
    100% { transform: rotate(0); }
  }
  
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.3s ease;
  }
  
  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  
  .notification-item-enter-active,
  .notification-item-leave-active {
    transition: all 0.3s ease;
  }
  
  .notification-item-enter-from {
    opacity: 0;
    transform: translateX(-20px);
  }
  
  .notification-item-leave-to {
    opacity: 0;
    transform: translateX(20px);
  }
  </style>