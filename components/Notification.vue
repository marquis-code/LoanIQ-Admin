<!-- components/Notification.vue -->
<template>
    <Transition name="notification">
      <div 
        v-if="show" 
        :class="`fixed top-4 right-4 px-4 py-3 rounded-md shadow-lg z-50 max-w-sm ${bgColor} ${textColor}`"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <!-- Success Icon -->
            <svg v-if="type === 'success'" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            
            <!-- Error Icon -->
            <svg v-else-if="type === 'error'" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            
            <!-- Info Icon -->
            <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">{{ message }}</p>
          </div>
          <div class="ml-auto pl-3">
            <div class="-mx-1.5 -my-1.5">
              <button 
                @click="close" 
                class="inline-flex rounded-md p-1.5 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                :class="closeButtonColor"
              >
                <span class="sr-only">Dismiss</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  
  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value: string) => ['success', 'error', 'info'].includes(value)
    },
    timeout: {
      type: Number,
      default: 3000
    }
  });
  
  const emit = defineEmits(['close']);
  
  // Computed styles based on type
  const bgColor = computed(() => {
    switch (props.type) {
      case 'success': return 'bg-green-100';
      case 'error': return 'bg-red-100';
      default: return 'bg-blue-100';
    }
  });
  
  const textColor = computed(() => {
    switch (props.type) {
      case 'success': return 'text-green-700';
      case 'error': return 'text-red-700';
      default: return 'text-blue-700';
    }
  });
  
  const closeButtonColor = computed(() => {
    switch (props.type) {
      case 'success': return 'hover:bg-green-200 focus:ring-green-400';
      case 'error': return 'hover:bg-red-200 focus:ring-red-400';
      default: return 'hover:bg-blue-200 focus:ring-blue-400';
    }
  });
  
  // Auto-close timer
  let timer: NodeJS.Timeout | null = null;
  
  const close = () => {
    emit('close');
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  
  onMounted(() => {
    if (props.show && props.timeout > 0) {
      timer = setTimeout(() => {
        close();
      }, props.timeout);
    }
  });
  
  onUnmounted(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });
  </script>
  
  <style scoped>
  .notification-enter-active,
  .notification-leave-active {
    transition: all 0.3s ease;
  }
  
  .notification-enter-from,
  .notification-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
  </style>