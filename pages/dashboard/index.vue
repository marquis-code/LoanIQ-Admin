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

      <!-- {{ dashboardAnalytics }} -->
      <div class="flex items-center gap-4">
        <!-- Date Range Filter -->
        <div class="relative">
          <select
            v-model="selectedDateRange"
            class="rounded-md border-gray-300 pr-8 focus:border-primary focus:ring-primary"
          >
            <option value="all">All Time</option>
            <option value="ytd">Year to Date</option>
            <option value="mtd">Month to Date</option>
            <option value="wtd">Week to Date</option>
            <option value="today">Today</option>
          </select>
        </div>

        <!-- Notifications -->
        <div class="relative">
          <button
            @click="showNotifications = !showNotifications"
            class="relative rounded-full p-2 hover:bg-gray-100"
          >
            <Bell class="h-6 w-6 text-gray-600" />
            <span
              v-if="notifications.length > 0"
              class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
            >
              {{ notifications.length }}
            </span>
          </button>

          <!-- Notifications Dropdown -->
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

    <!-- Quick Actions -->
    <div class="mb-6 grid gap-4 sm:grid-cols-3">
      <NuxtLink
        v-for="action in quickActions"
        :key="action.id"
        :to="action.link"
        class="flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
      >
        <div
          class="rounded-full p-2"
          :class="action.bgColor"
        >
          <component
            :is="action.icon"
            class="h-5 w-5"
            :class="action.iconColor"
          />
        </div>
        <div>
          <h3 class="font-medium">{{ action.title }}</h3>
          <p class="text-sm text-gray-600">{{ action.count }} pending</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Metrics Grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <button
        v-for="metric in metrics"
        :key="metric.id"
        @click="showMetricDetails(metric)"
        class="rounded-lg border bg-white p-6 text-left shadow-sm transition-all hover:shadow-md"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">{{ metric.title }}</p>
            <p class="mt-2 text-2xl font-semibold">{{ metric.value }}</p>
          </div>
          <div
            class="rounded-full p-2"
            :class="metric.bgColor"
          >
            <component
              :is="metric.icon"
              class="h-5 w-5"
              :class="metric.iconColor"
            />
          </div>
        </div>
        <div class="mt-4 flex items-center gap-2">
          <div
            class="flex items-center"
            :class="metric.trend > 0 ? 'text-green-600' : 'text-red-600'"
          >
            <component
              :is="metric.trend > 0 ? TrendingUp : TrendingDown"
              class="h-4 w-4"
            />
            <span class="ml-1 text-sm">
              {{ Math.abs(metric.trend) }}%
            </span>
          </div>
          <span class="text-sm text-gray-500">vs last period</span>
        </div>
      </button>
    </div>

    <!-- Metric Details Modal -->
    <TransitionRoot appear :show="!!selectedMetric" as="template">
      <Dialog
        as="div"
        @close="selectedMetric = null"
        class="relative z-50"
      >
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-4xl rounded-lg bg-white p-6">
                <div class="mb-4 flex items-center justify-between">
                  <DialogTitle class="text-lg font-medium">
                    {{ selectedMetric?.title }} Details
                  </DialogTitle>
                  <button
                    @click="selectedMetric = null"
                    class="rounded-full p-2 hover:bg-gray-100"
                  >
                    <X class="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          v-for="header in getTableHeaders(selectedMetric?.type)"
                          :key="header"
                          class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          {{ header }}
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                      <tr
                        v-for="item in getTableData(selectedMetric?.type)"
                        :key="item.id"
                      >
                        <td
                          v-for="(value, key) in item"
                          :key="key"
                          class="whitespace-nowrap px-6 py-4"
                        >
                          <template v-if="key === 'status'">
                            <span
                              :class="{
                                'bg-green-100 text-green-800': value === 'active',
                                'bg-red-100 text-red-800': value === 'inactive',
                                'bg-yellow-100 text-yellow-800': value === 'pending'
                              }"
                              class="rounded-full px-2 py-1 text-xs font-medium"
                            >
                              {{ value }}
                            </span>
                          </template>
                          <template v-else>
                            {{ value }}
                          </template>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
import {  useFetchDashboardAnalytics } from '@/composables/modules/dashboard/useFetchDashboardAnalytics'
import { useFetchCustomerBase } from '@/composables/modules/dashboard/useFetchCustomerBase'
import { useFetchInvestmentsPendingApprovals } from '@/composables/modules/dashboard/useFetchInvestmentsPendingApprovals'
import { useFetchActiveCustomers } from '@/composables/modules/dashboard/useGetActiveCustomers'
import { useFetchActiveInvestments } from  '@/composables/modules/dashboard/useGetActiveInvestments'
import { useFetchLiquidatedInvestments } from '@/composables/modules/dashboard/useGetLiquidatedInvestments'
const { dashboardAnalytics, loading } = useFetchDashboardAnalytics()
const { customers, loading: fetchingCustomerBse } = useFetchCustomerBase()
const { pendingApprovalsList, loading: fetchingApprovalsList } = useFetchInvestmentsPendingApprovals()
const { activeCustomers, loading: fetchingActiveCustomers } = useFetchActiveCustomers()
const { activeInvestments, loading: fetchingActiveInvestments } = useFetchActiveInvestments()
const { liquidatedInvestments, loading: fetchingLiquidatedInvestments } = useFetchLiquidatedInvestments()
import { ref } from 'vue'
import {
  Users,
  UserCheck,
  UserX,
  Wallet,
  Clock,
  CheckCircle,
  DollarSign,
  AlertTriangle,
  Bell,
  FileCheck,
  TrendingUp,
  TrendingDown,
  X,
  AlertCircle,
} from 'lucide-vue-next'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

