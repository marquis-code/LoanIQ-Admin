<template>
    <div class="p-4 sm:p-6 lg:p-8">
      <!-- Metrics Cards -->
      <div class="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="metric in metrics"
          :key="metric.id"
          class="rounded-lg border bg-white p-6 shadow-sm"
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
            <span class="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
      </div>
  
      <!-- Actions -->
      <div class="mb-6 flex flex-wrap gap-4">
        <button
          @click="showBookingModal = true"
          class="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus class="mr-2 h-4 w-4" />
          Book Investment
        </button>
        <button
          @click="showCalculator = true"
          class="inline-flex items-center rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Calculator class="mr-2 h-4 w-4" />
          Investment Calculator
        </button>
      </div>
  
      <!-- Active Investments Table -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Active Investments</h2>
          <div class="flex items-center gap-4">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                v-model="search"
                type="text"
                placeholder="Search investments..."
                class="pl-9 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <select
              v-model="filters.status"
              class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="matured">Matured</option>
              <option value="liquidated">Liquidated</option>
            </select>
          </div>
        </div>
  
        <div class="rounded-lg border bg-white shadow-sm">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="header in tableHeaders"
                    :key="header.key"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    <div class="flex items-center gap-2">
                      {{ header.label }}
                      <button
                        v-if="header.sortable"
                        @click="sortBy(header.key)"
                        class="text-gray-400 hover:text-gray-600"
                      >
                        <ArrowUpDown class="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="investment in filteredInvestments" :key="investment.id">
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ investment.client }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ investment.product }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ formatCurrency(investment.amount) }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ investment.returns }}%
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ formatDate(investment.startDate) }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ formatDate(investment.maturityDate) }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <span
                      :class="{
                        'bg-green-100 text-green-800': investment.status === 'active',
                        'bg-blue-100 text-blue-800': investment.status === 'matured',
                        'bg-red-100 text-red-800': investment.status === 'liquidated'
                      }"
                      class="rounded-full px-2 py-1 text-xs font-medium"
                    >
                      {{ investment.status }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <NuxtLink
                        :to="`/dashboard/investment-mgt/clients/${investment.id}`"
                        class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                        title="View Details"
                      >
                        <Eye class="h-4 w-4" />
                      </NuxtLink>
                      <button
                        v-if="investment.status === 'active'"
                        @click="showTopUpModal(investment)"
                        class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                        title="Top Up"
                      >
                        <PlusCircle class="h-4 w-4" />
                      </button>
                      <button
                        v-if="investment.status === 'active'"
                        @click="showLiquidationModal(investment)"
                        class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                        title="Liquidate"
                      >
                        <Ban class="h-4 w-4" />
                      </button>
                    </div>
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
                <span class="font-medium">{{ totalInvestments }}</span>
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
  
      <!-- Investment Calculator Modal -->
      <TransitionRoot appear :show="showCalculator" as="template">
        <Dialog
          as="div"
          @close="showCalculator = false"
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
                    Investment Calculator
                  </DialogTitle>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Investment Amount
                      </label>
                      <input
                        v-model="calculator.amount"
                        type="number"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Annual Return Rate (%)
                      </label>
                      <input
                        v-model="calculator.returns"
                        type="number"
                        step="0.01"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Investment Period (months)
                      </label>
                      <input
                        v-model="calculator.tenor"
                        type="number"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
  
                    <div class="rounded-lg bg-gray-50 p-4">
                      <h4 class="text-sm font-medium text-gray-900">Results</h4>
                      <div class="mt-3 space-y-2">
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Total Returns:</span>
                          <span class="font-medium">{{ formatCurrency(calculatedReturns) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Maturity Amount:</span>
                          <span class="font-medium">{{ formatCurrency(calculatedMaturityAmount) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Monthly Returns:</span>
                          <span class="font-medium">{{ formatCurrency(calculatedMonthlyReturns) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
  
      <!-- Investment Booking Modal -->
      <TransitionRoot appear :show="showBookingModal" as="template">
        <Dialog
          as="div"
          @close="showBookingModal = false"
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
                    Book New Investment
                  </DialogTitle>
                  <form @submit.prevent="handleBooking" class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Client Name
                      </label>
                      <input
                        v-model="bookingForm.client"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Investment Product
                      </label>
                      <select
                        v-model="bookingForm.productId"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      >
                        <option value="">Select a product</option>
                        <option
                          v-for="product in availableProducts"
                          :key="product.id"
                          :value="product.id"
                        >
                          {{ product.name }} ({{ product.returns }}% - {{ product.tenor }} months)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Investment Amount
                      </label>
                      <input
                        v-model="bookingForm.amount"
                        type="number"
                        required
                        :min="selectedProduct?.minAmount"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                      <p
                        v-if="selectedProduct"
                        class="mt-1 text-xs text-gray-500"
                      >
                        Minimum amount: {{ formatCurrency(selectedProduct.minAmount) }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                        v-model="bookingForm.startDate"
                        type="date"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
  
                    <div
                      v-if="selectedProduct"
                      class="rounded-lg bg-gray-50 p-4"
                    >
                      <h4 class="text-sm font-medium text-gray-900">Investment Summary</h4>
                      <div class="mt-3 space-y-2">
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Returns Rate:</span>
                          <span class="font-medium">{{ selectedProduct.returns }}%</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Tenor:</span>
                          <span class="font-medium">{{ selectedProduct.tenor }} months</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Maturity Date:</span>
                          <span class="font-medium">{{ calculateMaturityDate(bookingForm.startDate, selectedProduct.tenor) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Expected Returns:</span>
                          <span class="font-medium">{{ formatCurrency(calculateReturns(bookingForm.amount, selectedProduct.returns, selectedProduct.tenor)) }}</span>
                        </div>
                      </div>
                    </div>
  
                    <div class="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        @click="showBookingModal = false"
                        class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                      >
                        Book Investment
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
  
      <!-- Top Up Modal -->
      <TransitionRoot appear :show="!!topUpInvestment" as="template">
        <Dialog
          as="div"
          @close="topUpInvestment = null"
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
                        {{ formatCurrency(topUpInvestment?.amount) }}
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
                        @click="topUpInvestment = null"
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
      <TransitionRoot appear :show="!!liquidatingInvestment" as="template">
        <Dialog
          as="div"
          @close="liquidatingInvestment = null"
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
                          <span class="font-medium">{{ formatCurrency(liquidatingInvestment?.amount) }}</span>
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
                        @click="liquidatingInvestment = null"
                        class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        @click="confirmLiquidation"
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
    Plus,
    ArrowUpDown,
    Calculator,
    Search,
    Eye,
    PlusCircle,
    Ban,
    TrendingUp,
    TrendingDown,
    Users,
    Wallet,
    ArrowUpRight,
    AlertTriangle,
  } from 'lucide-vue-next'
  
  // Metrics
  const metrics = [
    {
      id: 1,
      title: 'Total Active Investments',
      value: '$8.2M',
      icon: Wallet,
      trend: 15,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 2,
      title: 'Active Clients',
      value: '324',
      icon: Users,
      trend: 8,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      id: 3,
      title: 'Average Returns',
      value: '15.2%',
      icon: ArrowUpRight,
      trend: 5,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      id: 4,
      title: 'Pending Liquidations',
      value: '12',
      icon: AlertTriangle,
      trend: -2,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
    },
  ]
  
  // Available Products
  const availableProducts = ref([
    {
      id: 1,
      name: 'Fixed Income Plus',
      returns: 15,
      tenor: 12,
      minAmount: 10000,
    },
    {
      id: 2,
      name: 'High Yield Fund',
      returns: 18,
      tenor: 24,
      minAmount: 25000,
    },
    // Add more products...
  ])
  
  // Table configuration
  const tableHeaders = [
    { key: 'client', label: 'Client', sortable: true },
    { key: 'product', label: 'Product', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'returns', label: 'Returns', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'maturityDate', label: 'Maturity Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ]
  
  // Dummy investments data
  const investments = ref([
    {
      id: 1,
      client: 'John Doe',
      product: 'Fixed Income Plus',
      amount: 50000,
      returns: 15,
      startDate: '2024-01-01',
      maturityDate: '2024-12-31',
      status: 'active',
    },
    // Add more investments...
  ])
  
  // State
  const search = ref('')
  const filters = ref({
    status: '',
  })
  const sortKey = ref('startDate')
  const sortOrder = ref('desc')
  const currentPage = ref(1)
  const itemsPerPage = 10
  
  const showCalculator = ref(false)
  const showBookingModal = ref(false)
  const topUpInvestment = ref(null)
  const liquidatingInvestment = ref(null)
  
  // Forms
  const calculator = ref({
    amount: '',
    returns: '',
    tenor: '',
  })
  
  const bookingForm = ref({
    client: '',
    productId: '',
    amount: '',
    startDate: '',
  })
  
  const topUpForm = ref({
    amount: '',
  })
  
  // Computed
  const selectedProduct = computed(() => {
    return availableProducts.value.find(p => p.id === bookingForm.value.productId)
  })
  
  const filteredInvestments = computed(() => {
    let result = [...investments.value]
  
    if (search.value) {
      const query = search.value.toLowerCase()
      result = result.filter(
        investment =>
          investment.client.toLowerCase().includes(query) ||
          investment.product.toLowerCase().includes(query)
      )
    }
  
    if (filters.value.status) {
      result = result.filter(
        investment => investment.status === filters.value.status
      )
    }
  
    result.sort((a: any, b: any) => {
      const modifier = sortOrder.value === 'asc' ? 1 : -1
      return a[sortKey.value] > b[sortKey.value] ? modifier : -modifier
    })
  
    return result
  })
  
  const totalInvestments = computed(() => filteredInvestments.value.length)
  const totalPages = computed(() => Math.ceil(totalInvestments.value / itemsPerPage))
  const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
  const paginationEnd = computed(() =>
    Math.min(currentPage.value * itemsPerPage, totalInvestments.value)
  )
  
  // Calculator computed
  const calculatedReturns = computed(() => {
    if (!calculator.value.amount || !calculator.value.returns || !calculator.value.tenor) {
      return 0
    }
    return (
      Number(calculator.value.amount) *
      (Number(calculator.value.returns) / 100) *
      (Number(calculator.value.tenor) / 12)
    )
  })
  
  const calculatedMaturityAmount = computed(() => {
    return Number(calculator.value.amount) + calculatedReturns.value
  })
  
  const calculatedMonthlyReturns = computed(() => {
    return calculatedReturns.value / Number(calculator.value.tenor)
  })
  
  // Liquidation computed
  const liquidationFee = computed(() => {
    if (!liquidatingInvestment.value) return 0
    return liquidatingInvestment.value.amount * 0.05 // 5% liquidation fee
  })
  
  const liquidationAmount = computed(() => {
    if (!liquidatingInvestment.value) return 0
    return liquidatingInvestment.value.amount - liquidationFee.value
  })
  
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
  
  const sortBy = (key: string) => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortOrder.value = 'asc'
    }
  }
  
  const calculateMaturityDate = (startDate: string, tenor: number) => {
    if (!startDate) return ''
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + tenor)
    return date.toLocaleDateString()
  }
  
  const calculateReturns = (amount: number, returns: number, tenor: number) => {
    return amount * (returns / 100) * (tenor / 12)
  }
  
  const showTopUpModal = (investment: any) => {
    topUpInvestment.value = investment
    topUpForm.value.amount = ''
  }
  
  const showLiquidationModal = (investment: any) => {
    liquidatingInvestment.value = investment
  }
  
  const handleBooking = () => {
    if (!selectedProduct.value) return
  
    const investment = {
      id: Date.now(),
      client: bookingForm.value.client,
      product: selectedProduct.value.name,
      amount: Number(bookingForm.value.amount),
      returns: selectedProduct.value.returns,
      startDate: bookingForm.value.startDate,
      maturityDate: calculateMaturityDate(bookingForm.value.startDate, selectedProduct.value.tenor),
      status: 'active',
    }
  
    investments.value.push(investment)
    showBookingModal.value = false
    bookingForm.value = {
      client: '',
      productId: '',
      amount: '',
      startDate: '',
    }
  }
  
  const handleTopUp = () => {
    if (!topUpInvestment.value) return
  
    const index = investments.value.findIndex(i => i.id === topUpInvestment.value.id)
    if (index !== -1) {
      investments.value[index] = {
        ...investments.value[index],
        amount: investments.value[index].amount + Number(topUpForm.value.amount),
      }
    }
  
    topUpInvestment.value = null
  }
  
  const confirmLiquidation = () => {
    if (!liquidatingInvestment.value) return
  
    const index = investments.value.findIndex(i => i.id === liquidatingInvestment.value.id)
    if (index !== -1) {
      investments.value[index] = {
        ...investments.value[index],
        status: 'liquidated',
      }
    }
  
    liquidatingInvestment.value = null
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