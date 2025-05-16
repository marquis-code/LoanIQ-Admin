<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">


    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- Loading Spinner -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="relative">
          <div class="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
          <div class="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-primary opacity-40 animate-ping"></div>
        </div>
      </div>

      <!-- Tasks Container -->
      <div v-else class="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <!-- Filters Section -->
        <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-primary"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
              Task Management
            </h3>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Filter by:</span>
              <div class="flex items-center space-x-2">
                <button 
                  @click="statusFilter = ''"
                  :class="[
                    'px-3 py-1 text-sm rounded-full transition-colors',
                    statusFilter === '' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  All
                </button>
                <button 
                  @click="statusFilter = 'pending'"
                  :class="[
                    'px-3 py-1 text-sm rounded-full transition-colors',
                    statusFilter === 'pending' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  Pending
                </button>
                <button 
                  @click="statusFilter = 'approved'"
                  :class="[
                    'px-3 py-1 text-sm rounded-full transition-colors',
                    statusFilter === 'approved' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  Approved
                </button>
                <button 
                  @click="statusFilter = 'rejected'"
                  :class="[
                    'px-3 py-1 text-sm rounded-full transition-colors',
                    statusFilter === 'rejected' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  ]"
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search Input -->
            <div class="relative col-span-1 md:col-span-1">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search tasks..." 
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
            </div>
            
            <!-- Date Range Picker -->
            <div class="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <input 
                  type="date" 
                  v-model="dateRange.start" 
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                />
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <input 
                  type="date" 
                  v-model="dateRange.end" 
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                />
                <button
                  @click="clearFilters"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Task Cards (visible on small screens) -->
        <div class="md:hidden">
          <div v-if="paginatedTasks.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            No tasks found
          </div>
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div 
              v-for="task in paginatedTasks" 
              :key="task.id" 
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ task.action }}</h4>
                <span :class="getStatusClass(task.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ task.status }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div>
                  <span class="font-medium">Date:</span> {{ formatDate(task.createdAt) }}
                </div>
                <div>
                  <span class="font-medium">Time:</span> {{ formatTime(task.createdAt) }}
                </div>
                <div class="col-span-2">
                  <span class="font-medium">Treated By:</span> {{ task.treatedBy || 'N/A' }}
                </div>
              </div>
              <div class="mt-2 flex justify-end">
                <button 
                  @click.stop="openTaskDrawer(task)" 
                  class="inline-flex items-center justify-center p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-primary hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Tasks Table (hidden on small screens) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                <th class="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Treated By</th>
                <th class="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="task in paginatedTasks" :key="task.id" class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
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
                  {{ formatTime(task.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ task.treatedBy || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                  <button 
                    @click.stop="openTaskDrawer(task)" 
                    class="inline-flex items-center justify-center p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-primary hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedTasks.length === 0">
                <td colspan="6" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                  No tasks found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row justify-between items-center">
            <div class="flex items-center mb-4 sm:mb-0">
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Showing 
                <span class="font-medium">{{ paginationStart }}</span>
                to
                <span class="font-medium">{{ paginationEnd }}</span>
                of
                <span class="font-medium">{{ totalFilteredItems }}</span>
                results
              </p>
            </div>
            <div class="flex flex-wrap justify-center gap-2">
              <button
                @click="metadata.page = 1"
                :disabled="metadata.page === 1"
                :class="[
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  metadata.page === 1 
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden sm:block"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
                <span class="sm:hidden">First</span>
              </button>
              <button
                @click="prevPage"
                :disabled="metadata.page === 1"
                :class="[
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  metadata.page === 1 
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden sm:block"><polyline points="15 18 9 12 15 6"></polyline></svg>
                <span class="sm:hidden">Prev</span>
              </button>
              <span class="px-3 py-1.5 bg-primary text-white rounded-md text-sm font-medium">
                {{ metadata.page }}
              </span>
              <button
                @click="nextPage"
                :disabled="metadata.page >= metadata.totalPages"
                :class="[
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  metadata.page >= metadata.totalPages 
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden sm:block"><polyline points="9 18 15 12 9 6"></polyline></svg>
                <span class="sm:hidden">Next</span>
              </button>
              <button
                @click="metadata.page = metadata.totalPages"
                :disabled="metadata.page >= metadata.totalPages"
                :class="[
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  metadata.page >= metadata.totalPages 
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden sm:block"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
                <span class="sm:hidden">Last</span>
              </button>
            </div>
            <div class="hidden sm:flex items-center">
              <label for="pageSize" class="text-sm text-gray-700 dark:text-gray-300 mr-2">Per page:</label>
              <select 
                id="pageSize"
                v-model="metadata.pageSize" 
                class="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Task Detail Side Drawer - Separate from main layout to avoid z-index issues -->
  <Teleport to="body">
    <!-- Backdrop -->
    <div 
      v-if="showTaskDrawer"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
      @click="closeTaskDrawer"
    ></div>
    
    <!-- Drawer -->
    <div 
      v-if="showTaskDrawer"
      class="fixed inset-y-0 right-0 max-w-full flex z-50"
      @click.stop
    >
      <div 
        class="w-screen max-w-md transform transition-all duration-300 ease-in-out overflow-hidden"
        :class="{ 'translate-x-0': showTaskDrawer, 'translate-x-full': !showTaskDrawer }"
        style="animation: slideIn 0.3s ease-out;"
      >
        <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl rounded-l-2xl">
          <!-- Drawer Header -->
          <div class="px-6 py-6 border-b dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <span class="bg-primary bg-opacity-10 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </span>
                Task Details
              </h2>
              <button 
                @click="closeTaskDrawer" 
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none transition-colors duration-200"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Drawer Content -->
          <div v-if="selectedTask" class="flex-1 px-6 py-6 overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <span class="font-medium text-gray-900 dark:text-white">Status:</span>
                <span :class="getStatusClass(selectedTask.status)" class="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ selectedTask.status }}
                </span>
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">ID: {{ selectedTask.id.substring(0, 8) }}...</span>
            </div>

            <div class="space-y-6">
              <!-- Task Info Card -->
              <div class="bg-gray-50 dark:bg-gray-750 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <div class="grid grid-cols-1 gap-4">
                  <div class="space-y-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Action</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ selectedTask.action }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Action ID</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ selectedTask.actionId }}</p>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                      <p class="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                      <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedTask.createdAt, true) }}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
                      <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedTask.updatedAt, true) }}</p>
                    </div>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Treated By</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ selectedTask.treatedBy || 'N/A' }}</p>
                  </div>
                </div>
              </div>

              <div>
                <label class="text-sm text-gray-600 pb-3">Comment</label>
                <textarea placeholder="Please add a comment" v-model="taskComment" class="border-[0.5px] outline-none mt-3 p-2 resize-none border-gray-100 text-sm w-full rounded-xl" rows="6" cols="6" />
              </div>

              <!-- Description Details -->
              <div v-if="selectedTask.description" class="mt-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description Details</h3>
                <div class="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div class="divide-y divide-gray-200 dark:divide-gray-700">
                    <div 
                      v-for="(value, key) in parseDescription(selectedTask)" 
                      :key="key" 
                      class="flex flex-col sm:flex-row sm:items-center py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div class="font-medium text-gray-700 dark:text-gray-300 sm:w-1/3">{{ key }}</div>
                      <div class="text-gray-600 dark:text-gray-400 sm:w-2/3 mt-1 sm:mt-0">{{ value }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Drawer Footer with Action Buttons -->
          <div v-if="selectedTask" class="border-t border-gray-200 dark:border-gray-700 px-6 py-5">
            <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button 
                v-if="canApprove(selectedTask)"
                @click="handleAction('approve', selectedTask)" 
                class="inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-4 py-2.5 bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                :disabled="isProcessing"
              >
                <svg v-if="isProcessing && processingAction === 'approve'" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Approve
              </button>
              <button 
                v-if="canReject(selectedTask)"
                @click="handleAction('reject', selectedTask)" 
                class="inline-flex justify-center items-center rounded-lg border border-transparent shadow-sm px-4 py-2.5 bg-red-600 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                :disabled="isProcessing"
              >
                <svg v-if="isProcessing && processingAction === 'reject'" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                Reject
              </button>
              <button 
                @click="closeTaskDrawer" 
                class="inline-flex justify-center items-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
                :disabled="isProcessing"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useApproveRejectExternalInvestment } from '@/composables/modules/finance-mgt/useApproveRejectExternalInvestment'
