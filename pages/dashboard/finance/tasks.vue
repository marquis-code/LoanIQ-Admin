<!-- <template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">

    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Tasks</h1>
      </div>
    </header>


    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="relative">
          <div class="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
          <div class="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-primary opacity-40 animate-ping"></div>
        </div>
      </div>


      <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">All Tasks</h3>
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search tasks..." 
              class="px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span class="absolute right-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Treated By</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="task in filteredTasks" :key="task.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ task.action }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(task.status)" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ task.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(task.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ task.treatedBy || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="openTaskModal(task)" class="text-primary hover:text-primary-dark focus:outline-none transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredTasks.length === 0">
                <td colspan="5" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                  No tasks found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>


    <TransitionRoot appear :show="showTaskModal" as="template">
      <Dialog as="div" @close="closeTaskModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div class="flex justify-between items-center border-b dark:border-gray-700 pb-3">
                  <DialogTitle as="h3" class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <span class="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </span>
                    Task Details
                  </DialogTitle>
                  <button @click="closeTaskModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                <div v-if="selectedTask" class="mt-4 text-gray-700 dark:text-gray-300 space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <span class="font-medium text-gray-900 dark:text-white">Status:</span>
                      <span :class="getStatusClass(selectedTask.status)" class="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ selectedTask.status }}
                      </span>
                    </div>
                    <span class="text-sm text-gray-500 dark:text-gray-400">ID: {{ selectedTask.id }}</span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Action</p>
                      <p class="font-medium">{{ selectedTask.action }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Action ID</p>
                      <p class="font-medium">{{ selectedTask.actionId }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                      <p class="font-medium">{{ formatDate(selectedTask.createdAt, true) }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
                      <p class="font-medium">{{ formatDate(selectedTask.updatedAt, true) }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Treated By</p>
                      <p class="font-medium">{{ selectedTask.treatedBy || 'N/A' }}</p>
                    </div>
                  </div>

                  <div v-if="selectedTask.description" class="mt-4">
                    <p class="mb-2 font-semibold text-gray-900 dark:text-white">Description Details:</p>
                    <div class="overflow-x-auto border dark:border-gray-700 rounded-xl">
                      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          <tr v-for="(value, key) in parseDescription(selectedTask)" :key="key" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{{ key }}</td>
                            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ value }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div class="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <button 
                      v-if="canApprove(selectedTask)"
                      @click="openConfirmationModal('approve')" 
                      class="inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Approve
                    </button>
                    <button 
                      v-if="canReject(selectedTask)"
                      @click="openConfirmationModal('reject')" 
                      class="inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      Reject
                    </button>
                    <button 
                      @click="closeTaskModal" 
                      class="inline-flex justify-center items-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>


    <TransitionRoot appear :show="showConfirmationModal" as="template">
      <Dialog as="div" @close="closeConfirmationModal" class="relative z-20">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div class="flex flex-col items-center text-center mb-4">
                  <div class="w-16 h-16 mb-4 flex items-center justify-center rounded-full" :class="confirmationAction === 'approve' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                    <svg v-if="confirmationAction === 'approve'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </div>
                  <DialogTitle as="h3" class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ confirmationAction === 'approve' ? 'Approve Task' : 'Reject Task' }}
                  </DialogTitle>
                </div>

                <div class="mt-2">
                  <p class="text-gray-600 dark:text-gray-400">
                    Are you sure you want to {{ confirmationAction === 'approve' ? 'approve' : 'reject' }} this task? This action cannot be undone.
                  </p>
                </div>

                <div class="mt-6 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <button 
                    @click="confirmAction" 
                    :class="confirmationAction === 'approve' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'"
                    class="inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 text-white font-medium focus:outline-none focus:ring-2 transition-colors duration-200"
                  >
                    {{ confirmationAction === 'approve' ? 'Yes, Approve' : 'Yes, Reject' }}
                  </button>
                  <button 
                    @click="closeConfirmationModal" 
                    class="inline-flex justify-center items-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useFetchTasks } from '@/composables/modules/finance-mgt/useFetchTasks'
import { useToast } from '@/composables/useToast'

// Define types
interface Task {
  id: string
  actionId: string
  action: string
  status: string
  createdAt: string
  updatedAt: string
  treatedBy: string | null
  description?: string
}

// Fetch tasks
const { tasks: tasksList, loading, updateTaskStatus } = useFetchTasks()
const { showToast } = useToast()

// Search functionality
const searchQuery = ref('')
const filteredTasks = computed(() => {
  if (!searchQuery.value) return tasksList.value
  
  const query = searchQuery.value.toLowerCase()
  return tasksList.value.filter((task: Task) => 
    task.action.toLowerCase().includes(query) || 
    task.status.toLowerCase().includes(query) ||
    (task.treatedBy && task.treatedBy.toLowerCase().includes(query))
  )
})

// Task modal state
const showTaskModal = ref(false)
const selectedTask = ref<Task | null>(null)

const openTaskModal = (task: Task) => {
  selectedTask.value = task
  showTaskModal.value = true
}

const closeTaskModal = () => {
  showTaskModal.value = false
  setTimeout(() => {
    selectedTask.value = null
  }, 200)
}

// Confirmation modal state
const showConfirmationModal = ref(false)
const confirmationAction = ref<'approve' | 'reject'>('approve')

const openConfirmationModal = (action: 'approve' | 'reject') => {
  confirmationAction.value = action
  showConfirmationModal.value = true
}

const closeConfirmationModal = () => {
  showConfirmationModal.value = false
}

// Action handlers
const confirmAction = async () => {
  if (!selectedTask.value) return
  
  try {
    const newStatus = confirmationAction.value === 'approve' ? 'completed' : 'rejected'
    await updateTaskStatus(selectedTask.value.id, newStatus)
    
    // Update the task in the local state
    if (selectedTask.value) {
      selectedTask.value.status = newStatus
      selectedTask.value.treatedBy = 'Current User' // This would be the actual user in a real app
      selectedTask.value.updatedAt = new Date().toISOString()
    }
    
    showToast({
      title: `Task ${confirmationAction.value === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `The task has been successfully ${confirmationAction.value === 'approve' ? 'approved' : 'rejected'}.`,
      type: confirmationAction.value === 'approve' ? 'success' : 'error'
    })
    
    closeConfirmationModal()
  } catch (error) {
    showToast({
      title: 'Action Failed',
      description: `Failed to ${confirmationAction.value} the task. Please try again.`,
      type: 'error'
    })
  }
}

// Helper functions
const formatDate = (date: string, includeTime = false) => {
  if (!date) return 'N/A'
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  }
  
  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }
  
  return new Date(date).toLocaleDateString(undefined, options)
}

const parseDescription = (task: Task) => {
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
  return classes[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const canApprove = (task: Task) => {
  return ['pending', 'in-progress'].includes(task.status.toLowerCase())
}

const canReject = (task: Task) => {
  return ['pending', 'in-progress'].includes(task.status.toLowerCase())
}

definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth',
})
</script> -->

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Tasks</h1>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- Loading Spinner -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="relative">
          <div class="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
          <div class="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-primary opacity-40 animate-ping"></div>
        </div>
      </div>

      <!-- Tasks Table -->
      <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">All Tasks</h3>
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search tasks..." 
              class="px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span class="absolute right-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Treated By</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="task in filteredTasks" :key="task.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ task.action }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(task.status)" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ task.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(task.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ task.treatedBy || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="openTaskModal(task)" class="text-primary hover:text-primary-dark focus:outline-none transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredTasks.length === 0">
                <td colspan="5" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                  No tasks found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Task Detail Modal -->
    <TransitionRoot appear :show="showTaskModal" as="template">
      <Dialog as="div" @close="closeTaskModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div class="flex justify-between items-center border-b dark:border-gray-700 pb-3">
                  <DialogTitle as="h3" class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <span class="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </span>
                    Task Details
                  </DialogTitle>
                  <button @click="closeTaskModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                <div v-if="selectedTask" class="mt-4 text-gray-700 dark:text-gray-300 space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <span class="font-medium text-gray-900 dark:text-white">Status:</span>
                      <span :class="getStatusClass(selectedTask.status)" class="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ selectedTask.status }}
                      </span>
                    </div>
                    <span class="text-sm text-gray-500 dark:text-gray-400">ID: {{ selectedTask.id }}</span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Action</p>
                      <p class="font-medium">{{ selectedTask.action }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Action ID</p>
                      <p class="font-medium">{{ selectedTask.actionId }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                      <p class="font-medium">{{ formatDate(selectedTask.createdAt, true) }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
                      <p class="font-medium">{{ formatDate(selectedTask.updatedAt, true) }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Treated By</p>
                      <p class="font-medium">{{ selectedTask.treatedBy || 'N/A' }}</p>
                    </div>
                  </div>

                  <div v-if="selectedTask.description" class="mt-4">
                    <p class="mb-2 font-semibold text-gray-900 dark:text-white">Description Details:</p>
                    <div class="overflow-x-auto border dark:border-gray-700 rounded-xl">
                      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          <tr v-for="(value, key) in parseDescription(selectedTask)" :key="key" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td class="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{{ key }}</td>
                            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ value }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div class="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <button 
                      v-if="canApprove(selectedTask)"
                      @click="openConfirmationModal('approve')" 
                      class="inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                      :disabled="updatingInvestmentStatus || updatingWalletStatus"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Approve
                    </button>
                    <button 
                      v-if="canReject(selectedTask)"
                      @click="openConfirmationModal('reject')" 
                      class="inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                      :disabled="updatingInvestmentStatus || updatingWalletStatus"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      Reject
                    </button>
                    <button 
                      @click="closeTaskModal" 
                      class="inline-flex justify-center items-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Confirmation Modal -->
    <TransitionRoot appear :show="showConfirmationModal" as="template">
      <Dialog as="div" @close="closeConfirmationModal" class="relative z-20">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div class="flex flex-col items-center text-center mb-4">
                  <div class="w-16 h-16 mb-4 flex items-center justify-center rounded-full" :class="confirmationAction === 'approve' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                    <svg v-if="confirmationAction === 'approve'" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </div>
                  <DialogTitle as="h3" class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ confirmationAction === 'approve' ? 'Approve Task' : 'Reject Task' }}
                  </DialogTitle>
                </div>

                <div class="mt-2">
                  <p class="text-gray-600 dark:text-gray-400">
                    Are you sure you want to {{ confirmationAction === 'approve' ? 'approve' : 'reject' }} this task? This action cannot be undone.
                  </p>
                </div>

                <div class="mt-6 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <button 
                    @click="confirmAction" 
                    :class="confirmationAction === 'approve' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'"
                    class="inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 text-white font-medium focus:outline-none focus:ring-2 transition-colors duration-200"
                    :disabled="updatingInvestmentStatus || updatingWalletStatus"
                  >
                    {{ confirmationAction === 'approve' ? 'Yes, Approve' : 'Yes, Reject' }}
                  </button>
                  <button 
                    @click="closeConfirmationModal" 
                    class="inline-flex justify-center items-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApproveRejectExternalInvestment } from '@/composables/modules/finance-mgt/useApproveRejectExternalInvestment'
import { useUpdateFlaggingStatus } from '@/composables/modules/finance-mgt/useUpdateWalletSttaus'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useFetchTasks } from '@/composables/modules/finance-mgt/useFetchTasks'
import { useToast } from '@/composables/useToast'

// Import the composables
const { approveRejectExternalInvestment, approvalResult, loading: updatingInvestmentStatus } = useApproveRejectExternalInvestment()
const { updateFlaggingStatus, updateResult, loading: updatingWalletStatus } = useUpdateFlaggingStatus()

// Define types
interface Task {
  id: string
  actionId: string
  action: string
  status: string
  createdAt: string
  updatedAt: string
  treatedBy: string | null
  description?: string
}

// Fetch tasks
const { tasks: tasksList, loading, updateTaskStatus } = useFetchTasks()
const { showToast } = useToast()

// Search functionality
const searchQuery = ref('')
const filteredTasks = computed(() => {
  if (!searchQuery.value) return tasksList.value
  
  const query = searchQuery.value.toLowerCase()
  return tasksList.value.filter((task: Task) => 
    task.action.toLowerCase().includes(query) || 
    task.status.toLowerCase().includes(query) ||
    (task.treatedBy && task.treatedBy.toLowerCase().includes(query))
  )
})

// Task modal state
const showTaskModal = ref(false)
const selectedTask = ref<Task | null>(null)

const openTaskModal = (task: Task) => {
  selectedTask.value = task
  showTaskModal.value = true
}

const closeTaskModal = () => {
  showTaskModal.value = false
  setTimeout(() => {
    selectedTask.value = null
  }, 200)
}

// Confirmation modal state
const showConfirmationModal = ref(false)
const confirmationAction = ref<'approve' | 'reject'>('approve')

const openConfirmationModal = (action: 'approve' | 'reject') => {
  confirmationAction.value = action
  showConfirmationModal.value = true
}

const closeConfirmationModal = () => {
  showConfirmationModal.value = false
}

// Action handlers
const confirmAction = async () => {
  if (!selectedTask.value) return
  
  try {
    const newStatus = confirmationAction.value === 'approve' ? 'completed' : 'rejected'
    const statusPayload = { status: newStatus }
    
    // Handle different task actions with appropriate composables
    if (selectedTask.value.action === 'add-external-investment') {
      // For external investment tasks, use the investment composable
      await approveRejectExternalInvestment({
        investmentId: selectedTask.value.actionId,
        payload: statusPayload
      })
      
      // Check if the operation was successful
      if (approvalResult.value) {
        await updateTaskStatus(selectedTask.value.id, newStatus)
      } else {
        throw new Error('Failed to update investment status')
      }
    } 
    else if (selectedTask.value.action === 'unflag-wallet') {
      // For wallet flagging tasks, use the wallet status composable
      await updateFlaggingStatus({
        walletId: selectedTask.value.actionId,
        payload: statusPayload
      })
      
      // Check if the operation was successful
      if (updateResult.value) {
        await updateTaskStatus(selectedTask.value.id, newStatus)
      } else {
        throw new Error('Failed to update wallet flagging status')
      }
    } 
    else {
      // For other task types, just update the task status
      await updateTaskStatus(selectedTask.value.id, newStatus)
    }
    
    // Update the task in the local state
    if (selectedTask.value) {
      selectedTask.value.status = newStatus
      selectedTask.value.treatedBy = 'Current User' // This would be the actual user in a real app
      selectedTask.value.updatedAt = new Date().toISOString()
    }
    
    showToast({
      title: `Task ${confirmationAction.value === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `The task has been successfully ${confirmationAction.value === 'approve' ? 'approved' : 'rejected'}.`,
      type: confirmationAction.value === 'approve' ? 'success' : 'error'
    })
    
    closeConfirmationModal()
  } catch (error) {
    showToast({
      title: 'Action Failed',
      description: `Failed to ${confirmationAction.value} the task. Please try again.`,
      type: 'error'
    })
  }
}

// Helper functions
const formatDate = (date: string, includeTime = false) => {
  if (!date) return 'N/A'
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  }
  
  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }
  
  return new Date(date).toLocaleDateString(undefined, options)
}

const parseDescription = (task: Task) => {
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
  return classes[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const canApprove = (task: Task) => {
  return ['pending', 'in-progress'].includes(task.status.toLowerCase())
}

const canReject = (task: Task) => {
  return ['pending', 'in-progress'].includes(task.status.toLowerCase())
}

definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth',
})
</script>