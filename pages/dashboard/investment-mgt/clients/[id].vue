<template>
    <div class="p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/dashboard/investment-mgt/clients"
            class="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft class="h-5 w-5" />
          </NuxtLink>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              Investment Details
            </h2>
            <p class="mt-1 text-sm text-gray-500">
              View and manage investment details
            </p>
          </div>
        </div>
      </div>
  
      <!-- Investment Overview -->
      <div class="mb-8 grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-6">
          <!-- Key Details -->
          <div class="rounded-lg border bg-white p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium">{{ investment.client }}</h3>
                <p class="text-sm text-gray-500">{{ investment.product }}</p>
              </div>
              <span
                :class="{
                  'bg-green-100 text-green-800': investment.status === 'active',
                  'bg-blue-100 text-blue-800': investment.status === 'matured',
                  'bg-red-100 text-red-800': investment.status === 'liquidated'
                }"
                class="rounded-full px-3 py-1 text-sm font-medium"
              >
                {{ investment.status }}
              </span>
            </div>
  
            <div class="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <p class="text-sm text-gray-500">Investment Amount</p>
                <p class="mt-1 text-lg font-medium">
                  {{ formatCurrency(investment.amount) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Returns Rate</p>
                <p class="mt-1 text-lg font-medium">{{ investment.returns }}%</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Expected Returns</p>
                <p class="mt-1 text-lg font-medium">
                  {{ formatCurrency(expectedReturns) }}
                </p>
              </div>
            </div>
  
            <div class="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <p class="text-sm text-gray-500">Start Date</p>
                <p class="mt-1 font-medium">
                  {{ formatDate(investment.startDate) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Maturity Date</p>
                <p class="mt-1 font-medium">
                  {{ formatDate(investment.maturityDate) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Time Remaining</p>
                <p class="mt-1 font-medium">{{ timeRemaining }}</p>
              </div>
            </div>
  
            <div class="mt-6">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium">Investment Progress</p>
                <p class="text-sm text-gray-500">{{ progressPercentage }}%</p>
              </div>
              <div class="mt-2 h-2 w-full rounded-full bg-gray-100">
                <div
                  class="h-2 rounded-full bg-primary"
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>
            </div>
          </div>
  
          <!-- Performance Chart -->
          <div class="rounded-lg border bg-white p-6">
            <div class="flex items-center justify-between">
              <h3 class="font-medium">Performance</h3>
              <select
                v-model="chartPeriod"
                class="rounded-md border-gray-300 text-sm shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="1M">1M</option>
                <option value="3M">3M</option>
                <option value="6M">6M</option>
                <option value="1Y">1Y</option>
                <option value="ALL">All</option>
              </select>
            </div>
            <div class="mt-4 h-[300px]">
              <!-- Chart placeholder - implement with your preferred charting library -->
              <div class="flex h-full items-center justify-center rounded border border-dashed">
                <p class="text-sm text-gray-500">Performance chart will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Actions & Documents -->
        <div class="space-y-6">
          <!-- Actions -->
          <div class="rounded-lg border bg-white p-6">
            <h3 class="font-medium">Actions</h3>
            <div class="mt-4 space-y-3">
              <button
                v-if="investment.status === 'active'"
                @click="showTopUpModal = true"
                class="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                <PlusCircle class="h-4 w-4" />
                Top Up Investment
              </button>
              <button
                v-if="investment.status === 'active'"
                @click="showLiquidationModal = true"
                class="flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Ban class="h-4 w-4" />
                Request Liquidation
              </button>
              <button
                class="flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FileText class="h-4 w-4" />
                Download Statement
              </button>
            </div>
          </div>
  
          <!-- Documents -->
          <div class="rounded-lg border bg-white p-6">
            <h3 class="font-medium">Documents</h3>
            <div class="mt-4 space-y-3">
              <div
                v-for="document in documents"
                :key="document.id"
                class="flex items-center justify-between rounded-lg border p-3"
              >
                <div class="flex items-center gap-3">
                  <FileText class="h-5 w-5 text-gray-400" />
                  <div>
                    <p class="text-sm font-medium">{{ document.name }}</p>
                    <p class="text-xs text-gray-500">{{ document.date }}</p>
                  </div>
                </div>
                <button
                  class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <Download class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Transaction History -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-medium">Transaction History</h3>
          <div class="flex items-center gap-4">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                v-model="transactionSearch"
                type="text"
                placeholder="Search transactions..."
                class="pl-9 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <select
              v-model="transactionType"
              class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="">All Types</option>
              <option value="investment">Investment</option>
              <option value="top-up">Top Up</option>
              <option value="returns">Returns</option>
            </select>
          </div>
        </div>
  
        <div class="rounded-lg border bg-white">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="header in transactionHeaders"
                    :key="header.key"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    {{ header.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="transaction in filteredTransactions" :key="transaction.id">
                  <td class="whitespace-nowrap px-6 py-4 text-sm">
                    {{ formatDate(transaction.date) }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <span
                      :class="{
                        'bg-green-100 text-green-800': transaction.type === 'investment' || transaction.type === 'top-up',
                        'bg-blue-100 text-blue-800': transaction.type === 'returns'
                      }"
                      class="rounded-full px-2 py-1 text-xs font-medium"
                    >
                      {{ transaction.type }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm">
                    {{ transaction.description }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm">
                    {{ formatCurrency(transaction.amount) }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm">
                    {{ transaction.reference }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Pagination -->
          <div class="flex items-center justify-between border-t px-6 py-3">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ paginationStart }}</span>
                to
                <span class="font-medium">{{ paginationEnd }}</span>
                of
                <span class="font-medium">{{ totalTransactions }}</span>
                results
              </span>
            </div>
  
            <div class="flex items-center gap-2">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Top Up Modal -->
      <TransitionRoot appear :show="showTopUpModal" as="template">
        <Dialog
          as="div"
          @close="showTopUpModal = false"
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
                <DialogPanel class="w-full max-w-md rounded-lg bg-white p-6">
                  <DialogTitle class="text-lg font-medium">
                    Top Up Investment
                  </DialogTitle>
                  <form @submit.prevent="handleTopUp" class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Current Amount
                      </label>
                      <p class="mt-1 text-lg font-medium">
                        {{ formatCurrency(investment.amount) }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Top Up Amount
                      </label>
                      <input
                        v-model="topUpForm.amount"
                        type="number"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        @click="showTopUpModal = false"
                        class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                      >
                        Confirm Top Up
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
  
      <!-- Liquidation Modal -->
      <TransitionRoot appear :show="showLiquidationModal" as="template">
        <Dialog
          as="div"
          @close="showLiquidationModal = false"
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
                <DialogPanel class="w-full max-w-md rounded-lg bg-white p-6">
                  <DialogTitle class="text-lg font-medium">
                    Liquidate Investment
                  </DialogTitle>
                  <div class="mt-4 space-y-4">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to liquidate this investment? This action cannot be undone.
                    </p>
                    <div class="rounded-lg bg-gray-50 p-4">
                      <div class="space-y-2">
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Investment Amount:</span>
                          <span class="font-medium">{{ formatCurrency(investment.amount) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Early Liquidation Fee:</span>
                          <span class="font-medium text-red-600">{{ formatCurrency(liquidationFee) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Net Amount:</span>
                          <span class="font-medium">{{ formatCurrency(liquidationAmount) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        @click="showLiquidationModal = false"
                        class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        @click="handleLiquidation"
                        class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Confirm Liquidation
                      </button>
                    </div>
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
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
  } from '@headlessui/vue'
  import {
    ArrowLeft,
    PlusCircle,
    Ban,
    FileText,
    Download,
    Search,
  } from 'lucide-vue-next'
  
  // Dummy investment data
  const investment = ref({
    id: 1,
    client: 'John Doe',
    product: 'Fixed Income Plus',
    amount: 50000,
    returns: 15,
    startDate: '2024-01-01',
    maturityDate: '2024-12-31',
    status: 'active',
  })
  
  // Documents
  const documents = ref([
    {
      id: 1,
      name: 'Investment Agreement',
      date: '2024-01-01',
    },
    {
      id: 2,
      name: 'Latest Statement',
      date: '2024-02-01',
    },
    {
      id: 3,
      name: 'Returns Certificate',
      date: '2024-02-15',
    },
  ])
  
  // Transaction configuration
  const transactionHeaders = [
    { key: 'date', label: 'Date' },
    { key: 'type', label: 'Type' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount' },
    { key: 'reference', label: 'Reference' },
  ]
  
  // Dummy transactions
  const transactions = ref([
    {
      id: 1,
      date: '2024-01-01',
      type: 'investment',
      description: 'Initial Investment',
      amount: 50000,
      reference: 'INV001',
    },
    {
      id: 2,
      date: '2024-02-01',
      type: 'returns',
      description: 'Monthly Returns',
      amount: 625,
      reference: 'RET001',
    },
    // Add more transactions...
  ])
  
  // State
  const chartPeriod = ref('3M')
  const showTopUpModal = ref(false)
  const showLiquidationModal = ref(false)
  const transactionSearch = ref('')
  const transactionType = ref('')
  const currentPage = ref(1)
  const itemsPerPage = 10
  
  const topUpForm = ref({
    amount: '',
  })
  
  // Computed
  const expectedReturns = computed(() => {
    return (investment.value.amount * investment.value.returns * getDurationInYears()) / 100
  })
  
  const timeRemaining = computed(() => {
    const now = new Date()
    const maturity = new Date(investment.value.maturityDate)
    const months = (maturity.getFullYear() - now.getFullYear()) * 12 +
      (maturity.getMonth() - now.getMonth())
    return `${months} months`
  })
  
  const progressPercentage = computed(() => {
    const start = new Date(investment.value.startDate)
    const end = new Date(investment.value.maturityDate)
    const now = new Date()
    const total = end.getTime() - start.getTime()
    const current = now.getTime() - start.getTime()
    return Math.min(Math.round((current / total) * 100), 100)
  })
  
  const liquidationFee = computed(() => {
    return investment.value.amount * 0.05 // 5% liquidation fee
  })
  
  const liquidationAmount = computed(() => {
    return investment.value.amount - liquidationFee.value
  })
  
  const filteredTransactions = computed(() => {
    let result = [...transactions.value]
  
    if (transactionSearch.value) {
      const query = transactionSearch.value.toLowerCase()
      result = result.filter(
        transaction =>
          transaction.description.toLowerCase().includes(query) ||
          transaction.reference.toLowerCase().includes(query)
      )
    }
  
    if (transactionType.value) {
      result = result.filter(
        transaction => transaction.type === transactionType.value
      )
    }
  
    return result
  })
  
  const totalTransactions = computed(() => filteredTransactions.value.length)
  const totalPages = computed(() => Math.ceil(totalTransactions.value / itemsPerPage))
  const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
  const paginationEnd = computed(() =>
    Math.min(currentPage.value * itemsPerPage, totalTransactions.value)
  )
  
  // Methods
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }
  
  const getDurationInYears = () => {
    const start = new Date(investment.value.startDate)
    const end = new Date(investment.value.maturityDate)
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)
  }
  
  const handleTopUp = () => {
    investment.value.amount += Number(topUpForm.value.amount)
    
    // Add transaction
    transactions.value.push({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'top-up',
      description: 'Investment Top Up',
      amount: Number(topUpForm.value.amount),
      reference: `TOP${Date.now()}`,
    })
  
    showTopUpModal.value = false
    topUpForm.value.amount = ''
  }
  
  const handleLiquidation = () => {
    investment.value.status = 'liquidated'
    
    // Add transaction
    transactions.value.push({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: 'liquidation',
      description: 'Investment Liquidation',
      amount: -liquidationAmount.value,
      reference: `LIQ${Date.now()}`,
    })
  
    showLiquidationModal.value = false
  }
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  definePageMeta({
          layout: 'admin-dashboard',
           middleware: 'auth'
      })
  </script>