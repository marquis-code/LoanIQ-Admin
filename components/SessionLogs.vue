<template>
    <div class="space-y-6">
      <!-- <div v-if="loadingSessionsLogs" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div> -->
      <CoreLoader v-if="loadingSessionsLogs" class="mt-6" />
      
      <div v-else-if="!sessionsList?.length" class="flex flex-col items-center justify-center h-64 bg-white rounded-lg border">
        <div class="flex items-center justify-center p-6 mb-4">
          <img :src="dynamicIcons('illustration')" alt="No sessions" />
        </div>
        <p class="text-[#1D2739] font-medium text-sm">
          No Session Logs Available
        </p>
      </div>
      
      <div v-else class="grid gap-4 md:grid-cols-2">
        <div
          v-for="session in sessionsList"
          :key="session.id"
          @click="selectSession(session)"
          class="rounded-lg border p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
          :class="{ 'border-primary': selectedSession?.id === session.id }"
        >
          <div class="flex items-start gap-4">
            <div class="rounded-full p-2 bg-blue-100">
              <Clock class="h-5 w-5 text-blue-600" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h4 class="font-medium">Session</h4>
                <span class="text-sm text-gray-500">
                  {{ formatDate(session.time) }}
                </span>
              </div>
              <div class="mt-2 text-sm text-gray-500 flex flex-wrap gap-y-2">
                <span class="mr-4 flex items-center">
                  <MapPin class="mr-1 inline-block h-4 w-4" />
                  {{ session.location }}
                </span>
                <span class="flex items-center">
                  <Monitor class="mr-1 inline-block h-4 w-4" />
                  {{ session.device }}
                </span>
              </div>
              <div class="mt-2 pt-2 border-t border-dashed flex justify-between items-center">
                <span class="text-xs text-gray-400">
                  ID: {{ truncateId(session.id) }}
                </span>
                <button 
                  class="text-xs text-primary hover:underline"
                  @click.stop="selectSession(session)"
                >
                  View Activities
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <ActivitySidebar 
        :is-open="isSidebarOpen" 
        :session="selectedSession" 
        :activities="activitiesList" 
        :is-loading="loadingActivitiesLogs"
        @close="closeSidebar" 
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Clock, MapPin, Monitor } from 'lucide-vue-next'
  import { useGetSessionLogs } from "@/composables/modules/users/useFetchSessionLogs";
  import { useGetActivitiesLogs } from "@/composables/modules/users/useFetchActivityLogs";
  
  // Get session and activity logs from composables
  const { sessionLogs: sessionsList, loading: loadingSessionsLogs } = useGetSessionLogs();
  const { activitiesLogs: activitiesList, loading: loadingActivitiesLogs, getActivitiesLogs } = useGetActivitiesLogs();
  
  interface Session {
    id: string
    userId: string
    location: string
    time: string
    device: string
    createdAt: string
    updatedAt: string
  }
  
  const selectedSession = ref<Session | null>(null)
  const isSidebarOpen = ref(false)
  
  const selectSession = async (session: Session) => {
    selectedSession.value = session
    isSidebarOpen.value = true
    
    // Call the fetchActivitiesLogs function from the composable}
    await getActivitiesLogs(session.id)
  }
  
  const closeSidebar = () => {
    isSidebarOpen.value = false
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
  
  const truncateId = (id: string) => {
    return id.substring(0, 8) + '...'
  }
  
  // This function would be implemented in your app
  const dynamicIcons = (name: string) => {
    // Return the appropriate icon URL based on the name
    return '/placeholder.svg?height=100&width=100'
  }
  </script>
  
  