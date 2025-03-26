<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-xl font-bold mb-8">Wallet Management</h1>

    <!-- Loading State -->
    <div v-if="fetchingWallets" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!walletList || walletList.length === 0" class="bg-white p-8 rounded-lg shadow-md text-center animate-fadeIn">
      <div class="flex justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
          <path d="M22 10H18a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h4"></path>
        </svg>
      </div>
      <h2 class="text-xl font-semibold mb-2">No Wallets Found</h2>
      <p class="text-gray-500 mb-4">There are no wallets available at the moment.</p>
    </div>

    <!-- Wallet List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      <div 
        v-for="wallet in walletList" 
        :key="wallet.id" 
        class="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-base font-bold">{{ wallet.accountName }}</h2>
            <p class="text-gray-500">{{ wallet.bankName }}</p>
          </div>
          <span 
            :class="wallet.flagStatus ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'" 
            class="px-3 py-1 text-xs font-medium rounded-full"
          >
            {{ wallet.flagStatus ? 'Flagged' : 'Active' }}
          </span>
        </div>
        
        <div class="mb-4">
          <p class="text-sm font-medium text-gray-500">Account Number</p>
          <p class="text-base font-semibold">{{ wallet.accountNumber }}</p>
        </div>
        
        <div class="mb-4">
          <p class="text-sm font-medium text-gray-500">Balance</p>
          <p class="text-2xl font-bold">₦{{ formatAmount(wallet.amount || 0) }}</p>
        </div>
        
        <div class="mb-4">
          <p class="text-sm font-medium text-gray-500">Ledger Balance</p>
          <p class="text-base font-semibold">₦{{ formatAmount(wallet.ledgerBalance || 0) }}</p>
        </div>
        
        <div class="flex justify-between items-center mt-6">
          <p class="text-xs text-gray-500">Created: {{ formatDate(wallet.createdAt) }}</p>
          <button 
            @click="viewWalletTransactions(wallet)" 
            class="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors duration-200 text-sm font-medium"
          >
            View Transactions
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Transactions Side Drawer -->
    <transition name="drawer-backdrop">
      <div 
        v-if="isDrawerOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="closeDrawer"
      ></div>
    </transition>
    
    <transition name="drawer">
      <div 
        v-if="isDrawerOpen"
        class="fixed top-0 right-0 h-full bg-white shadow-xl z-50 overflow-auto"
        :style="{ width: isMobile ? '100%' : '550px' }"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Wallet Transactions</h2>
            <button 
              @click="closeDrawer" 
              class="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div v-if="selectedWallet" class="mb-6 p-5 bg-gray-50 rounded-lg animate-fadeIn">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-lg font-bold">{{ selectedWallet.accountName }}</h3>
                <p class="text-gray-500">{{ selectedWallet.bankName }}</p>
              </div>
              <span 
                :class="selectedWallet.flagStatus ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'" 
                class="px-3 py-1 text-xs font-medium rounded-full"
              >
                {{ selectedWallet.flagStatus ? 'Flagged' : 'Active' }}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Account Number</p>
                <p class="text-base font-semibold">{{ selectedWallet.accountNumber }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Balance</p>
                <p class="text-lg font-bold">₦{{ formatAmount(selectedWallet.amount || 0) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-12 animate-fadeIn">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="!transactions || transactions.length === 0" class="text-center py-8 animate-fadeIn">
            <div class="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <h3 class="text-lg font-medium mb-2">No Transactions Found</h3>
            <p class="text-gray-500">This wallet doesn't have any transactions yet.</p>
          </div>
          
          <!-- Transactions Table -->
          <div v-else class="animate-fadeIn">
            <div class="mb-4 relative">
              <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  v-model="transactionSearch" 
                  type="text" 
                  placeholder="Search transactions..." 
                  class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div class="overflow-hidden rounded-lg border border-gray-200">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr 
                      v-for="(transaction, index) in paginatedTransactions" 
                      :key="transaction.id"
                      class="hover:bg-gray-50 transition-all duration-200"
                      :class="{'animate-slideUp': true}"
                      :style="{ animationDelay: `${index * 50}ms` }"
                    >
                      <td class="px-4 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div :class="getTransactionTypeColor(transaction.type)" class="p-2 rounded-full mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline v-if="transaction.type === 'credit'" points="16 3 21 8 16 13"></polyline>
                              <polyline v-if="transaction.type === 'credit'" points="21 8 3 8"></polyline>
                              <polyline v-if="transaction.type === 'debit'" points="8 3 3 8 8 13"></polyline>
                              <polyline v-if="transaction.type === 'debit'" points="3 8 21 8"></polyline>
                            </svg>
                          </div>
                          <span class="font-medium">{{ formatTransactionType(transaction.type) }}</span>
                        </div>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap">
                        <span :class="transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'" class="font-medium">
                          {{ transaction.type === 'credit' ? '+' : '-' }} ₦{{ formatAmount(transaction.amount || 0) }}
                        </span>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap">
                        <span :class="getStatusClass(transaction.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                          {{ transaction.status || 'Unknown' }}
                        </span>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(transaction.createdAt) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Pagination -->
              <div class="bg-white border-t border-gray-200 px-4 py-3 sm:px-6">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div class="text-sm text-gray-700">
                    Showing <span class="font-medium">{{ startIndex + 1 }}</span> to <span class="font-medium">{{ Math.min(endIndex, filteredTransactions.length) }}</span> of <span class="font-medium">{{ filteredTransactions.length }}</span> transactions
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      @click="currentPage > 1 ? currentPage-- : null"
                      :disabled="currentPage === 1"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div class="hidden md:flex">
                      <span v-for="page in displayedPages" :key="page" class="mx-1">
                        <button 
                          v-if="page !== '...'"
                          @click="currentPage = page" 
                          :class="currentPage === page ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                          class="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors duration-200"
                        >
                          {{ page }}
                        </button>
                        <span v-else class="px-2 py-2 text-gray-500">...</span>
                      </span>
                    </div>
                    <button 
                      @click="currentPage < totalPages ? currentPage++ : null"
                      :disabled="currentPage === totalPages"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useFetchWallets } from '@/composables/modules/users/useFetchWallets'
import { useGetTransactions } from "@/composables/modules/users/useFetchTransactions"

// Composables
const { walletList, loading: fetchingWallets } = useFetchWallets()
const { transactions, loading, getTransactions } = useGetTransactions()

// UI state
const isDrawerOpen = ref(false)
const selectedWallet = ref(null)
const isMobile = ref(false)
const transactionSearch = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// Initialize mobile check
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Format amount with 2 decimal places
const formatAmount = (amount) => {
  return parseFloat(amount || 0).toFixed(2)
}

// Format date to a readable format
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get CSS class for transaction status
const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  
  switch (status.toLowerCase()) {
    case 'completed':
    case 'success': 
      return 'bg-green-100 text-green-800'
    case 'pending': 
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
    case 'declined': 
      return 'bg-red-100 text-red-800'
    default: 
      return 'bg-gray-100 text-gray-800'
  }
}

// Get CSS class for transaction type icon background
const getTransactionTypeColor = (type) => {
  if (!type) return 'bg-gray-100 text-gray-600'
  
  switch (type?.toLowerCase()) {
    case 'credit': 
      return 'bg-green-100 text-green-600'
    case 'debit': 
      return 'bg-red-100 text-red-600'
    default: 
      return 'bg-gray-100 text-gray-600'
  }
}

// Format transaction type for display
const formatTransactionType = (type) => {
  if (!type) return 'Unknown'
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
}

// View wallet transactions
const viewWalletTransactions = async (wallet) => {
  selectedWallet.value = wallet
  isDrawerOpen.value = true
  currentPage.value = 1
  transactionSearch.value = ''
  
  // Fetch transactions for this wallet
  if (wallet && wallet.id) {
    await getTransactions(wallet.userId)
  }
}

// Close the drawer
const closeDrawer = () => {
  isDrawerOpen.value = false
}

// Filter transactions based on search
const filteredTransactions = computed(() => {
  if (!transactions.value) return []
  
  let filtered = [...transactions.value]
  
  // Apply search filter
  if (transactionSearch.value) {
    const searchTerm = transactionSearch.value.toLowerCase()
    filtered = filtered.filter(transaction => 
      (transaction.type && transaction.type.toLowerCase().includes(searchTerm)) ||
      (transaction.status && transaction.status.toLowerCase().includes(searchTerm)) ||
      (transaction.amount && transaction.amount.toString().includes(searchTerm)) ||
      (transaction.reference && transaction.reference.toLowerCase().includes(searchTerm))
    )
  }
  
  return filtered
})

// Pagination calculations
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)

