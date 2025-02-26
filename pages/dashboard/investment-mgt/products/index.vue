<template>
    <div class="p-4 sm:p-6 lg:p-8">
      <!-- Metrics Cards -->
      <div class="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  
      <!-- Header -->
      <div class="mb-6 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Investment Products</h2>
          <p class="mt-1 text-sm text-gray-500">
            Manage your investment products and track their performance
          </p>
        </div>
        <button
          @click="showCreateModal = true"
          class="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 sm:mt-0"
        >
          <Plus class="mr-2 h-4 w-4" />
          New Product
        </button>
      </div>
  
      <!-- Filters -->
      <div class="mb-6 grid gap-4 rounded-lg border bg-white p-4 sm:flex sm:items-center">
        <div class="flex flex-1 gap-4">
          <div class="flex-1">
            <input
              v-model="search"
              type="text"
              placeholder="Search products..."
              class="w-full rounded-md border-gray-300 outline-none shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <select
            v-model="filters.status"
            class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
  
      <!-- Products Table -->
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
              <tr v-for="product in filteredProducts" :key="product.id">
                <td class="whitespace-nowrap px-6 py-4">
                  {{ product.name }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ formatCurrency(product.minInvestment) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ product?.interestRate || "Nil" }}
                </td>
                <!-- {{product}} -->
                <td class="whitespace-nowrap px-6 py-4">
                  {{ product?.minTenor || "Nil" }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ formatCurrency(product?.preLiquidationFee) || "Nil" }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    :class="{
                      'bg-green-100 text-green-800': product.status === 'active',
                      'bg-gray-100 text-gray-800': product.status === 'archived'
                    }"
                    class="rounded-full px-2 py-1 text-xs font-medium"
                  >
                    {{ product.status }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <NuxtLink
                      :to="`/investments/products/${product.id}/transactions`"
                      class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                      <History class="h-4 w-4" />
                    </NuxtLink>
                    <button
                      @click="editProduct(product)"
                      class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                      <Pencil class="h-4 w-4" />
                    </button>
                    <button
                      v-if="product.status === 'active'"
                      @click="archiveProduct(product)"
                      class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                      <Archive class="h-4 w-4" />
                    </button>
                    <button
                      @click="deleteProduct(product)"
                      class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                      <Trash class="h-4 w-4" />
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
              <span class="font-medium">{{ totalProducts }}</span>
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
  
      <!-- Create/Edit Modal -->
      <!-- <TransitionRoot appear :show="showCreateModal || !!editingProduct" as="template">
        <Dialog
          as="div"
          @close="closeModal"
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
                <DialogPanel class="w-full max-w-md w-[500px] mx-auto rounded-lg bg-white p-6">
                  <DialogTitle class="text-lg font-medium">
                    {{ editingProduct ? 'Edit Product' : 'New Product' }}
                  </DialogTitle>
                  <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Product Name
                      </label>
                      <input
                        v-model="form.name"
                        type="text"
                        required
                        class="mt-1 block w-full outline-none border-[0.5px] px-2 py- rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Minimum Amount
                      </label>
                      <input
                        v-model="form.minAmount"
                        type="number"
                        required
                        class="mt-1 block w-full outline-none border-[0.5px] px-2 py- rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Tenor (months)
                      </label>
                      <input
                        v-model="form.tenor"
                        type="number"
                        required
                        class="mt-1 block w-full outline-none border-[0.5px] px-2 py- rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Returns (%)
                      </label>
                      <input
                        v-model="form.returns"
                        type="number"
                        step="0.01"
                        required
                        class="mt-1 block w-full outline-none border-[0.5px] px-2 py- rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        v-model="form.description"
                        rows="3"
                        class="mt-1 block w-full outline-none border-[0.5px] px-2 py- rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      ></textarea>
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        @click="closeModal"
                        class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                      >
                        {{ editingProduct ? 'Update' : 'Create' }}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot> -->

      <CoreDrawer :showCreateModal="false" title="Create Investment" description="Please fill the form to create investment" @close="showCreateModal = false" :show="showCreateModal" >
     <template #content>
       <section class="p-3">
        <ModulesInvestmentCreateInvestmentProduct />
       </section>
     </template>
    </CoreDrawer>
  
      <!-- Archive Confirmation Modal -->
      <TransitionRoot appear :show="!!archivingProduct" as="template">
        <Dialog
          as="div"
          @close="archivingProduct = null"
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
                    Archive Product
                  </DialogTitle>
                  <p class="mt-2 text-sm text-gray-500">
                    Are you sure you want to archive this product? Current investors will not be affected.
                  </p>
                  <div class="mt-6 flex justify-end gap-3">
                    <button
                      @click="archivingProduct = null"
                      class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      @click="confirmArchive"
                      class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                    >
                      Archive
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
  import { useInvestment } from '@/composables/core/useReturnsCalculator'
  import { useFetchInvestmentProducts } from '@/composables/modules/investment-products/useFetchInvestmentProducts'
  const { loading,
    investmentProducts: products, metadata } = useFetchInvestmentProducts()
    const { calculateReturn } = useInvestment()
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
    Pencil,
    Archive,
    History,
    TrendingUp,
    TrendingDown,
    Wallet,
    Clock,
    AlertTriangle,
    Trash,
  } from 'lucide-vue-next'
  
  // Metrics
  const metrics = [
    {
      id: 1,
      title: 'Total Amount Invested',
      value: '$5.2M',
      icon: Wallet,
      trend: 12,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 2,
      title: 'Total Amount Matured',
      value: '$2.8M',
      icon: Clock,
      trend: 8,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      id: 3,
      title: 'Liquidation Requests',
      value: '$150K',
      icon: AlertTriangle,
      trend: -5,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
    },
  ]
  
  // Table configuration
  const tableHeaders = [
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'minAmount', label: 'Minimum Amount', sortable: true },
    { key: 'minTenor', label: 'Tenor', sortable: true },
    { key: 'interestRate', label: 'Interest Rate (%)', sortable: true },
    { key: 'preLiquidationFee', label: 'Pre Liquidation Fee', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ]
  
  // Dummy data
  // const products = ref([
  //   {
  //     id: 1,
  //     name: 'Fixed Income Plus',
  //     minAmount: 10000,
  //     tenor: 12,
  //     returns: 15,
  //     totalInvested: 1000000,
  //     status: 'active',
  //     description: 'High-yield fixed income investment product',
  //   },
  //   // Add more products...
  // ])
  
  // State
  const search = ref('')
  const filters = ref({
    status: '',
  })
  const sortKey = ref('name')
  const sortOrder = ref('asc')
  const currentPage = ref(1)
  const itemsPerPage = 10
  
  const showCreateModal = ref(false)
  const editingProduct = ref(null)
  const archivingProduct = ref(null)
  
  const form = ref({
    name: '',
    minAmount: '',
    tenor: '',
    returns: '',
    description: '',
  })
  
  // Computed
  const filteredProducts = computed(() => {
    let result = [...products.value]
  
    if (search.value) {
      const query = search.value.toLowerCase()
      result = result.filter(
        product => product.name.toLowerCase().includes(query)
      )
    }
  
    if (filters.value.status) {
      result = result.filter(
        product => product.status === filters.value.status
      )
    }
  
    result.sort((a: any, b: any) => {
      const modifier = sortOrder.value === 'asc' ? 1 : -1
      return a[sortKey.value] > b[sortKey.value] ? modifier : -modifier
    })
  
    return result
  })
  
  const totalProducts = computed(() => filteredProducts.value.length)
  const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage))
  const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
  const paginationEnd = computed(() =>
    Math.min(currentPage.value * itemsPerPage, totalProducts.value)
  )
  
  // Methods
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(value)
  }
  
  const sortBy = (key: string) => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortOrder.value = 'asc'
    }
  }
  
  const closeModal = () => {
    showCreateModal.value = false
    editingProduct.value = null
    form.value = {
      name: '',
      minAmount: '',
      tenor: '',
      returns: '',
      description: '',
    }
  }
  
  const editProduct = (product: any) => {
    editingProduct.value = product
    form.value = { ...product }
  }
  
  const archiveProduct = (product: any) => {
    archivingProduct.value = product
  }
  
  const confirmArchive = () => {
    if (archivingProduct.value) {
      const index = products.value.findIndex(p => p.id === archivingProduct.value.id)
      if (index !== -1) {
        products.value[index] = {
          ...products.value[index],
          status: 'archived',
        }
      }
      archivingProduct.value = null
    }
  }
  
  const handleSubmit = () => {
    if (editingProduct.value) {
      const index = products.value.findIndex(p => p.id === editingProduct.value.id)
      if (index !== -1) {
        products.value[index] = {
          ...editingProduct.value,
          ...form.value,
        }
      }
    } else {
      products.value.push({
        id: Date.now(),
        ...form.value,
        status: 'active',
        totalInvested: 0,
      })
    }
    closeModal()
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