import { useApproveRejectLiquidateInvestment } from '@/composables/modules/investments/useApproveLiquidateInvestment'
import { useUpdateTopupStatus } from "@/composables/modules/investments/useUpdateTopupStatus"
import { useUpdateRolloverStatus } from "@/composables/modules/investments/useUpdateRolloverStatus"
import { useUpdateFlaggingStatus } from '@/composables/modules/finance-mgt/useUpdateWalletSttaus'
import { useApproveRejectCreateInvestment } from "@/composables/modules/investments/useApproveInvestmentCreation"
import { useFetchTasks } from '@/composables/modules/finance-mgt/useFetchTasks'
import { useToast } from '@/composables/useToast'
import { definePageMeta } from '#imports'

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

interface DateRange {
  start: string | null
  end: string | null
}

// Fetch tasks with pagination
const { tasks: tasksList, loading, updateTaskStatus, pageSize, totalPages, fetchTasks, metadata } = useFetchTasks()
const { showToast } = useToast()

const taskComment = ref('')

// Search and filter states
const searchQuery = ref('')
const statusFilter = ref<string>('')
const dateRange = ref<DateRange>({
  start: null,
  end: null
})

// Current page and page size
const itemsPerPage = ref(10)

// Computed values for filtered tasks
const filteredTasks = computed(() => {
  let filtered = [...tasksList.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(task => 
      task.action.toLowerCase().includes(query) || 
      task.id.toLowerCase().includes(query) ||
      (task.treatedBy && task.treatedBy.toLowerCase().includes(query))
    )
  }
  
  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(task => task.status.toLowerCase() === statusFilter.value.toLowerCase())
  }
  
  // Apply date range filter
  if (dateRange.value.start) {
    const startDate = new Date(dateRange.value.start).getTime()
    filtered = filtered.filter(task => new Date(task.createdAt).getTime() >= startDate)
  }
  
  if (dateRange.value.end) {
    const endDate = new Date(dateRange.value.end).getTime() + 86400000 // Add one day to include the end date fully
    filtered = filtered.filter(task => new Date(task.createdAt).getTime() <= endDate)
  }
  
  return filtered
})

