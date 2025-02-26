<template>
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-6 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Company Portfolio</h2>
          <p class="mt-1 text-sm text-gray-500">
            Manage investments with third parties
          </p>
        </div>
        <button
          @click="showCreateModal = true"
          class="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 sm:mt-0"
        >
          <Plus class="mr-2 h-4 w-4" />
          Add Investment
        </button>
      </div>
  
      <!-- Table -->
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
              <tr v-for="investment in sortedInvestments" :key="investment.id">
                <td class="whitespace-nowrap px-6 py-4">
                  {{ investment?.company }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ formatCurrency(investment?.amount) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ investment?.tenor }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <!-- {{ investment?.returns }}% -->
                  {{ calculateReturn(investment)}}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ formatDate(investment?.startDate) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  {{ formatDate(investment?.endDate) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    :class="{
                      'bg-green-100 text-green-800': getDaysUntilDue(investment?.endDate) > 30,
                      'bg-yellow-100 text-yellow-800': getDaysUntilDue(investment?.endDate) <= 30 && getDaysUntilDue(investment?.endDate) > 0,
                      'bg-red-100 text-red-800': getDaysUntilDue(investment?.endDate) <= 0
                    }"
                    class="rounded-full px-2 py-1 text-xs font-medium"
                  >
                    {{ getDaysUntilDue(investment?.endDate) }} days
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right">
                  <div class="flex justify-end gap-2">
                    <button
                      @click="editInvestment(investment)"
                      class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                      <Pencil class="h-4 w-4" />
                    </button>
                    <button
                      @click="deleteInvestment(investment)"
                      class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Create/Edit Modal -->
      <TransitionRoot appear :show="showCreateModal || !!editingInvestment" as="template">
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
                <DialogPanel class="w-full max-w-md rounded-lg bg-white p-6">
                  <DialogTitle class="text-lg font-medium">
                    {{ editingInvestment ? 'Edit Investment' : 'New Investment' }}
                  </DialogTitle>
                  <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Third Party Name
                      </label>
                      <input
                        v-model="form.thirdParty"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Amount
                      </label>
                      <input
                        v-model="form.amount"
                        type="number"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                        v-model="form.startDate"
                        type="date"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Comment
                      </label>
                      <textarea
                        v-model="form.comment"
                        rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
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
                        {{ editingInvestment ? 'Update' : 'Create' }}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
  
      <!-- Delete Confirmation Modal -->
      <TransitionRoot appear :show="!!deletingInvestment" as="template">
        <Dialog
          as="div"
          @close="deletingInvestment = null"
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
                    Delete Investment
                  </DialogTitle>
                  <p class="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete this investment? This action cannot be undone.
                  </p>
                  <div class="mt-6 flex justify-end gap-3">
                    <button
                      @click="deletingInvestment = null"
                      class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      @click="confirmDelete"
                      class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete
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
  import { useInvestment  } from '@/composables/core/useReturnsCalculator'
  import { useFetchExternalInvestments } from '@/composables/modules/finance-mgt/useGetExternalInvestments'
  import { ref, computed } from 'vue'
  const { calculateReturn } = useInvestment()
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
    Trash2,
  } from 'lucide-vue-next'
  const { externalInvestments: investments, loading } = useFetchExternalInvestments()
  
  // Table configuration
  const tableHeaders = [
    { key: 'thirdParty', label: 'Third Party', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'tenor', label: 'Tenor', sortable: true },
    { key: 'returns', label: 'Returns', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'endDate', label: 'Due Date', sortable: true },
    { key: 'daysUntilDue', label: 'Days Until Due', sortable: true },
  ]
  
  // // Dummy data
  // const investments = ref([
  //   {
  //     id: 1,
  //     thirdParty: 'Investment Corp',
  //     amount: 1000000,
  //     tenor: 12,
  //     returns: 15,
  //     startDate: '2024-01-01',
  //     endDate: '2024-12-31',
  //     comment: 'Annual investment plan',
  //   },
  //   // Add more investments...
  // ])
  
  // Sorting
  const sortKey = ref('endDate')
  const sortOrder = ref('asc')
  
  // Modal states
  const showCreateModal = ref(false)
  const editingInvestment = ref(null)
  const deletingInvestment = ref(null)
  
  // Form state
  const form = ref({
    thirdParty: '',
    amount: '',
    tenor: '',
    returns: '',
    startDate: '',
    comment: '',
  })
  
  // Computed
  const sortedInvestments = computed(() => {
    return [...investments.value].sort((a: any, b: any) => {
      const modifier = sortOrder.value === 'asc' ? 1 : -1
      return a[sortKey.value] > b[sortKey.value] ? modifier : -modifier
    })
  })
  
  // Methods
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(value)
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }
  
  const getDaysUntilDue = (endDate: string) => {
    const today = new Date()
    const due = new Date(endDate)
    const diffTime = due.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
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
    editingInvestment.value = null
    form.value = {
      thirdParty: '',
      amount: '',
      tenor: '',
      returns: '',
      startDate: '',
      comment: '',
    }
  }
  
  const editInvestment = (investment: any) => {
    editingInvestment.value = investment
    form.value = { ...investment }
  }
  
  const deleteInvestment = (investment: any) => {
    deletingInvestment.value = investment
  }
  
  const confirmDelete = () => {
    if (deletingInvestment.value) {
      investments.value = investments.value.filter(
        i => i.id !== deletingInvestment.value.id
      )
      deletingInvestment.value = null
    }
  }
  
  const handleSubmit = () => {
    if (editingInvestment.value) {
      // Update existing investment
      const index = investments.value.findIndex(i => i.id === editingInvestment.value.id)
      if (index !== -1) {
        investments.value[index] = {
          ...editingInvestment.value,
          ...form.value,
          endDate: calculateDueDate(form.value.startDate, form.value.tenor),
        }
      }
    } else {
      // Create new investment
      investments.value.push({
        id: Date.now(),
        ...form.value,
        endDate: calculateDueDate(form.value.startDate, form.value.tenor),
      })
    }
    closeModal()
  }
  
  const calculateDueDate = (startDate: string, tenor: number) => {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + Number(tenor))
    return date.toISOString().split('T')[0]
  }

  definePageMeta({
          layout: 'admin-dashboard',
           middleware: 'auth'
      })
  </script>