<template>
  <div class="space-y-6">
    <CoreLoader v-if="loadingSessionsLogs" class="mt-6" />
    
    <div v-else-if="!sessionsList?.length" class="flex flex-col items-center justify-center h-64 bg-white rounded-lg border">
      <div class="flex items-center justify-center p-6 mb-4">
        <img :src="dynamicIcons('illustration')" alt="No sessions" />
      </div>
      <p class="text-[#1D2739] font-medium text-sm">
        No Session Logs Available
      </p>
    </div>
    
    <div v-else>
      <!-- View toggle and search controls -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center space-x-2">
          <button 
            @click="viewMode = 'grid'" 
            class="p-2 rounded-md transition-colors"
            :class="viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'"
            title="Grid view"
          >
            <LayoutGrid class="h-5 w-5" />
          </button>
          <button 
            @click="viewMode = 'list'" 
            class="p-2 rounded-md transition-colors"
            :class="viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'"
            title="List view"
          >
            <List class="h-5 w-5" />
          </button>
        </div>
        
        <div class="relative">
          <Search class="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search sessions..." 
            class="pl-9 pr-4 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid gap-4 md:grid-cols-2">
        <div
          v-for="session in filteredSessions"
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

      <!-- List View -->
      <div v-else class="border rounded-lg bg-white overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="session in filteredSessions" 
              :key="session.id"
              @click="selectSession(session)"
              class="hover:bg-gray-50 cursor-pointer transition-colors"
              :class="{ 'bg-primary/5': selectedSession?.id === session.id }"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="rounded-full p-1.5 bg-blue-100 mr-3">
                    <Clock class="h-4 w-4 text-blue-600" />
                  </div>
                  <span class="font-medium">Session</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center text-sm text-gray-500">
                  <MapPin class="mr-1 inline-block h-4 w-4" />
                  {{ session.location }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center text-sm text-gray-500">
                  <Monitor class="mr-1 inline-block h-4 w-4" />
                  {{ session.device }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(session.time) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ truncateId(session.id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button 
                  class="text-primary hover:underline"
                  @click.stop="selectSession(session)"
                >
                  View Activities
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination controls -->
      <div v-if="filteredSessions.length > 0" class="flex justify-between items-center mt-4">
        <div class="text-sm text-gray-500">
          Showing {{ paginatedSessions.length }} of {{ filteredSessions.length }} sessions
        </div>
        <div class="flex space-x-2">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="p-2 rounded-md border text-sm"
            :class="currentPage === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-600 border-gray-300 hover:bg-gray-50'"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="p-2 rounded-md border text-sm"
            :class="currentPage === totalPages ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-600 border-gray-300 hover:bg-gray-50'"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
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
import { ref, computed } from 'vue'
import { Clock, MapPin, Monitor, LayoutGrid, List, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
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

// View mode state
const viewMode = ref<'grid' | 'list'>('grid')
const selectedSession = ref<Session | null>(null)
const isSidebarOpen = ref(false)
const searchQuery = ref('')

// Pagination
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Filter sessions based on search query
const filteredSessions = computed(() => {
  if (!sessionsList.value?.length) return []
  
  if (!searchQuery.value) return sessionsList.value
  
  const query = searchQuery.value.toLowerCase()
  return sessionsList.value.filter(session => 
    session.id.toLowerCase().includes(query) ||
    session.location.toLowerCase().includes(query) ||
    session.device.toLowerCase().includes(query) ||
    formatDate(session.time).toLowerCase().includes(query)
  )
})

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredSessions.value.length / itemsPerPage.value)
})

// Get paginated sessions
const paginatedSessions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSessions.value.slice(start, end)
})

const selectSession = async (session: Session) => {
  selectedSession.value = session
  isSidebarOpen.value = true
  
  // Call the fetchActivitiesLogs function from the composable
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

