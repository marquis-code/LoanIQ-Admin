<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">Financial Management</h1>
        </div>
      </header>
  
      <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <!-- Analytics Cards -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <CreditCardIcon class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Inflows</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ formatCurrency(analytics.total_inflows) }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
  
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <BanknotesIcon class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Outflows</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ formatCurrency(analytics.total_outflows) }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
  
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ClockIcon class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Pending Transactions</dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        {{ analytics.total_pending_transacations }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Transactions Table -->
        <div class="bg-white shadow rounded-lg mb-8">
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Recent Transactions</h3>
            <div class="flex gap-4">
              <select v-model="pageSize" class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
              <button @click="refreshTransactions" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Refresh
              </button>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="transaction in transactions" :key="transaction.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ transaction.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ transaction.type }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatCurrency(transaction.amount) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(transaction.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ transaction.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getWalletStatusClass(transaction.flagged)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ transaction.flagged ? 'Flagged' : 'Active' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="flex space-x-4">
                      <button 
                        v-if="!transaction.flagged"
                        @click="openFlagWalletModal(transaction)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Flag Wallet
                      </button>
                      <button 
                        v-else
                        @click="openUnflagWalletModal(transaction)"
                        class="text-green-600 hover:text-green-900"
                      >
                        Unflag Wallet
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button @click="prevPage" :disabled="page === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button @click="nextPage" :disabled="page === transactions.totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing page {{ page }} of {{ transactions.totalPages }}
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button @click="prevPage" :disabled="page === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button @click="nextPage" :disabled="page === transactions.totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Flag Wallet Confirmation Modal -->
      <ConfirmationModal
        :is-open="isFlagModalOpen"
        title="Flag Wallet"
        message="Are you sure you want to flag this wallet? This action will restrict wallet operations."
        confirm-text="Flag Wallet"
        action-type="danger"
        @close="closeFlagModal"
        @confirm="confirmFlagWallet"
      />
  
      <!-- Unflag Wallet Confirmation Modal -->
      <ConfirmationModal
        :is-open="isUnflagModalOpen"
        title="Unflag Wallet"
        message="Are you sure you want to unflag this wallet? This will require approval from an administrator."
        confirm-text="Request Unflag"
        @close="closeUnflagModal"
        @confirm="confirmUnflagWallet"
      />
  
      <!-- Approve/Reject Unflag Modal -->
      <TransitionRoot appear :show="isApproveModalOpen" as="template">
        <Dialog as="div" @close="closeApproveModal" class="relative z-10">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black bg-opacity-25" />
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
                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    Review Unflag Request
                  </DialogTitle>
                  
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Please review the unflag request for wallet ID: {{ selectedTransaction?.walletId }}
                    </p>
                    <div class="mt-4">
                      <label class="block text-sm font-medium text-gray-700">Comments</label>
                      <textarea
                        v-model="approvalComment"
                        rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
  
                  <div class="mt-6 flex justify-end space-x-4">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                      @click="closeApproveModal"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      @click="rejectUnflag"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                      @click="approveUnflag"
                    >
                      Approve
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
  import { ref, onMounted } from 'vue'
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
  import { CreditCardIcon, BanknotesIcon, ClockIcon } from '@heroicons/vue/24/outline'
  import type { Transaction } from '~/types'
  import { useDummyData } from '~/composables/useDummyData'
  
  const { transactions } = useDummyData()
  
  // Types
  interface Analytics {
    total_inflows: number
    total_outflows: number
    total_pending_transacations: number
    total_credit: number
    total_debit: number
  }
  
  interface TransactionsResponse {
    transactions: Transaction[]
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  
  // State
  const analytics = ref<Analytics>({
    total_inflows: 0,
    total_outflows: 0,
    total_pending_transacations: 0,
    total_credit: 0,
    total_debit: 0
  })
  
  const page = ref(1)
  const pageSize = ref(10)
  const isModalOpen = ref(false)
  const selectedWalletId = ref<string | null>(null)
  
  // Modal states
  const isFlagModalOpen = ref(false)
  const isUnflagModalOpen = ref(false)
  const isApproveModalOpen = ref(false)
  const selectedTransaction = ref<Transaction | null>(null)
  const approvalComment = ref('')
  
  // Wallet status methods
  const getWalletStatusClass = (flagged: boolean) => {
    return flagged ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
  }
  
  // Flag wallet methods
  const openFlagWalletModal = (transaction: Transaction) => {
    selectedTransaction.value = transaction
    isFlagModalOpen.value = true
  }
  
  const closeFlagModal = () => {
    isFlagModalOpen.value = false
    selectedTransaction.value = null
  }
  
  const confirmFlagWallet = async () => {
    if (!selectedTransaction.value) return
  
    try {
      // In a real application, make an API call here
      console.log('Flagging wallet:', selectedTransaction.value.walletId)
      closeFlagModal()
    } catch (error) {
      console.error('Error flagging wallet:', error)
    }
  }
  
  // Unflag wallet methods
  const openUnflagWalletModal = (transaction: Transaction) => {
    selectedTransaction.value = transaction
    isUnflagModalOpen.value = true
  }
  
  const closeUnflagModal = () => {
    isUnflagModalOpen.value = false
    selectedTransaction.value = null
  }
  
  const confirmUnflagWallet = async () => {
    if (!selectedTransaction.value) return
  
    try {
      // In a real application, make an API call here
      console.log('Requesting unflag for wallet:', selectedTransaction.value.walletId)
      closeUnflagModal()
      // Optionally open approve modal for demo purposes
      openApproveModal(selectedTransaction.value)
    } catch (error) {
      console.error('Error requesting unflag:', error)
    }
  }
  
  // Approve/Reject methods
  const openApproveModal = (transaction: Transaction) => {
    selectedTransaction.value = transaction
    isApproveModalOpen.value = true
  }
  
  const closeApproveModal = () => {
    isApproveModalOpen.value = false
    selectedTransaction.value = null
    approvalComment.value = ''
  }
  
  const approveUnflag = async () => {
    if (!selectedTransaction.value) return
  
    try {
      // In a real application, make an API call here
      console.log('Approving unflag for wallet:', {
        walletId: selectedTransaction.value.walletId,
        comment: approvalComment.value
      })
      closeApproveModal()
    } catch (error) {
      console.error('Error approving unflag:', error)
    }
  }
  
  const rejectUnflag = async () => {
    if (!selectedTransaction.value) return
  
    try {
      // In a real application, make an API call here
      console.log('Rejecting unflag for wallet:', {
        walletId: selectedTransaction.value.walletId,
        comment: approvalComment.value
      })
      closeApproveModal()
    } catch (error) {
      console.error('Error rejecting unflag:', error)
    }
  }
  
  // Methods
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }
  
  const getStatusClass = (status: string) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    }
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
  }
  
  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/finance/analytics')
      const data = await response.json()
      if (data.status === 'success') {
        analytics.value = data.data
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }
  
  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/finance/transactions?page=${page.value}&pageSize=${pageSize.value}`)
      const data = await response.json()
      if (data.status === 'success') {
        transactions.value = data.data
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }
  
  const flagWallet = (id: string) => {
    selectedWalletId.value = id
    isModalOpen.value = true
  }
  
  const confirmFlagWalletOld = async () => {
    if (!selectedWalletId.value) return
  
    try {
      const response = await fetch(`/api/finance/wallet/${selectedWalletId.value}/flag`, {
        method: 'PATCH'
      })
      const data = await response.json()
      if (data.status === 'success') {
        await refreshTransactions()
      }
    } catch (error) {
      console.error('Error flagging wallet:', error)
    } finally {
      closeModal()
    }
  }
  
  const closeModal = () => {
    isModalOpen.value = false
    selectedWalletId.value = null
  }
  
  const prevPage = () => {
    if (page.value > 1) {
      page.value--
      fetchTransactions()
    }
  }
  
  const nextPage = () => {
    if (page.value < transactions.value.totalPages) {
      page.value++
      fetchTransactions()
    }
  }
  
  const refreshTransactions = () => {
    fetchTransactions()
    fetchAnalytics()
  }
  
  // Lifecycle
  onMounted(() => {
    fetchAnalytics()
    fetchTransactions()
  })

  definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth',
})
  </script>