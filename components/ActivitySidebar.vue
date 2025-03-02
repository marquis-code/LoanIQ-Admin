<template>
            <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
   <main>
    <div 
      class="fixed inset-0 bg-black/30 z-50 transition-opacity backdrop-blur-sm  duration-300"
      :class="isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      @click="$emit('close')"
    ></div>
    
    <div 
      class="fixed top-0 right-0 h-full bg-white z-50 w-full max-w-md shadow-xl transform transition-transform duration-300 overflow-hidden flex flex-col"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="p-4 border-b flex justify-between items-center">
        <h3 class="text-lg font-semibold">
          Session Activities
          <span v-if="session" class="text-sm font-normal text-gray-500 block">
            {{ formatDate(session.time) }}
          </span>
        </h3>
        <button 
          @click="$emit('close')"
          class="p-2 rounded-full hover:bg-gray-100"
        >
          <X class="h-5 w-5" />
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="isLoading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
        
        <div v-else-if="!activities?.length" class="flex flex-col items-center justify-center h-64">
          <FileX class="h-12 w-12 text-gray-300 mb-4" />
          <p class="text-gray-500">No activities found for this session</p>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="rounded-lg border p-4 bg-white"
          >
            <div class="flex items-start gap-4">
              <div class="rounded-full p-2 bg-green-100">
                <component
                  :is="getActivityIcon(activity.action)"
                  class="h-4 w-4 text-green-600"
                />
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="font-medium">{{ activity.action }}</h4>
                  <span class="text-sm text-gray-500">
                    {{ formatTime(activity.createdAt) }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-600">
                  {{ formatDescription(activity.description) }}
                </p>
                <div class="mt-2 text-xs text-gray-400">
                  ID: {{ truncateId(activity.id) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-4 border-t">
        <button 
          @click="$emit('close')"
          class="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
   </main>
</Transition>
  </template>
  
  <script setup lang="ts">
  import { X, FileX, Upload, LogIn, Settings, Activity } from 'lucide-vue-next'
  
  interface Session {
    id: string
    userId: string
    location: string
    time: string
    device: string
    createdAt: string
    updatedAt: string
  }
  
  interface Activity {
    id: string
    sessionId: string
    action: string
    description: string
    createdAt: string
    updatedAt: string
  }
  
  const props = defineProps<{
    isOpen: boolean
    session: Session | null
    activities: Activity[] | null
    isLoading: boolean
  }>()
  
  defineEmits<{
    (e: 'close'): void
  }>()
  
  const getActivityIcon = (action: string) => {
    const actionLower = action.toLowerCase()
    if (actionLower.includes('upload') || actionLower.includes('avatar')) {
      return Upload
    }
    if (actionLower.includes('login')) {
      return LogIn
    }
    if (actionLower.includes('settings') || actionLower.includes('update')) {
      return Settings
    }
    return Activity
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  const formatDescription = (description: string) => {
    try {
      // Try to parse JSON if it's a JSON string
      const parsed = JSON.parse(description)
      return Object.entries(parsed)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
    } catch (e) {
      // If not JSON, return as is
      return description
    }
  }
  
  const truncateId = (id: string) => {
    return id.substring(0, 8) + '...'
  }
  </script>
  
  

<style scoped>.backdrop-blur-sm {
    backdrop-filter: blur(8px);
  }
</style>