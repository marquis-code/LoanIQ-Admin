<template>
    <div class="p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/investments/products"
            class="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft class="h-5 w-5" />
          </NuxtLink>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              {{ product.name }} - Transaction History
            </h2>
            <p class="mt-1 text-sm text-gray-500">
              View all transactions for this investment product
            </p>
          </div>
        </div>
      </div>
  
      <!-- Product Info -->
      <div class="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-lg border bg-white p-4">
          <p class="text-sm font-medium text-gray-600">Total Invested</p>
          <p class="mt-2 text-2xl font-semibold">
            {{ formatCurrency(product.totalInvested) }}
          </p>
        </div>
        <div class="rounded-lg border bg-white p-4">
          <p class="text-sm font-medium text-gray-600">Active Investors</p>
          <p class="mt-2 text-2xl font-semibold">{{ product.activeInvestors }}</p>
        </div>
        <div class="rounded-lg border bg-white p-4">
          <p class="text-sm font-medium text-gray-600">Returns</p>
          <p class="mt-2 text-2xl font-semibold">{{ product.returns }}%</p>
        </div>
        <div class="rounded-lg border bg-white p-4">
          <p class="text-sm font-medium text-gray-600">Tenor</p>
          <p class="mt-2 text-2xl font-semibold">{{ product.tenor }} months</p>
        </div>
      </div>
  
      <!-- Filters -->
      <div class="mb-6 grid gap-4 rounded-lg border bg-white p-4 sm:flex sm:items-center">
        <div class="flex flex-1 gap-4">
          <div class="flex-1">
            <input
              v-model="search"
              type="text"
              placeholder="Search transactions..."
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <select
            v-model="filters.type"
            class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="">All Types</option>
            <option value="investment">Investment</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="maturity">Maturity</option>
          </select>
          <div class="flex items-center gap-2">
            <input
              v-model="filters.dateFrom"
              type="date"
              class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
            <span class="text-gray-500">to</span>
            <input
              v-model="filters.dateTo"
              type="date"
              class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        </div>
      </div>
  
      <!-- Transactions Table -->
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
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="transaction in filteredTransactions" :key="transaction.id">
                <td class="whitespace-nowrap px-6 py-4">
                  {{ transaction.id }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ transaction.investor }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ formatCurrency(transaction.amount) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    :class="{
                      'bg-green-100 text-green-800': transaction.type === 'investment',
                      'bg-red-100 text-red-800': transaction.type === 'withdrawal',
                      'bg-blue-100 text-blue-800': transaction.type === 'maturity'
                    }"
                    class="rounded-full px-2 py-1 text-xs font-medium"
                  >
                    {{ transaction.type }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ formatDate(transaction.date) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
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
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { ArrowLeft, ArrowUpDown } from 'lucide-vue-next'
  
  // Dummy product data
  const product = ref({
    id: 1,
    name: 'Fixed Income Plus',
    totalInvested: 1000000,
    activeInvestors: 50,
    returns: 15,
    tenor: 12,
  })
  
  // Table configuration
  const tableHeaders = [
    { key: 'id', label: 'Transaction ID', sortable: true },
    { key: 'investor', label: 'Investor', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'reference', label: 'Reference', sortable: true },
  ]
  
  // Dummy transactions data
  const transactions = ref([
    {
      id: 'TRX001',
      investor: 'John Doe',
      amount: 50000,
      type: 'investment',
      date: '2024-02-25',
      reference: 'INV-001',
    },
    {
      id: 'TRX002',
      investor: 'Jane Smith',
      amount: 25000,
      type: 'withdrawal',
      date: '2024-02-24',
      reference: 'WTH-001',
    },
    // Add more transactions...
  ])
  
  // State
  const search = ref('')
  const filters = ref({
    type: '',
    dateFrom: '',
    dateTo: '',
  })
  const sortKey = ref('date')
  const sortOrder = ref('desc')
  const currentPage = ref(1)
  const itemsPerPage = 10

  const filteredTransactions = computed(() => {
  let result = [...transactions.value]

  if (search.value) {
    const query = search.value.toLowerCase()
    result = result.filter(
      transaction =>
        transaction.investor.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query) ||
        transaction.reference.toLowerCase().includes(query)
    )
  }

  if (filters.value.type) {
    result = result.filter(
      transaction => transaction.type === filters.value.type
    )
  }

  if (filters.value.dateFrom) {
    result = result.filter(
      transaction => transaction.date >= filters.value.dateFrom
    )
  }

  if (filters.value.dateTo) {
    result = result.filter(
      transaction => transaction.date <= filters.value.dateTo
    )
  }

  result.sort((a, b) => {
    const modifier = sortOrder.value === 'asc' ? 1 : -1
    return a[sortKey.value] > b[sortKey.value] ? modifier : -modifier
  })

  return result
})
  
  // Computed
  // const filteredTransactions = computed(() => {
  //   let result = [...transactions.value]
  
  //   if (search.value) {
  //     const query = search.value.toLowerCase()
  //     result = result.filter(
  //       transaction =>
  //         transaction.investor.toLowerCase().includes(query) ||
  //         transaction.id.toLowerCase().includes(query) ||
  //         transaction.reference.toLowerCase().includes(query)
  //     )
  //   }
  
  //   if (filters.value.type) {
  //     result = result.filter(
  //       transaction => transaction.type === filters.value.type
  //     )
  //   }
  
  //   if (filters.value.dateFrom) {
  //     result = result.filter(
  //       transaction => transaction.date >= filters.value.dateFrom
  //     )
  //   }
  
  //   if (filters.value.dateTo) {
  //     result = result.filter(
  //       transaction => transaction.date <= filters.value.dateTo
  //       {
  //     result = result.filter(
  //       transaction => transaction.date <= filters.value.dateTo
  //     )
  //   }
  
  //   result.sort((a: any, b: any) => {
  //     const modifier = sortOrder.value === 'asc' ? 1 : -1
  //     return a[sortKey.value] > b[sortKey.value] ? modifier : -modifier
  //   })
  
  //   return result
  // })
  
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
  
  const sortBy = (key: string) => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortOrder.value = 'asc'
    }
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