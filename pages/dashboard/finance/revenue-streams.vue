<template>
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 class="text-xl font-bold tracking-tight text-gray-900">Revenue Streams</h1>
        </div>
      </header>

      <!-- {{ externalInvestments }} -->
      <!-- {{ revenueAnalyticsObj }} -->
  
      <!-- {{ selectedInvestment }} -->
      <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <!-- Revenue Analytics Cards -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <BanknotesIcon class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Amount Invested</dt>
                    <dd class="text-2xl font-semibold text-gray-900">
                      {{ formatCurrency(revenueAnalyticsObj?.total_amount_invested) }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
  
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ChartBarIcon class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Interest Accrued</dt>
                    <dd class="text-2xl font-semibold text-gray-900">
                      {{ revenueAnalyticsObj?.total_interest_accured }}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
  
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ScaleIcon class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Standing</dt>
                    <dd class="text-2xl font-semibold text-gray-900">
                      {{ formatCurrency(revenueAnalyticsObj?.standing) }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- External Investments Table -->
        <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <h3 class="text-lg font-medium leading-6 text-gray-900">External Investments</h3>
      <button
        @click="openAddInvestmentModal"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#2F6D67] hover:bg-[#265751] transition-colors duration-200"
      >
        Add Investment
      </button>
    </div>

    <div class="overflow-x-auto relative">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="investment in externalInvestments" :key="investment.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="text-sm font-medium text-gray-900">
                  {{ investment.company }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ formatCurrency(investment.amount) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ investment.investmentRate }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getStatusClass(investment.status)"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ investment.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Menu as="div" class="relative inline-block text-left">
                <div>
                  <MenuButton
                    class="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                  >
                    Actions
                    <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                  </MenuButton>
                </div>

                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div class="py-1">
                      <MenuItem v-slot="{ active }">
                        <a
                          href="#"
                          :class="[
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          ]"
                          @click.prevent="handleAction('approve', investment)"
                        >
                          Approve
                        </a>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <a
                          href="#"
                          :class="[
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          ]"
                          @click.prevent="handleAction('reject', investment)"
                        >
                          Reject
                        </a>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <a
                          href="#"
                          :class="[
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          ]"
                          @click.prevent="handleAction('delete', investment)"
                        >
                          Delete
                        </a>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <a
                          href="#"
                          :class="[
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          ]"
                          @click.prevent="handleAction('edit', investment)"
                        >
                          Edit
                        </a>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
      </main>
  
      <!-- Investment Modal -->
      <InvestmentModal
        :is-open="isModalOpen"
        :investment="selectedInvestment"
        :mode="modalMode"
        @close="closeModal"
        @submit="handleInvestmentSubmit"
      />

      <ConfirmationModal
    :is-open="isUpdateInvestmentStausModalOpen"
    :title="modalTitle"
      message="Are you sure you want to process this Investment? This action will require approval from an administrator."
      :confirm-text="confirmText"
      @close="closeUpdateModal"
      @confirm="processInvestment"
    />


      <ConfirmationModal
        :is-open="isDeleteConfirmationModalOpen"
        title="Delete External Investment"
        message="Are you sure you want to delete this Investment? This will require approval from an administrator."
        confirm-text="Delete Investment"
        @close="closeDeleteConfirmationModal"
        @confirm="deleteInvestment"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
  import { useApproveRejectExternalInvestment } from '@/composables/modules/finance-mgt/useApproveRejectExternalInvestment'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { useEditExternalInvestment } from '@/composables/modules/finance-mgt/useEditExternalInvestment'
import { useDeleteExternalInvestment } from '@/composables/modules/finance-mgt/useDeleteExternalInvestment'
import { useAddExternalInvestment } from '@/composables/modules/finance-mgt/useAddExternalInvestment'
import { useFetchRevenueStreamAnalytics } from '@/composables/modules/finance-mgt/useGetRevenueStreamAnalytics'
import { useFetchExternalInvestments } from '@/composables/modules/finance-mgt/useGetExternalInvestments'
import { ref } from 'vue'
import { BanknotesIcon, ChartBarIcon, ScaleIcon } from '@heroicons/vue/24/outline'
const { approveRejectExternalInvestment, loading:  updating } = useApproveRejectExternalInvestment ()
import type { ExternalInvestment } from '@/types'