// Get paginated transactions
const paginatedTransactions = computed(() => {
  return filteredTransactions.value.slice(startIndex.value, endIndex.value)
})

// Calculate total pages for pagination
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredTransactions.value.length / itemsPerPage))
})

// Generate array of page numbers to display
const displayedPages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  
  if (totalPages.value <= maxVisiblePages) {
    // Show all pages if there are few
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    // Calculate start and end of visible pages
    let start = Math.max(2, currentPage.value - 1)
    let end = Math.min(totalPages.value - 1, currentPage.value + 1)
    
    // Adjust if at the beginning
    if (currentPage.value <= 3) {
      end = Math.min(totalPages.value - 1, 4)
    }
    
    // Adjust if at the end
    if (currentPage.value >= totalPages.value - 2) {
      start = Math.max(2, totalPages.value - 3)
    }
    
    // Add ellipsis if needed
    if (start > 2) {
      pages.push('...')
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Add ellipsis if needed
    if (end < totalPages.value - 1) {
      pages.push('...')
    }
    
    // Always show last page
    if (totalPages.value > 1) {
      pages.push(totalPages.value)
    }
  }
  
  return pages
})

// Reset page when search changes
watch(transactionSearch, () => {
  currentPage.value = 1
})

definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth',
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.4s ease-in-out forwards;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out forwards;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Drawer animations */
.drawer-enter-active {
  animation: slideInRight 0.3s ease-out forwards;
}

.drawer-leave-active {
  animation: slideOutRight 0.2s ease-in forwards;
}

.drawer-backdrop-enter-active {
  animation: fadeIn 0.3s ease-out forwards;
}

.drawer-backdrop-leave-active {
  animation: fadeOut 0.2s ease-in forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive improvements */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>