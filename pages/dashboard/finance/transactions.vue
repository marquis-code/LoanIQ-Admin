<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-xl font-bold mb-6 text-start">Transactions</h1>
    <FinanceAnalytics />
    
    <!-- Filters Section -->
    <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
        <select v-model="filters.type" class="w-full outline-none text-sm border rounded-md p-3">
          <option value="">All Types</option>
          <option v-for="type in transactionTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select v-model="filters.status" class="w-full outline-none text-sm border rounded-md p-3">
          <option value="">All Statuses</option>
          <option v-for="status in transactionStatuses" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input type="date" v-model="filters.startDate" class="w-full outline-none text-sm border rounded-md p-3" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
        <input type="date" v-model="filters.endDate" class="w-full outline-none text-sm border rounded-md p-3" />
      </div>
    </div>
    <div class="flex flex-col sm:flex-row sm:justify-end gap-2 mb-6">
      <button @click="applyFilters" class="bg-[#2F6D67] text-white outline-none px-4 py-3 text-sm rounded-md hover:bg-blue-600 transition">
        Apply Filters
      </button>
      <button @click="resetFilters" class="bg-gray-300 text-gray-700 outline-none px-4 py-3 text-sm rounded-md hover:bg-gray-400 transition">
        Reset Filters
      </button>
    </div>

    <!-- Transactions Table -->
    <div class="bg-white border-[0.5px] border-gray-100 rounded-t-xl overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-100">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-4 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-4 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th class="px-4 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-4 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-4 py-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="hover:bg-gray-50">
            <td class="px-4 py-6 whitespace-nowrap text-sm">{{ transaction.id }}</td>
            <td class="px-4 py-6 whitespace-nowrap text-sm capitalize">{{ transaction.transactionType }}</td>
            <td class="px-4 py-6 whitespace-nowrap text-sm">{{ formatCurrency(transaction.amount) }}</td>
            <td class="px-4 py-6 whitespace-nowrap text-sm">
              <span :class="['px-4 inline-flex py-1.5 text-xs leading-5 font-semibold rounded-full', getStatusClass(transaction.status)]">
                {{ transaction.status }}
              </span>
            </td>
            <td class="px-4 py-2 whitespace-nowrap text-sm">{{ formatDate(transaction.createdAt) }}</td>
            <td class="px-4 py-2 whitespace-nowrap text-sm">
              <button @click="viewDetails(transaction)" class="text-blue-600 hover:text-blue-900 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </td>
          </tr>
          <tr v-if="filteredTransactions.length === 0">
            <td colspan="6" class="px-4 py-2 text-center text-gray-500">No transactions found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col sm:flex-row py-3 px-5 rounded-b-xl sm:justify-between items-center border border-gray-100">
      <p class="text-sm font-semibold text-gray-700">
        Showing {{ paginationStart }} to {{ paginationEnd }} of {{ totalTransactions }} results
      </p>
      <div class="flex gap-2 mt-2 sm:mt-0">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition"
        >
          Previous
        </button>
        <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Transaction Details Modal -->
    <transition name="fade">
      <div v-if="isDetailModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-b-2xl shadow-lg p-6 w-11/12 max-w-md">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Transaction Details</h2>
            <button @click="isDetailModalOpen = false" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
          </div>
          <div v-if="selectedTransaction">
            <p class="mb-2"><strong>ID:</strong> {{ selectedTransaction.id }}</p>
            <p class="mb-2"><strong>Type:</strong> {{ selectedTransaction.transactionType }}</p>
            <p class="mb-2"><strong>Amount:</strong> {{ formatCurrency(selectedTransaction.amount) }}</p>
            <p class="mb-2"><strong>Status:</strong> {{ selectedTransaction.status }}</p>
            <p class="mb-2"><strong>Date:</strong> {{ formatDate(selectedTransaction.createdAt) }}</p>
          </div>
       <div class="pt-6">
        <button @click="isDetailModalOpen = false" class="mt-4 w-full bg-[#2F6D67] text-white px-4 py-2 rounded-md  transition">
            Close
          </button>
       </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useFetchTransactions } from '@/composables/modules/finance-mgt/useFetchTransactions'
import { ref, computed } from 'vue'

interface Transaction {
  id: string
  transactionType: string
  amount: number
  status: string
  createdAt: string
  // additional fields from the API can be added here if needed
}

// Retrieve transaction data from the composable
const { transactions: transactionList, loading } = useFetchTransactions()

