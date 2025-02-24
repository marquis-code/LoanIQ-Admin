<!-- <template>
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">Tasks</h1>
        </div>
      </header>
  
      <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg font-medium leading-6 text-gray-900">All Tasks</h3>
            {{ tasksList }}
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="task in tasks" :key="task.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ task.title }}</div>
                        <div class="text-sm text-gray-500">{{ task.description }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="getPriorityClass(task.priority)"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ task.priority }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="getStatusClass(task.status)"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ task.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(task.dueDate) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      @click="updateTaskStatus(task.id, 'completed')"
                      class="text-green-600 hover:text-green-900 mr-4"
                    >
                      Complete
                    </button>
                    <button
                      @click="updateTaskStatus(task.id, 'cancelled')"
                      class="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useFetchTasks } from '@/composables/modules/finance-mgt/useFetchTasks'
  const { tasks: tasksList, loading } = useFetchTasks()
  import { useDummyData } from '@/composables/useDummyData'
  
  const { tasks } = useDummyData()
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }
  
  const getPriorityClass = (priority: string) => {
    const classes = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return classes[priority as keyof typeof classes] || 'bg-gray-100 text-gray-800'
  }
  
  const getStatusClass = (status: string) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
  }
  
  const updateTaskStatus = (taskId: string, newStatus: string) => {
    // Handle task status update
    console.log('Updating task status:', taskId, newStatus)
    // In a real application, you would make an API call here
  }

  definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth',
})
  </script> -->

  <template>
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 class="text-xl font-bold tracking-tight text-gray-900">Tasks</h1>
        </div>
      </header>
  
      <!-- Main Content -->
      <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <!-- Loading Spinner -->
        <div v-if="loading" class="flex justify-center items-center h-64">
          <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
  
        <!-- Tasks Table -->
        <div v-else class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">All Tasks</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treated By</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="task in tasksList" :key="task.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {{ task.action }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(task.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ task.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(task.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ task.treatedBy || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="openModal(task)" class="text-blue-600 hover:text-blue-900 focus:outline-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
  
      <!-- Modal -->
      <transition name="modal">
        <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen px-4 text-center">
            <!-- Overlay -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <!-- Modal Panel -->
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div class="bg-white px-6 py-4">
                <div class="flex justify-between items-center border-b pb-2">
                  <h3 class="text-xl font-semibold text-gray-800">Task Details</h3>
                  <button @click="closeModal" class="text-gray-600 hover:text-gray-800 focus:outline-none">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <div class="mt-4 text-gray-700 space-y-2">
                  <p><strong>ID:</strong> {{ selectedTask.id }}</p>
                  <p><strong>Action ID:</strong> {{ selectedTask.actionId }}</p>
                  <p><strong>Action:</strong> {{ selectedTask.action }}</p>
                  <p><strong>Status:</strong> {{ selectedTask.status }}</p>
                  <p><strong>Created At:</strong> {{ formatDate(selectedTask.createdAt) }}</p>
                  <p><strong>Updated At:</strong> {{ formatDate(selectedTask.updatedAt) }}</p>
                  <p><strong>Treated By:</strong> {{ selectedTask.treatedBy || 'N/A' }}</p>
                  <div v-if="selectedTask.description" class="mt-4">
                    <p class="mb-2 font-semibold">Description Details:</p>
                    <div class="overflow-x-auto border rounded-xl">
                      <table class="min-w-full divide-y divide-gray-200">
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="(value, key) in parseDescription(selectedTask)" :key="key">
                            <td class="px-4 py-2 font-medium text-gray-700">{{ key }}</td>
                            <td class="px-4 py-2 text-gray-600">{{ value }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-6 py-3 flex justify-end">
                <button @click="closeModal" type="button" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <!-- End Modal -->
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useFetchTasks } from '@/composables/modules/finance-mgt/useFetchTasks'
  const { tasks: tasksList, loading } = useFetchTasks()
  
  const showModal = ref(false)
  const selectedTask = ref<any>(null)
  
  const openModal = (task: any) => {
    selectedTask.value = task
    showModal.value = true
  }
  
  const closeModal = () => {
    showModal.value = false
    selectedTask.value = null
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }
  
  const parseDescription = (task: any) => {
    if (task.description) {
      try {
        return JSON.parse(task.description)
      } catch (e) {
        return {}
      }
    }
    return {}
  }
  
  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-200 text-gray-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  
  definePageMeta({
    layout: 'admin-dashboard',
    middleware: 'auth',
  })
  </script>
  
  <style scoped>
  /* Modal transition styles */
  .modal-enter-active, .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  .modal-enter-from, .modal-leave-to {
    opacity: 0;
  }
  </style>
  