// Date range filter
const selectedDateRange = ref('all')

// Notifications
const showNotifications = ref(false)
const notifications = ref([
  {
    id: 1,
    type: 'approval',
    title: 'New Loan Application',
    message: 'A new loan application requires your approval',
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

// Quick actions
const quickActions = [
  {
    id: 1,
    title: 'Pending Loans',
    count: 12,
    icon: FileCheck,
    link: '/loans/pending',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 2,
    title: 'Assigned Tasks',
    count: 5,
    icon: CheckCircle,
    link: '/tasks',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 3,
    title: 'Investment Approvals',
    count: 8,
    icon: DollarSign,
    link: '/investments/pending',
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
]

// Metrics
const metrics = ref([
  {
    id: 1,
    title: 'Total Customer Base',
    value: dashboardAnalytics?.value?.totalUsrs ?? 0,
    icon: Users,
    trend: 12,
    type: 'customers',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 2,
    title: 'Total Transactions',
    value: dashboardAnalytics?.value?.totalTransactions ?? 0,
    icon: UserCheck,
    trend: 8,
    type: 'customers',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 3,
    title: 'Total Savings',
    value: dashboardAnalytics?.value?.totalSavings ?? 0,
    icon: UserX,
    trend: -5,
    type: 'customers',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    id: 4,
    title: 'Liquidated Investments',
    value: dashboardAnalytics?.value?.liquidatedInvestment ?? 0,
    icon: Wallet,
    trend: 15,
    type: 'investments',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 5,
    title: 'Total Wallet Balance',
    value: dashboardAnalytics?.value?.totalWalletBalance ?? 0,
    icon: Clock,
    trend: 3,
    type: 'investments',
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    id: 6,
    title: 'Active Investments',
    value: dashboardAnalytics?.value?.activeInvestments ?? 0,
    icon: CheckCircle,
    trend: 10,
    type: 'investments',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 7,
    title: 'Loans Disbursed',
    value: dashboardAnalytics?.value?.totalLoans ?? 0,
    icon: DollarSign,
    trend: 7,
    type: 'loans',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 8,
    title: 'Pending Approvals',
    value: dashboardAnalytics?.value?.pendingApprovalInvestment ?? 0,
    icon: Clock,
    trend: -2,
    type: 'approvals',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    id: 9,
    title: 'Overdue Accounts',
    value: '23',
    icon: AlertTriangle,
    trend: -8,
    type: 'overdue',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
  },
])

// Selected metric for modal
const selectedMetric = ref(null)

// Methods
const showMetricDetails = (metric: any) => {
  selectedMetric.value = metric
}

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

const getTableHeaders = (type: string) => {
  switch (type) {
    case 'customers':
      return ['ID', 'Name', 'Email', 'Status', 'Join Date']
    case 'investments':
      return ['ID', 'Amount', 'Type', 'Status', 'Maturity Date']
    case 'loans':
      return ['ID', 'Customer', 'Amount', 'Status', 'Due Date']
    case 'approvals':
      return ['ID', 'Type', 'Customer', 'Amount', 'Status']
    case 'overdue':
      return ['ID', 'Customer', 'Type', 'Amount', 'Days Overdue']
    default:
      return []
  }
}

const getTableData = (type: string) => {
  // Dummy data for each type
  switch (type) {
    case 'customers':
      return [
        {
          id: 'CST001',
          name: 'John Doe',
          email: 'john@example.com',
          status: 'active',
          joinDate: '2024-01-15',
        },
        {
          id: 'CST002',
          name: 'Jane Smith',
          email: 'jane@example.com',
          status: 'inactive',
          joinDate: '2023-11-20',
        },
      ]
    case 'investments':
      return [
        {
          id: 'INV001',
          amount: '$50,000',
          type: 'Fixed Deposit',
          status: 'active',
          maturityDate: '2024-12-31',
        },
        {
          id: 'INV002',
          amount: '$25,000',
          type: 'Mutual Fund',
          status: 'pending',
          maturityDate: '2024-06-30',
        },
      ]
    case 'loans':
      return [
        {
          id: 'LN001',
          customer: 'John Doe',
          amount: '$10,000',
          status: 'active',
          dueDate: '2024-08-15',
        },
        {
          id: 'LN002',
          customer: 'Jane Smith',
          amount: '$5,000',
          status: 'pending',
          dueDate: '2024-07-01',
        },
      ]
    default:
      return []
  }
}

definePageMeta({
    layout: 'admin-dashboard',
    middleware: 'auth'
})
</script>