// // Fallback sample data if the composable returns no data
// if (!transactionList.value || transactionList.value.length === 0) {
//   transactionList.value = [
//     {
//       id: "0c17e1d1-1cf3-4829-a903-c8e15ade0243",
//       userId: "cf43f16a-e92a-418a-9ce2-881f34646a3c",
//       loanId: null,
//       investmentId: "f0695cd0-fe53-4f21-9a7c-ff2eb7da21d5",
//       reference: "2e1c13c7e702cc54833d2066108b559131747039",
//       amount: 200000,
//       charges: 0,
//       transactionType: "debit",
//       transactionChannel: "wallet",
//       transactionReason: "Investment Booking",
//       status: "pending",
//       serviceType: "investment",
//       createdAt: "2024-12-03T09:17:16.716Z",
//       updatedAt: "2024-12-03T09:17:16.716Z"
//     },
//     {
//       id: "fdc71ae4-6803-4ad2-b97c-522ae6c6c699",
//       userId: "cf43f16a-e92a-418a-9ce2-881f34646a3c",
//       loanId: null,
//       investmentId: "40cd8ac0-e9da-455d-bc92-94b1aa0ee6a1",
//       reference: "ea824227ec32b2227bcaca9de999d7d520d70dbc",
//       amount: 200,
//       charges: 0,
//       transactionType: "debit",
//       transactionChannel: "wallet",
//       transactionReason: "Investment Booking",
//       status: "pending",
//       serviceType: "investment",
//       createdAt: "2025-02-04T22:09:19.470Z",
//       updatedAt: "2025-02-04T22:09:19.471Z"
//     },
//     {
//       id: "60c004fc-f6c6-4f42-91c3-756684e7a0d1",
//       userId: "cf43f16a-e92a-418a-9ce2-881f34646a3c",
//       loanId: null,
//       investmentId: "4de813b2-1ea5-4f3b-999d-086a799c5c6f",
//       reference: "65de26e9908db3bb85ec22fb70b32b0b6f5ba49f",
//       amount: 200,
//       charges: 0,
//       transactionType: "debit",
//       transactionChannel: "wallet",
//       transactionReason: "Investment Booking",
//       status: "pending",
//       serviceType: "investment",
//       createdAt: "2025-02-04T22:43:00.717Z",
//       updatedAt: "2025-02-04T22:43:00.717Z"
//     }
//   ]
// }

const filters = ref({
  type: '',
  status: '',
  startDate: '',
  endDate: ''
})

const currentPage = ref(1)
const pageSize = 10

// Computed property to filter transactions based on selected filters
const filteredTransactions = computed(() => {
  return transactionList.value.filter((transaction: Transaction) => {
    const matchesType = filters.value.type ? transaction.transactionType === filters.value.type : true
    const matchesStatus = filters.value.status ? transaction.status === filters.value.status : true
    const transactionDate = new Date(transaction.createdAt).getTime()
    const matchesStartDate = filters.value.startDate ? transactionDate >= new Date(filters.value.startDate).getTime() : true
    const matchesEndDate = filters.value.endDate ? transactionDate <= new Date(filters.value.endDate).getTime() : true
    return matchesType && matchesStatus && matchesStartDate && matchesEndDate
  })
})

// Pagination computed properties based on filtered transactions
const totalTransactions = computed(() => filteredTransactions.value.length)
const totalPages = computed(() => Math.ceil(totalTransactions.value / pageSize))
const paginationStart = computed(() => (currentPage.value - 1) * pageSize + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize, totalTransactions.value))

// Compute transactions for the current page from the filtered list
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredTransactions.value.slice(start, start + pageSize)
})

const transactionTypes = [
  { label: 'Deposit', value: 'deposit' },
  { label: 'Withdrawal', value: 'withdrawal' },
  // Additional types can be added here
]

const transactionStatuses = [
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
  // Additional statuses can be added here
]

const isDetailModalOpen = ref(false)
const selectedTransaction = ref<Transaction | null>(null)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const applyFilters = () => {
  currentPage.value = 1 // Reset to first page when filters are applied
}

const resetFilters = () => {
  filters.value = {
    type: '',
    status: '',
    startDate: '',
    endDate: ''
  }
  currentPage.value = 1
}

const changePage = (page: number) => {
  currentPage.value = page
}

const viewDetails = (transaction: Transaction) => {
  selectedTransaction.value = transaction
  isDetailModalOpen.value = true
}

definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth',
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
