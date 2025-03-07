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

    <!-- Loading State -->
    <div v-if="loading || fetchingInvestmentSummary" class="flex justify-center py-10">
      <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>

    <div v-else>
      <!-- Investment Overview -->
      <div class="mb-8 grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-6">
          <!-- Key Details -->
          <div class="rounded-lg border bg-white p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium">{{ investmentDetails?.name }}</h3>
                <p class="text-sm text-gray-500">{{ investmentDetails?.productName }}</p>
              </div>
              <span
                :class="{
                  'bg-green-100 text-green-800': investmentDetails?.status === 'active',
                  'bg-blue-100 text-blue-800': investmentDetails?.status === 'matured',
                  'bg-red-100 text-red-800': investmentDetails?.status === 'liquidated'
                }"
                class="rounded-full px-3 py-1 text-sm font-medium capitalize"
              >
                {{ investmentDetails?.status }}
              </span>
            </div>

            <div class="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <p class="text-sm text-gray-500">Investment Amount</p>
                <p class="mt-1 text-lg font-medium">
                  {{ formatCurrency(parseFloat(investmentDetails?.amount)) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Returns Rate</p>
                <p class="mt-1 text-lg font-medium">{{ investmentDetails?.returnOnInvestment }}%</p>
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
                  {{ formatDate(investmentDetails?.startDate) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Maturity Date</p>
                <p class="mt-1 font-medium">
                  {{ formatDate(investmentDetails?.maturityDate) }}
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

          <!-- Additional Investment Details -->
          <div class="rounded-lg border bg-white p-6">
            <h3 class="font-medium mb-4">Investment Information</h3>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-sm text-gray-500">Tenor (Days)</p>
                <p class="mt-1 font-medium">{{ investmentDetails?.tenor }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Days to Maturity</p>
                <p class="mt-1 font-medium">{{ investmentDetails?.daysToMaturity }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Interest Accrued</p>
                <p class="mt-1 font-medium">{{ formatCurrency(parseFloat(investmentDetails?.interestAccrued)) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Withholding Tax</p>
                <p class="mt-1 font-medium">{{ formatCurrency(parseFloat(investmentDetails?.withholdingTax)) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Interest Payment Schedule</p>
                <p class="mt-1 font-medium">{{ investmentDetails?.interestPaymentSchedule }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Automated Frequency</p>
                <p class="mt-1 font-medium">{{ investmentDetails?.automatedFrequency }}</p>
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

        <div class="space-y-6">
          <!-- Investor Information -->
          <div class="rounded-lg border bg-white p-6">
            <h3 class="font-medium mb-4">Investor Information</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-500">Name</p>
                <p class="mt-1 font-medium">{{ investmentDetails?.user?.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Email</p>
                <p class="mt-1 font-medium">{{ investmentDetails?.user?.email }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Phone Number</p>
                <p class="mt-1 font-medium">{{ investmentDetails?.user?.phoneNumber }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Gender</p>
                <p class="mt-1 font-medium">{{ investmentDetails?.user?.gender }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">BVN</p>
                <p class="mt-1 font-medium">{{ investmentDetails?.user?.bvn }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Address</p>
                <p class="mt-1 font-medium">{{ investmentDetails?.user?.residentialAddress }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="rounded-lg border bg-white p-6">
            <h3 class="font-medium">Actions</h3>
            <div class="mt-4 space-y-3">
              <button
                v-if="investmentDetails?.status === 'active'"
                @click="showTopUpModal = true"
                class="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                <PlusCircle class="h-4 w-4" />
                Top Up Investment
              </button>
              <button
                v-if="investmentDetails?.status === 'active'"
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
              <button
                class="flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Mail class="h-4 w-4" />
                Contact Investor
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
                    <p class="text-sm font-medium">{{ document?.name }}</p>
                    <p class="text-xs text-gray-500">{{ document?.date }}</p>
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
              <option value="liquidation">Liquidation</option>
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
                <tr v-if="filteredTransactions.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found
                  </td>
                </tr>
                <tr v-for="transaction in paginatedTransactions" :key="transaction.id">
                  <td class="whitespace-nowrap px-6 py-4 text-sm">
                    {{ formatDate(transaction.date) }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <span
                      :class="{
                        'bg-green-100 text-green-800': transaction.type === 'investment' || transaction.type === 'top-up',
                        'bg-blue-100 text-blue-800': transaction.type === 'returns',
                        'bg-red-100 text-red-800': transaction.type === 'liquidation'
                      }"
                      class="rounded-full px-2 py-1 text-xs font-medium"
                    >
                      {{ transaction?.type }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm">
                    {{ transaction?.description }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm">
                    {{ formatCurrency(transaction?.amount) }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm">
                    {{ transaction?.reference }}
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
              <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] rounded-xl mx-auto lg:w-[500px] max-w-[5200px]  bg-white p-6">
                <DialogTitle class="text-lg font-medium">
                  Top Up Investment
                </DialogTitle>
                <form @submit.prevent="handleTopUp" class="mt-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Current Amount
                    </label>
                    <p class="mt-1 text-lg font-medium">
                      {{ formatCurrency(parseFloat(investmentDetails?.amount)) }}
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
                      min="1"
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
              <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] rounded-xl mx-auto lg:w-[500px] max-w-[5200px]  bg-white p-6">
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
                        <span class="font-medium">{{ formatCurrency(parseFloat(investmentDetails?.amount)) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-500">Preliquidation Charge:</span>
                        <span class="font-medium text-red-600">{{ formatCurrency(parseFloat(investmentDetails?.preliquidionCharge) || liquidationFee) }}</span>
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
import { ref, computed, watch } from 'vue'
import { useInvestmentSummary } from '@/composables/modules/investments/useInvestmentSummary'
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
  Mail,
} from 'lucide-vue-next'

// Get investment data from composables
const {
  investmentSummary: investmentDetails,
  loading: fetchingInvestmentSummary,
} = useInvestmentSummary()

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

// Transactions - will be populated based on investment data
const transactions = ref<any[]>([])

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
  const amount = parseFloat(investmentDetails?.value?.amount)
  const returnRate = parseFloat(investmentDetails?.value?.returnOnInvestment)
  const durationInYears = investmentDetails?.value?.tenor / 365
  return (amount * returnRate * durationInYears) / 100
})

const timeRemaining = computed(() => {
  if (!investmentDetails?.value?.maturityDate) return "N/A"
  
  const now = new Date()
  const maturity = new Date(investmentDetails?.value?.maturityDate)
  
  if (now > maturity) return "Matured"
  
  const daysLeft = Math.ceil((maturity.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return `${daysLeft} days`
})

const progressPercentage = computed(() => {
  if (!investmentDetails?.value?.startDate || !investmentDetails?.value?.maturityDate) return 0
  
  const start = new Date(investmentDetails?.value?.startDate)
  const end = new Date(investmentDetails?.value?.maturityDate)
  const now = new Date()
  
  if (now > end) return 100
  
  const total = end.getTime() - start.getTime()
  const current = now.getTime() - start.getTime()
  return Math.max(0, Math.min(Math.round((current / total) * 100), 100))
})

const liquidationFee = computed(() => {
  const amount = parseFloat(investmentDetails?.value?.amount)
  return amount * 0.05 // 5% liquidation fee if not specified
})

const liquidationAmount = computed(() => {
  const amount = parseFloat(investmentDetails?.value?.amount)
  const fee = parseFloat(investmentDetails?.value?.preliquidionCharge) || liquidationFee?.value
  return amount - fee
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
const totalPages = computed(() => Math.max(1, Math.ceil(totalTransactions.value / itemsPerPage)))
const paginationStart = computed(() => totalTransactions.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1)
const paginationEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage, totalTransactions.value)
)

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTransactions.value.slice(start, end)
})

// Methods
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(value)
}

const formatDate = (date: string) => {
  if (!date) return "N/A"
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleTopUp = () => {
  const topUpAmount = Number(topUpForm.value.amount)
  const currentAmount = parseFloat(investmentDetails?.value?.amount)
  
  // Update investment amount
  investmentDetails.value.amount = (currentAmount + topUpAmount).toString()
  
  // Add transaction
  transactions.value.push({
    id: Date.now(),
    date: new Date().toISOString(),
    type: 'top-up',
    description: 'Investment Top Up',
    amount: topUpAmount,
    reference: `TOP${Date.now()}`,
  })

  showTopUpModal.value = false
  topUpForm.value.amount = ''
}

const handleLiquidation = () => {
  investmentDetails.value.status = 'liquidated'
  
  // Add transaction
  transactions.value.push({
    id: Date.now(),
    date: new Date().toISOString(),
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

// Add a watcher to initialize transactions when investment data is loaded
watch([investmentDetails], ([details]) => {
  if (details && details.startDate) {
    // Initialize with initial investment transaction
    transactions.value = [
      {
        id: 1,
        date: details.startDate,
        type: 'investment',
        description: 'Initial Investment',
        amount: parseFloat(details.amount),
        reference: `INV${Date.now()}`,
      }
    ]
  }
}, { immediate: true })

definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth'
})
</script>