// Pagination logic
const paginatedTasks = computed(() => {
  const start = (metadata.value.page - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTasks.value.slice(start, end)
})

const totalFilteredItems = computed(() => filteredTasks.value.length)

const paginationStart = computed(() => {
  if (filteredTasks.value.length === 0) return 0
  return (metadata.value.page - 1) * itemsPerPage.value + 1
})

const paginationEnd = computed(() => {
  return Math.min(metadata.value.page * itemsPerPage.value, filteredTasks.value.length)
})

// Pagination controls
const prevPage = () => {
  if (metadata.value.page > 1) {
    metadata.value.page--
  }
}

const nextPage = () => {
  if (metadata.value.page < metadata.value.totalPages) {
    metadata.value.page++
  }
}

// Clear all filters
const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  dateRange.value = {
    start: null,
    end: null
  }
  metadata.value.page = 1
}

// Reset to page 1 when filters change
watch([searchQuery, statusFilter, dateRange], () => {
  metadata.value.page = 1
}, { deep: true })

// Task drawer state
const showTaskDrawer = ref(false)
const selectedTask = ref<Task | null>(null)

const openTaskDrawer = (task: Task) => {
  selectedTask.value = task
  showTaskDrawer.value = true
}

const closeTaskDrawer = () => {
  showTaskDrawer.value = false
  setTimeout(() => {
    selectedTask.value = null
  }, 300) // Match the transition duration
}

// Processing state
const isProcessing = ref(false)
const processingAction = ref<'approve' | 'reject' | null>(null)

// Import the composables
const { approveRejectExternalInvestment, approvalResult, loading: updatingInvestmentStatus } = useApproveRejectExternalInvestment()
const { updateFlaggingStatus, updateResult, loading: updatingWalletStatus } = useUpdateFlaggingStatus()
const { approveRejectLiquidateInvestment, loading: updatingLiquidationStatus } = useApproveRejectLiquidateInvestment()
const { updateTopupStatus, loading: updatingTopupStatus } = useUpdateTopupStatus()
const { updateRolloverStatus, loading: updatingRolloverStatus } = useUpdateRolloverStatus()
const { updateInvestmentCreationStatus, loading: updatingInvestmentCreationStatus } = useApproveRejectCreateInvestment()

