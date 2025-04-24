<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Tasks</h1>
      </div>
    </header>

    <!-- {{metadata}} -->
     <!-- {{metadata}} -->

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
        <!-- Filters Section -->
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">All Tasks</h3>
          
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Search Input -->
            <div class="relative flex-grow">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search tasks..." 
                class="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span class="absolute right-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
            </div>
            
            <!-- Status Filter -->
            <div class="w-full md:w-48">
              <select 
                v-model="statusFilter" 
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <!-- Date Range Picker -->
          <div class="mt-4 flex flex-col md:flex-row gap-4">
            <div class="w-full md:w-1/2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input 
                type="date" 
                v-model="dateRange.start" 
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div class="w-full md:w-1/2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input 
                type="date" 
                v-model="dateRange.end" 
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Tasks Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Treated By</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="task in paginatedTasks" :key="task.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
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
                  {{ formatTime(task.createdAt) }}
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
              <tr v-if="paginatedTasks?.length === 0">
                <td colspan="6" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                  No tasks found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- {{totalPages}} -->
        <!-- Pagination -->
        <div class="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:px-6">
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
                  'px-3 py-1 rounded-md text-sm',
                  metadata.page === 1 
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                First
              </button>
              <button
                @click="prevPage"
                :disabled="metadata.page === 1"
                :class="[
                  'px-3 py-1 rounded-md text-sm',
                  metadata.page === 1 
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                Previous
              </button>
              <span class="px-3 py-1 bg-primary text-white rounded-md text-sm">
                {{ metadata.page }}
              </span>
              <button
                @click="nextPage"
                :disabled="metadata.page >= metadata.totalPages"
                :class="[
                  'px-3 py-1 rounded-md text-sm',
                  metadata.page >= metadata.totalPages 
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                Next
              </button>
              <button
                @click="metadata.page = metadata.totalPages"
                :disabled="metadata.page >= metadata.totalPages"
                :class="[
                  'px-3 py-1 rounded-md text-sm',
                  metadata.page >= metadata.totalPages 
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                Last
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
                      @click="openConfirmationModal('approve', selectedTask)" 
                      class="inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                      :disabled="updatingInvestmentStatus || updatingWalletStatus"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Approve
                    </button>
                    <button 
                      v-if="canReject(selectedTask)"
                      @click="openConfirmationModal('reject', selectedTask)" 
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
                  <div v-if="selectedTask" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p class="text-sm font-medium">Task: {{ selectedTask.action }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">ID: {{ selectedTask.id }}</p>
                  </div>
                </div>

                <div class="mt-6 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <button 
                    @click="confirmAction()" 
                    :class="confirmationAction === 'approve' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'"
                    class="inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 text-white font-medium focus:outline-none focus:ring-2 transition-colors duration-200"
                    :disabled="isProcessing"
                  >
                    <svg v-if="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ confirmationAction === 'approve' ? 'Yes, Approve' : 'Yes, Reject' }}
                  </button>
                  <button 
                    @click="closeConfirmationModal" 
                    class="inline-flex justify-center items-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200"
                    :disabled="isProcessing"
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
import { ref, computed, watch, onMounted } from 'vue'
import { useApproveRejectExternalInvestment } from '@/composables/modules/finance-mgt/useApproveRejectExternalInvestment'
import { useApproveRejectLiquidateInvestment } from '@/composables/modules/investments/useApproveLiquidateInvestment'
import { useUpdateTopupStatus } from "@/composables/modules/investments/useUpdateTopupStatus"
import { useUpdateRolloverStatus } from "@/composables/modules/investments/useUpdateRolloverStatus"
import { useUpdateFlaggingStatus } from '@/composables/modules/finance-mgt/useUpdateWalletSttaus'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useApproveRejectCreateInvestment } from "@/composables/modules/investments/useApproveInvestmentCreation"
import { useFetchTasks } from '@/composables/modules/finance-mgt/useFetchTasks'
import { useToast } from '@/composables/useToast'

// Import the composables
const { approveRejectExternalInvestment, approvalResult, loading: updatingInvestmentStatus } = useApproveRejectExternalInvestment()
const { updateFlaggingStatus, updateResult, loading: updatingWalletStatus } = useUpdateFlaggingStatus()
const { approveRejectLiquidateInvestment, loading: updatingLiquidationStatus } = useApproveRejectLiquidateInvestment()
const { updateTopupStatus, loading: updatingTopupStatus } = useUpdateTopupStatus()
const { updateRolloverStatus, loading: updatingRolloverStatus } = useUpdateRolloverStatus()
const { updateInvestmentCreationStatus, loading: updatingInvestmentCreationStatus } = useApproveRejectCreateInvestment()

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

// Search and filter states
const searchQuery = ref('')
const statusFilter = ref<string>('')
const dateRange = ref<DateRange>({
  start: null,
  end: null
})

// Current page and page size
// const page = ref(1)
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

// const totalPages = computed(() => {
//   return Math.ceil(filteredTasks.value.length / itemsPerPage.value) || 1
// })

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
  console.log(metadata.value, 'merya a')
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

const openConfirmationModal = (action: 'approve' | 'reject', task: Task) => {
  confirmationAction.value = action
  // Make sure the task is set in the selectedTask ref
  selectedTask.value = task
  showConfirmationModal.value = true
}

const closeConfirmationModal = () => {
  showConfirmationModal.value = false
}

// Processing state
const isProcessing = ref(false)

const confirmAction = async () => {
  if (!selectedTask.value) {
    showToast({
      title: 'Error',
      description: 'No task selected',
      type: 'error'
    })
    return
  }

  isProcessing.value = true

  try {
    const { action, actionId, id } = selectedTask.value
    const newStatus = confirmationAction.value === 'approve' ? 'completed' : 'rejected'
    const isApproval = confirmationAction.value === 'approve'
    
    console.log(`Processing ${confirmationAction.value} action for task:`, selectedTask.value)
    
    let operationSuccess = true
    
    // Handle different task actions
    switch (action) {
      case 'add-external-investment':
        await approveRejectExternalInvestment(actionId, { status: newStatus })
        operationSuccess = approvalResult.value
        break
        
      case 'unflag-wallet':
        await updateFlaggingStatus(actionId, { status: newStatus })
        operationSuccess = updateResult.value
        break
        
      case 'investment-liquidation':
        await approveRejectLiquidateInvestment(id, { status: newStatus })
        operationSuccess = updateResult.value
        break

      case 'investment-topup':
        await updateTopupStatus(id, { status: newStatus })
        operationSuccess = updateResult.value
        break

      case 'investment-rollover':
        await updateRolloverStatus(id, { status: newStatus })
        operationSuccess = updateResult.value
        break

      case 'investment-creation':
        await updateInvestmentCreationStatus(id, { status: newStatus })
        operationSuccess = updateResult.value
        break
        
      default:
        // For other task types, just update the task status
        await updateTaskStatus(id, newStatus)
    }
    
    // If specialized operation failed, throw error
    if (!operationSuccess && action !== 'default') {
      throw new Error(`Failed to update ${action} status`)
    }
    
    // Update common task status for add-external-investment and unflag-wallet
    if (operationSuccess && ['add-external-investment', 'unflag-wallet'].includes(action)) {
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
    
  } catch (error) {
    console.error('Error processing task:', error)
    showToast({
      title: 'Action Failed',
      description: `Failed to ${confirmationAction.value} the task. Please try again.`,
      type: 'error'
    })
  } finally {
    closeConfirmationModal()
    closeTaskModal()
    isProcessing.value = false
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

// Load tasks on component mount
onMounted(async () => {
  await fetchTasks()
})

definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth',
})
</script>