interface Investment {
  id: number
  company: string
  amount: number
  investmentRate: string
  status: string
}


const { externalInvestments, loading } = useFetchExternalInvestments()
const { revenueAnalytics: revenueAnalyticsObj, loading: processing } = useFetchRevenueStreamAnalytics()
const { addExternalInvestment, loading: adding } = useAddExternalInvestment()
const { deleteExternalInvestment, loading: deleting } = useDeleteExternalInvestment()
const { editExternalInvestment, loading: editing } = useEditExternalInvestment()

const isModalOpen = ref(false)
const isDeleteConfirmationModalOpen = ref(false)
const modalMode = ref<'add' | 'edit' | 'approve' | 'reject'>('add') as Record<string, any>
const selectedInvestment = ref<ExternalInvestment | undefined>()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount)
}

// Function to close the modal

const modalTitle = computed(() => {
  return modalMode.value === 'approve'
    ? 'Approve External Investment'
    : 'Reject External Investment'
})

// Compute the confirm button text based on the mode
const confirmText = computed(() => {
  return modalMode.value === 'approve'
    ? 'Approve Investment'
    : 'Reject Investment'
})

const closeDeleteConfirmationModal = () => {
  isDeleteConfirmationModalOpen.value = false
}

const getStatusClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    'in-progress': 'bg-blue-100 text-blue-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const isUpdateInvestmentStausModalOpen = ref(false)

const openUpdateModal = () => {
  isUpdateInvestmentStausModalOpen.value = true
}

const closeUpdateModal = () => {
  isUpdateInvestmentStausModalOpen.value = false
}


const openAddInvestmentModal = () => {
  modalMode.value = 'add'
  selectedInvestment.value = undefined
  isModalOpen.value = true
}

const openEditInvestmentModal = (investment: ExternalInvestment) => {
  modalMode.value = 'edit'
  selectedInvestment.value = investment
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedInvestment.value = undefined
}

const handleInvestmentSubmit = async (data: Partial<ExternalInvestment>) => {
  console.log('Investment data:', data)
  if (modalMode.value === 'add') {
    // Create a new investment using the add composable
    await addExternalInvestment(data).then(() => {
      closeModal()
    })
  } else if (modalMode.value === 'edit' && selectedInvestment.value) {
   const { id, ...rest } = data
    // Edit the existing investment using the edit composable
    await editExternalInvestment(selectedInvestment.value.id, rest).then(() => {
      closeModal()
    })
  }
}

// const confirmDeleteInvestment = () => {
//   deleteInvestment()
// }

const deleteInvestment = async () => {
  await deleteExternalInvestment(selectedInvestment.value.id).then(() => {
    isDeleteConfirmationModalOpen.value = false
  })
}

const handleDeleteInvestment = (investment: any) => {
  selectedInvestment.value = investment
  isDeleteConfirmationModalOpen.value = true
}

const handleAction = (action: Record<string, any>, investment: Investment) => {
  modalMode.value = action
  selectedInvestment.value = investment
  if(action === 'approve') {
    isUpdateInvestmentStausModalOpen.value = true
  }
  if(action === 'reject') {
    isUpdateInvestmentStausModalOpen.value = true
  }
  if(action === 'edit') {
    isModalOpen.value = true
  }
  if(action === 'delete') {
    isDeleteConfirmationModalOpen.value = true
  }
  console.log(`${action} action for investment:`, investment)
  // Implement your action logic here
}

// Function to process the investment based on the current mode
const processInvestment = async() => {
  if (modalMode.value === 'approve') {
    await approveRejectExternalInvestment(selectedInvestment.value.id, 'approve').then(() => {
      isUpdateInvestmentStausModalOpen.value = false
    })
    // Add code to handle approval
  } else {
    await approveRejectExternalInvestment(selectedInvestment.value.id, 'reject').then(() => {
  // closeDeleteConfirmationModal()
  isUpdateInvestmentStausModalOpen.value = false
    })
    // Add code to handle rejection
  }
}

definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth',
})
</script>



<style scoped>
.relative {
  position: relative;
}

/* Ensure the dropdown is on top of everything */
:deep(.absolute) {
  z-index: 9999;
}
</style>
