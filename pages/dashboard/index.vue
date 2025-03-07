<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- Header with Date Filter and Notifications -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p class="mt-1 text-sm text-gray-500">
          Monitor key metrics and performance indicators
        </p>
      </div>

      <div class="flex items-center gap-4">
        <!-- Notifications -->
        <div class="relative">
          <div
            v-if="showNotifications"
            class="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border bg-white shadow-lg"
          >
            <div class="border-b p-4">
              <h3 class="font-medium">Notifications</h3>
            </div>
            <div class="max-h-96 overflow-y-auto">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="border-b p-4 hover:bg-gray-50"
              >
                <div class="flex items-start gap-3">
                  <div
                    :class="{
                      'bg-blue-100': notification.type === 'approval',
                      'bg-yellow-100': notification.type === 'overdue',
                      'bg-red-100': notification.type === 'alert'
                    }"
                    class="rounded-full p-2"
                  >
                    <component
                      :is="getNotificationIcon(notification.type)"
                      class="h-4 w-4"
                      :class="{
                        'text-blue-600': notification.type === 'approval',
                        'text-yellow-600': notification.type === 'overdue',
                        'text-red-600': notification.type === 'alert'
                      }"
                    />
                  </div>
                  <div>
                    <p class="font-medium">{{ notification.title }}</p>
                    <p class="mt-1 text-sm text-gray-600">
                      {{ notification.message }}
                    </p>
                    <p class="mt-1 text-xs text-gray-500">
                      {{ notification.time }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- 1. Active Investments Card -->
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Investments</p>
            <!-- Show skeleton loader when filtering -->
            <div v-if="fetchingActiveInvestments" class="mt-2 h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            <p v-else class="mt-2 text-2xl font-semibold">
              {{ activeInvestments || 0 }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <div class="rounded-full bg-green-100 p-2">
              <Wallet class="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <!-- Dropdown Filter (Moved to bottom) -->
        <div class="mt-4">
          <div class="relative w-full">
            <select
              v-model="activeInvestmentsFilter"
              @change="updateActiveInvestmentsFilter"
              class="w-full rounded-md border-[0.5px] border-gray-300 py-1.5 pl-3 pr-8 text-sm outline-none focus:border-primary focus:ring-primary"
            >
              <option value="YTD">Year to Date</option>
              <option value="MTD">Month to Date</option>
              <option value="WTD">Week to Date</option>
              <option value="Today">Today</option>
            </select>
            <!-- <svg  xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path></svg> -->
            <!-- <ChevronDown class="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /> -->
          </div>
        </div>
      </div>

      <!-- 2. Customer Base Card -->
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Customer Base</p>
            <!-- Show skeleton loader when filtering -->
            <div v-if="fetchingCustomerBse" class="mt-2 h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            <p v-else class="mt-2 text-2xl font-semibold">
              {{ customers || 0 }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <div class="rounded-full bg-blue-100 p-2">
              <Users class="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <!-- Dropdown Filter (Moved to bottom) -->
        <div class="mt-4">
          <div class="relative w-full">
            <select
              v-model="customerBaseFilter"
              @change="updateCustomerBaseFilter"
              class="w-full rounded-md border-[0.5px] border-gray-300 py-1.5 pl-3 pr-8 text-sm outline-none focus:border-primary focus:ring-primary"
            >
              <option value="YTD">Year to Date</option>
              <option value="MTD">Month to Date</option>
              <option value="WTD">Week to Date</option>
              <option value="Today">Today</option>
            </select>
            <!-- <svg class="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path></svg> -->
            <!-- <ChevronDown class="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /> -->
          </div>
        </div>
      </div>

      <!-- 3. Active Customers Card -->
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Customers</p>
            <!-- Show skeleton loader when filtering -->
            <div v-if="fetchingActiveCustomers" class="mt-2 h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            <p v-else class="mt-2 text-2xl font-semibold">
              {{ activeCustomers || 0 }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <div class="rounded-full bg-green-100 p-2">
              <UserCheck class="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <!-- Dropdown Filter (Moved to bottom) -->
        <div class="mt-4">
          <div class="relative w-full">
            <select
              v-model="activeCustomersFilter"
              @change="updateActiveCustomersFilter"
              class="w-full rounded-md border-[0.5px] border-gray-300 py-1.5 pl-3 pr-8 text-sm outline-none focus:border-primary focus:ring-primary"
            >
              <option value="YTD">Year to Date</option>
              <option value="MTD">Month to Date</option>
              <option value="WTD">Week to Date</option>
              <option value="Today">Today</option>
            </select>
            <!-- <svg class="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path></svg> -->
            <!-- <ChevronDown class="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /> -->
          </div>
        </div>
      </div>

      <!-- 4. Liquidated Investments Card -->
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Liquidated Investments</p>
            <!-- Show skeleton loader when filtering -->
            <div v-if="fetchingLiquidatedInvestments" class="mt-2 h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            <p v-else class="mt-2 text-2xl font-semibold">
              {{ liquidatedInvestments || 0 }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <div class="rounded-full bg-purple-100 p-2">
              <DollarSign class="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
        
        <!-- Dropdown Filter (Moved to bottom) -->
        <div class="mt-4">
          <div class="relative w-full">
            <select
              v-model="liquidatedInvestmentsFilter"
              @change="updateLiquidatedInvestmentsFilter"
              class="w-full rounded-md border-[0.5px] border-gray-300 py-1.5 pl-3 pr-8 text-sm outline-none focus:border-primary focus:ring-primary"
            >
              <option value="YTD">Year to Date</option>
              <option value="MTD">Month to Date</option>
              <option value="WTD">Week to Date</option>
              <option value="Today">Today</option>
            </select>
            <!-- <svg class="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path></svg> -->
            <!-- <ChevronDown class="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /> -->
          </div>
        </div>
      </div>

      <!-- 5. Pending Approval Investments Card -->
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Pending Approval</p>
            <!-- Show skeleton loader when filtering -->
            <div v-if="fetchingApprovalsList" class="mt-2 h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            <p v-else class="mt-2 text-2xl font-semibold">
              {{ pendingApprovalsList || 0 }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <div class="rounded-full bg-orange-100 p-2">
              <Clock class="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
        
        <!-- Dropdown Filter (Moved to bottom) -->
        <div class="mt-4">
          <div class="relative w-full">
            <select
              v-model="pendingApprovalFilter"
              @change="updatePendingApprovalFilter"
              class="w-full rounded-md border-[0.5px] border-gray-300 py-1.5 pl-3 pr-8 text-sm outline-none focus:border-primary focus:ring-primary"
            >
              <option value="YTD">Year to Date</option>
              <option value="MTD">Month to Date</option>
              <option value="WTD">Week to Date</option>
              <option value="Today">Today</option>
            </select>
            <!-- <svg class="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path></svg> -->
            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path></svg> -->
          </div>
        </div>
      </div>

    <!-- 6. Total Transactions Card -->
            <div class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Transactions</p>
            <!-- Show skeleton loader when filtering -->
            <div v-if="fetchingTotalTransactions" class="mt-2 h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            <p v-else class="mt-2 text-2xl font-semibold">
              {{ totalTransactions || 0 }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <div class="rounded-full bg-orange-100 p-2">
              <Clock class="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
        
        <!-- Dropdown Filter (Moved to bottom) -->
        <div class="mt-4">
          <div class="relative w-full">
            <select
              v-model="totalTransactionsFilter"
              @change="updateTotalTransactionsFilter"
              class="w-full rounded-md border-[0.5px] border-gray-300 py-1.5 pl-3 pr-8 text-sm outline-none focus:border-primary focus:ring-primary"
            >
              <option value="YTD">Year to Date</option>
              <option value="MTD">Month to Date</option>
              <option value="WTD">Week to Date</option>
              <option value="Today">Today</option>
            </select>
            <!-- <svg class="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path></svg> -->
            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path></svg> -->
          </div>
        </div>
      </div>


  <!-- 7. Total wallet balance Card -->
          <div class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Wallet Balance</p>
            <!-- Show skeleton loader when filtering -->
            <div v-if="fetchingTotalWalletBalance" class="mt-2 h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            <p v-else class="mt-2 text-2xl font-semibold">
              {{ totalWalletBalance || 0 }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <div class="rounded-full bg-orange-100 p-2">
              <Clock class="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
        
        <!-- Dropdown Filter (Moved to bottom) -->
        <div class="mt-4">
          <div class="relative w-full">
            <select
              v-model="totalWalletBalanceFilter"
              @change="updateTotalWalletBalanceFilter"
              class="w-full rounded-md border-[0.5px] border-gray-300 py-1.5 pl-3 pr-8 text-sm outline-none focus:border-primary focus:ring-primary"
            >
              <option value="YTD">Year to Date</option>
              <option value="MTD">Month to Date</option>
              <option value="WTD">Week to Date</option>
              <option value="Today">Today</option>
            </select>
            <!-- <svg class="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path></svg> -->
            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path></svg> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatCurrency } from '@/utils/currencyUtils'
import { useFetchCustomerBase } from '@/composables/modules/dashboard/useFetchCustomerBase'
import { useFetchInvestmentsPendingApprovals } from '@/composables/modules/dashboard/useFetchInvestmentsPendingApprovals'
import { useFetchActiveCustomers } from '@/composables/modules/dashboard/useGetActiveCustomers'
import { useFetchActiveInvestments } from '@/composables/modules/dashboard/useGetActiveInvestments'
import { useFetchLiquidatedInvestments } from '@/composables/modules/dashboard/useGetLiquidatedInvestments'
import { useFetchTotalWalletBalance } from '@/composables/modules/dashboard/useFetchTotalWalletBalance'
import { useFetchTotalTransactions } from '@/composables/modules/dashboard/useFetchTotalTransactions'
import {
  Users,
  UserCheck,
  Wallet,
  Clock,
  DollarSign,
  Bell,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  AlertTriangle,
  AlertCircle,
  CheckCircle
} from 'lucide-vue-next'

// Fetch data using composables
const { customers, loading: fetchingCustomerBse, filter: customerBaseFilter } = useFetchCustomerBase()
const { pendingApprovalsList, loading: fetchingApprovalsList, filter: pendingApprovalFilter } = useFetchInvestmentsPendingApprovals()
const { activeCustomers, loading: fetchingActiveCustomers, filter: activeCustomersFilter } = useFetchActiveCustomers()
const { activeInvestments, loading: fetchingActiveInvestments, filter: activeInvestmentsFilter } = useFetchActiveInvestments()
const { liquidatedInvestments, loading: fetchingLiquidatedInvestments, filter: liquidatedInvestmentsFilter } = useFetchLiquidatedInvestments()
const { totalWalletBalance, loading: fetchingTotalWalletBalance, filter: totalWalletBalanceFilter } = useFetchTotalWalletBalance()
const { totalTransactions, loading: fetchingTotalTransactions, filter: totalTransactionsFilter } = useFetchTotalTransactions()

// Notifications
const showNotifications = ref(false)
const notifications = ref([
  {
    id: 1,
    type: 'approval',
    title: 'New Investment Application',
    message: 'A new investment application requires your approval',
    time: '5 minutes ago',
  },
  {
    id: 2,
    type: 'overdue',
    title: 'Overdue Payment',
    message: 'Customer ABC123 has missed their payment deadline',
    time: '1 hour ago',
  },
  {
    id: 3,
    type: 'alert',
    title: 'System Alert',
    message: 'High number of failed login attempts detected',
    time: '2 hours ago',
  },
])

// Initialize filters with default values
onMounted(() => {
  // Set default timeframe to 'YTD' for all filters
  customerBaseFilter.value = 'YTD'
  pendingApprovalFilter.value = 'YTD'
  activeCustomersFilter.value = 'YTD'
  activeInvestmentsFilter.value = 'YTD'
  liquidatedInvestmentsFilter.value = 'YTD'
})

// Filter update methods
const updateCustomerBaseFilter = () => {
  customerBaseFilter.apply()
}

const updatePendingApprovalFilter = () => {
  pendingApprovalFilter.apply()
}

const updateActiveCustomersFilter = () => {
  activeCustomersFilter.apply()
}

const updateActiveInvestmentsFilter = () => {
  activeInvestmentsFilter.apply()
}

const updateLiquidatedInvestmentsFilter = () => {
  liquidatedInvestmentsFilter.apply()
}

const updateTotalWalletBalanceFilter = () => {
  totalWalletBalanceFilter.apply()
}

const updateTotalTransactionsFilter = () => {
  totalTransactionsFilter.apply()
}

// Helper methods
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'approval':
      return CheckCircle
    case 'overdue':
      return AlertTriangle
    case 'alert':
      return AlertCircle
    default:
      return Bell
  }
}

// Format number with commas
const formatNumber = (value: number): string => {
  return value.toLocaleString()
}

definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth'
})
</script>

<style scoped>
/* Add transition for smooth loading state changes */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Add transition for dropdown */
select {
  transition: all 0.2s ease;
}

select:hover {
  border-color: var(--color-primary);
}
</style>