// Handle approve/reject action directly
const handleAction = async (action: 'approve' | 'reject', task: Task) => {
  if (!task) {
    showToast({
      title: 'Error',
      description: 'No task selected',
      type: 'error'
    })
    return
  }

  isProcessing.value = true
  processingAction.value = action

  try {
    const { action: taskAction, actionId, id } = task
    console.log(taskAction, 'action here')
    const newStatus = action === 'approve' ? 'approved' : 'rejected'
    const isApproval = action === 'approve'
    
    console.log(`Processing ${action} action for task:`, task)
    
    let operationSuccess = true
    let res = ''
    
    // Handle different task actions
    switch (taskAction) {
      case 'add-external-investment':
        const externalInvestmentUpdateResponse = await approveRejectExternalInvestment(actionId, { action: action === 'approve' ? 'approved' : 'rejected', comment: taskComment.value })
        if(externalInvestmentUpdateResponse.status  === 'success'){
          operationSuccess = updateResult.value
          closeTaskDrawer()
          window.location.reload()
        }
        break
        
      case 'unflag-wallet':
        const unflagInvestmentResponse = await updateFlaggingStatus(actionId, { action: action === 'approve' ? 'approved' : 'rejected', comment: taskComment.value })
        if(unflagInvestmentResponse.status  === 'success'){
          operationSuccess = updateResult.value
          closeTaskDrawer()
          window.location.reload()
        }
        break
        
      case 'investment-liquidation':
        const liquidationRes = await approveRejectLiquidateInvestment(id, { action: action === 'approve' ? 'approved' : 'rejected', comment: taskComment.value })
                if(liquidationRes.status  === 'success'){
          operationSuccess = updateResult.value
          closeTaskDrawer()
          window.location.reload()
        }
        break

      case 'investment-topup':
        const investmentTopup = await updateTopupStatus(id, { action: action === 'approve' ? 'approved' : 'rejected', comment: taskComment.value })
        if(investmentTopup.status  === 'success'){
          operationSuccess = updateResult.value
          closeTaskDrawer()
          window.location.reload()
        }
        break

      case 'investment-rollover':
        const investmentRollover = await updateRolloverStatus(id, { action: action === 'approve' ? 'approved' : 'rejected', comment: taskComment.value })
                 if(investmentRollover.status  === 'success'){
          operationSuccess = updateResult.value
          closeTaskDrawer()
          window.location.reload()
        }
        break

      case 'investment-creation':
        const res = await updateInvestmentCreationStatus(id, { action: action === 'approve' ? 'approved' : 'rejected', comment: taskComment.value })
        if(res.status  === 'success'){
          operationSuccess = updateResult.value
          closeTaskDrawer()
          window.location.reload()
        }
        break
        
      default:
        // For other task types, just update the task status
        await updateTaskStatus(id, newStatus)
        closeTaskDrawer()
    }
    
    // If specialized operation failed, throw error
    if (!operationSuccess && taskAction !== 'default') {
      throw new Error(`Failed to update ${taskAction} status`)
    }
    
    // Update common task status for add-external-investment and unflag-wallet
    if (operationSuccess && ['add-external-investment', 'unflag-wallet'].includes(taskAction)) {
      await updateTaskStatus(id, newStatus)
    }
    
    // Update the task in the local state
    if (selectedTask.value) {
      selectedTask.value.status = newStatus
      selectedTask.value.treatedBy = 'Current User'
      selectedTask.value.updatedAt = new Date().toISOString()
    }
    
    showToast({
      title: `Task ${isApproval ? 'Approved' : 'Rejected'}`,
      description: `The task has been successfully ${isApproval ? 'approved' : 'rejected'}.`,
      type: isApproval ? 'success' : 'error'
    })
    
    // Refresh the tasks list
    await fetchTasks()
    
    // Close the drawer after successful action
    closeTaskDrawer()
    
  } catch (error) {
    console.error('Error processing task:', error)
    showToast({
      title: 'Action Failed',
      description: `Failed to ${action} the task. Please try again.`,
      type: 'error'
    })
  } finally {
    isProcessing.value = false
    processingAction.value = null
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

const formatTime = (date: string) => {
  if (!date) return 'N/A'
  
  const options: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit'
  }
  
  return new Date(date).toLocaleTimeString(undefined, options)
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
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    rejected: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
  return classes[status.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const canApprove = (task: Task) => {
  return ['pending', 'in-progress'].includes(task.status.toLowerCase())
}

const canReject = (task: Task) => {
  return ['pending', 'in-progress'].includes(task.status.toLowerCase())
}

// Load tasks on component mount
onMounted(async () => {
  await fetchTasks()
})

// Define page meta (using try/catch to handle environments where this might not be available)
try {
  definePageMeta({
    layout: 'admin-dashboard',
    middleware: 'auth',
  })
} catch (error) {
  console.log('definePageMeta not available in this environment')
}
</script>

<style scoped>
/* Custom styles for transitions and animations */
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Custom scrollbar for the drawer */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

/* Dark mode scrollbar */
.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>