<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="mb-6 sm:flex sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">External Investments</h2>
        <p class="mt-1 text-sm text-gray-500">
          Manage investments with third parties
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 sm:mt-0"
      >
        <Plus class="mr-2 h-4 w-4" />
        Add External Investment
      </button>
    </div>

    <!-- Search Bar -->
    <div class="mb-4">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search investments..."
          class="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
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
          <tbody v-if="!loading && filteredInvestments.length > 0" class="divide-y divide-gray-200 bg-white">
            <tr v-for="investment in filteredInvestments" :key="investment.id">
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
                {{ investment?.investmentRate }}
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
                    @click="viewInvestmentDetails(investment)"
                    class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-primary"
                    title="View Details"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <!-- New Wealth Manager Button -->
                  <button
                    @click="openWealthManagerModal(investment)"
                    class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-emerald-600"
                    title="Assign Wealth Manager"
                  >
                    <UserPlus class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="flex flex-col items-center">
            <svg class="h-12 w-12 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-4 text-sm text-gray-500">Loading investments...</p>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="!loading && filteredInvestments.length === 0" class="flex flex-col items-center justify-center py-12">
          <div class="rounded-full bg-gray-100 p-3">
            <FileX class="h-8 w-8 text-gray-400" />
          </div>
          <h3 class="mt-4 text-sm font-medium text-gray-900">No investments found</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ searchQuery ? 'Try adjusting your search query' : 'Get started by creating a new external investment' }}
          </p>
          <button
            v-if="!searchQuery"
            @click="showCreateModal = true"
            class="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <Plus class="mr-2 h-4 w-4" />
            Add Investment
          </button>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <TransitionRoot appear :show="showCreateModal" as="template">
      <Dialog
        as="div"
        @close="closeCreateModal"
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
              <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] rounded-xl mx-auto lg:w-[500px] max-w-[5200px] bg-white p-6">
                <DialogTitle class="text-lg font-medium">
                  New External Investment
                </DialogTitle>
                <form @submit.prevent="handleCreateSubmit" class="mt-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <input
                      v-model="createForm.description"
                      type="text"
                      required
                      placeholder="e.g. Real Estate"
                      class="mt-1 block w-full py-2 border-[0.5px] rounded-lg outline-none px-3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <input
                      v-model="createForm.company"
                      type="text"
                      required
                      placeholder="e.g. Homes & Co"
                      class="mt-1 block w-full py-2 border-[0.5px] rounded-lg outline-none px-3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <input
                      v-model="createForm.amount"
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 1000000"
                      class="mt-1 block w-full py-2 border-[0.5px] rounded-lg outline-none px-3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Investment Rate: {{ createForm.investmentRate }}
                    </label>
                    <div class="px-2">
                      <input
                        v-model="interestRateValue"
                        type="range"
                        min="0"
                        max="30"
                        step="0.1"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>10%</span>
                        <span>20%</span>
                        <span>30%</span>
                      </div>
                    </div>
                    
                    <!-- Interest Rate Presets -->
                    <div class="mt-2 flex flex-wrap gap-2">
                      <button 
                        v-for="rate in [4.5, 7.5, 10.0, 15.0, 20.0]" 
                        :key="rate"
                        type="button"
                        @click="interestRateValue = rate"
                        class="px-3 py-1 text-xs rounded-full border border-gray-300 hover:bg-gray-100"
                      >
                        {{ rate }}%
                      </button>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                        v-model="createForm.startDate"
                        type="date"
                        required
                        class="mt-1 block w-full py-2 border-[0.5px] rounded-lg outline-none px-3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        End Date
                      </label>
                      <input
                        v-model="createForm.endDate"
                        type="date"
                        required
                        class="mt-1 block w-full py-2 border-[0.5px] rounded-lg outline-none px-3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Tenor: {{ tenorValue }} months
                    </label>
                    <div class="px-2">
                      <input
                        v-model="tenorValue"
                        type="range"
                        min="1"
                        max="36"
                        step="1"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1</span>
                        <span>12</span>
                        <span>24</span>
                        <span>36</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      Accrued Interest
                    </label>
                    <input
                      v-model="createForm.accuredInterest"
                      type="number"
                      step="0.0001"
                      required
                      placeholder="e.g. 4.0495"
                      class="mt-1 block w-full py-2 border-[0.5px] rounded-lg outline-none px-3 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                  
                  <div class="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      @click="closeCreateModal"
                      class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      :disabled="isSubmitting"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 flex items-center"
                      :disabled="isSubmitting"
                    >
                      <span v-if="isSubmitting" class="mr-2">
                        <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      Create
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- View Details Modal -->
    <TransitionRoot appear :show="!!selectedInvestment" as="template">
      <Dialog
        as="div"
        @close="selectedInvestment = null"
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
              <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] rounded-xl mx-auto lg:w-[500px] max-w-[5200px] bg-white p-6">
                <DialogTitle class="text-lg font-medium">
                  Investment Details
                </DialogTitle>
                <div class="mt-4 space-y-4">
                  <div v-if="selectedInvestment" class="space-y-3">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-sm font-medium text-gray-500">Description</p>
                        <p class="text-sm font-semibold">{{ selectedInvestment.description }}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Company</p>
                        <p class="text-sm font-semibold">{{ selectedInvestment.company }}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p class="text-sm font-medium text-gray-500">Amount</p>
                      <p class="text-sm font-semibold">{{ formatCurrency(selectedInvestment.amount) }}</p>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-sm font-medium text-gray-500">Investment Rate</p>
                        <p class="text-sm font-semibold">{{ selectedInvestment.investmentRate }}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Accrued Interest</p>
                        <p class="text-sm font-semibold">{{ selectedInvestment.accuredInterest }}</p>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-sm font-medium text-gray-500">Start Date</p>
                        <p class="text-sm font-semibold">{{ formatDate(selectedInvestment.startDate) }}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">End Date</p>
                        <p class="text-sm font-semibold">{{ formatDate(selectedInvestment.endDate) }}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p class="text-sm font-medium text-gray-500">Tenor</p>
                      <p class="text-sm font-semibold">{{ selectedInvestment.tenor }}</p>
                    </div>
                    
                    <div>
                      <p class="text-sm font-medium text-gray-500">Status</p>
                      <p class="inline-flex rounded-full px-2 py-1 text-xs font-medium"
                        :class="{
                          'bg-green-100 text-green-800': selectedInvestment.investmentStatus === 'Active',
                          'bg-yellow-100 text-yellow-800': selectedInvestment.investmentStatus === 'Pending',
                          'bg-red-100 text-red-800': selectedInvestment.investmentStatus === 'Matured'
                        }"
                      >
                        {{ selectedInvestment.investmentStatus || 'Active' }}
                      </p>
                    </div>

                    <!-- Wealth Manager Section (if assigned) -->
                    <div v-if="selectedInvestment.wealthManagerId">
                      <p class="text-sm font-medium text-gray-500">Wealth Manager</p>
                      <p class="text-sm font-semibold flex items-center">
                        <UserCheck class="h-4 w-4 mr-1 text-emerald-600" />
                        {{ getWealthManagerName(selectedInvestment.wealthManagerId) }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="mt-6 flex justify-end">
                    <button
                      @click="selectedInvestment = null"
                      class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Wealth Manager Modal -->
    <TransitionRoot appear :show="showWealthManagerModal" as="template">
      <Dialog
        as="div"
        @close="closeWealthManagerModal"
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
              <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] rounded-xl mx-auto lg:w-[500px] max-w-[5200px] bg-white p-6 shadow-xl">
                <DialogTitle class="text-lg font-medium flex items-center">
                  <UserPlus class="h-5 w-5 mr-2 text-emerald-600" />
                  Assign Wealth Manager
                </DialogTitle>
                
                <div class="mt-4">
                  <p class="text-sm text-gray-500 mb-4">
                    Assign a wealth manager to manage this investment.
                  </p>
                  
                  <div v-if="selectedInvestmentForWM" class="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p class="text-sm font-medium text-gray-700">Investment</p>
                    <p class="text-base font-semibold">{{ selectedInvestmentForWM.company }}</p>
                    <p class="text-sm text-gray-500">{{ formatCurrency(selectedInvestmentForWM.amount) }}</p>
                  </div>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Select Wealth Manager
                    </label>
                    <div class="relative">
                      <select
                        v-model="selectedWealthManagerId"
                        class="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                        required
                      >
                        <option value="" disabled>Select a wealth manager</option>
                        <option v-for="manager in wealthManagers" :key="manager.id" :value="manager.id">
                          {{ manager?.firstName }} {{ manager?.lastName }}
                        </option>
                      </select>
                      <ChevronDown class="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div class="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    @click="closeWealthManagerModal"
                    class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    :disabled="isAssigningManager"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    @click="assignWealthManager"
                    class="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 flex items-center"
                    :disabled="!selectedWealthManagerId || isAssigningManager"
                  >
                    <span v-if="isAssigningManager" class="mr-2">
                      <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    Assign Manager
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
import { ref, computed, watch } from 'vue';
import { useAddExternalInvestment } from '@/composables/modules/finance-mgt/useAddExternalInvestment';
import { useFetchExternalInvestments } from '@/composables/modules/finance-mgt/useGetExternalInvestments';
import { useFetchWealthManagers } from '@/composables/modules/wealth-managers/useFetchWealthManagers';
import { useAssignWealthManagerToInvestment } from '@/composables/modules/wealth-managers/useAssignWealthManagerToInvestment';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import {
  Plus,
  ArrowUpDown,
  Eye,
  FileX,
  Search,
  UserPlus,
  UserCheck,
  ChevronDown,
} from 'lucide-vue-next';

// Fetch investments
const { externalInvestments, loading } = useFetchExternalInvestments();
const { addExternalInvestment, loading: isSubmitting } = useAddExternalInvestment();
const { assignWealthManagerToInvestment, loading: isAssigningManager } = useAssignWealthManagerToInvestment();
const { wealthManagersList: wealthManagers, loading: fetchingWealthManagers } = useFetchWealthManagers()

// Table configuration
const tableHeaders = [
  { key: 'company', label: 'Company', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'tenor', label: 'Tenor', sortable: true },
  { key: 'investmentRate', label: 'Rate', sortable: true },
  { key: 'startDate', label: 'Start Date', sortable: true },
  { key: 'endDate', label: 'End Date', sortable: true },
  { key: 'daysUntilDue', label: 'Days Until Due', sortable: true },
];

// Sorting
const sortKey = ref('endDate');
const sortOrder = ref('asc');

// Search
const searchQuery = ref('');

// Modal states
const showCreateModal = ref(false);
const selectedInvestment = ref(null);
const showWealthManagerModal = ref(false);
const selectedInvestmentForWM = ref(null);
const selectedWealthManagerId = ref('');

// Form state with sliders
const createForm = ref({
  description: '',
  company: '',
  amount: 0,
  investmentRate: '10%',
  startDate: '',
  endDate: '',
  tenor: '2 months',
  accuredInterest: 4.0495,
  investmentStatus: 'Active'
});

// Slider values
const interestRateValue = ref(10);
const tenorValue = ref(2);

// Watch for slider changes
watch(interestRateValue, (newValue) => {
  createForm.value.investmentRate = `${newValue}%`;
});

watch(tenorValue, (newValue) => {
  createForm.value.tenor = `${newValue} months`;
  
  // Update end date based on tenor if start date is set
  if (createForm.value.startDate) {
    const startDate = new Date(createForm.value.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + newValue);
    createForm.value.endDate = endDate.toISOString().split('T')[0];
  }
});

// Watch for start date changes to update end date based on tenor
watch(() => createForm.value.startDate, (newStartDate) => {
  if (newStartDate) {
    const startDate = new Date(newStartDate);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + tenorValue.value);
    createForm.value.endDate = endDate.toISOString().split('T')[0];
  }
});

// Computed
const filteredInvestments = computed(() => {
  let investments = [...externalInvestments.value];
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    investments = investments.filter(inv => 
      inv.company?.toLowerCase().includes(query) ||
      inv.description?.toLowerCase().includes(query) ||
      inv.tenor?.toLowerCase().includes(query) ||
      inv.investmentRate?.toLowerCase().includes(query)
    );
  }
  
  // Apply sorting
  return investments.sort((a, b) => {
    const modifier = sortOrder.value === 'asc' ? 1 : -1;
    
    // Handle different data types
    if (sortKey.value === 'amount' || sortKey.value === 'accuredInterest') {
      return (parseFloat(a[sortKey.value]) > parseFloat(b[sortKey.value])) ? modifier : -modifier;
    } else if (sortKey.value === 'startDate' || sortKey.value === 'endDate') {
      return (new Date(a[sortKey.value]) > new Date(b[sortKey.value])) ? modifier : -modifier;
    } else if (sortKey.value === 'daysUntilDue') {
      return (getDaysUntilDue(a.endDate) > getDaysUntilDue(b.endDate)) ? modifier : -modifier;
    } else {
      return (a[sortKey.value]?.toString().toLowerCase() > b[sortKey.value]?.toString().toLowerCase()) ? modifier : -modifier;
    }
  });
});

// Methods
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(value);
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

const getDaysUntilDue = (endDate) => {
  if (!endDate) return 0;
  const today = new Date();
  const due = new Date(endDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  resetCreateForm();
};

const resetCreateForm = () => {
  createForm.value = {
    description: '',
    company: '',
    amount: 0,
    investmentRate: '10%',
    startDate: '',
    endDate: '',
    tenor: '2 months',
    accuredInterest: 4.0495,
    investmentStatus: 'Active'
  };
  interestRateValue.value = 10;
  tenorValue.value = 2;
};

const viewInvestmentDetails = (investment) => {
  selectedInvestment.value = investment;
};

const handleCreateSubmit = async () => {
  try {
    await addExternalInvestment(createForm.value);
    closeCreateModal();
    // Refresh the investments list
    await useFetchExternalInvestments().refresh();
  } catch (error) {
    console.error('Error creating external investment:', error);
  }
};

// Wealth Manager Functions
const openWealthManagerModal = (investment) => {
  console.log(investment, 'investment here');
  selectedInvestmentForWM.value = investment;
  selectedWealthManagerId.value = investment.wealthManagerId || '';
  showWealthManagerModal.value = true;
};

const closeWealthManagerModal = () => {
  showWealthManagerModal.value = false;
  selectedInvestmentForWM.value = null;
  selectedWealthManagerId.value = '';
};

// Direct assignment without confirmation modal
const assignWealthManager = async () => {
  try {
    if (selectedWealthManagerId.value && selectedInvestmentForWM.value) {
      await assignWealthManagerToInvestment(selectedInvestmentForWM.value.id, {
        wealthManagerId: selectedWealthManagerId.value
      });
      
      // Update the local investment data
      const index = externalInvestments.value.findIndex(inv => inv.id === selectedInvestmentForWM.value.id);
      if (index !== -1) {
        externalInvestments.value[index].wealthManagerId = selectedWealthManagerId.value;
      }
      
      // Close modal
      closeWealthManagerModal();
      
      // Show success notification (if you have a notification system)
      // showNotification({ type: 'success', message: 'Wealth manager assigned successfully' });
    }
  } catch (error) {
    console.error('Error assigning wealth manager:', error);
    // Show error notification (if you have a notification system)
    // showNotification({ type: 'error', message: 'Failed to assign wealth manager' });
  }
};

const getWealthManagerName = (id) => {
  if (!id) return 'None';
  const manager = wealthManagers.value.find(m => m.id === id);
  return manager ? `${manager.firstName} ${manager.lastName}` : 'Unknown';
};

definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth'
});
</script>

<style scoped>
/* Custom styling for range inputs */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 5px;
  background: #e5e7eb;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary-color, #4f46e5);
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border: 0;
  border-radius: 50%;
  background: var(--primary-color, #4f46e5);
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: var(--primary-hover-color, #4338ca);
}

input[type="range"]::-moz-range-thumb:hover {
  background: var(--primary-hover-color, #4338ca);
}

/* Animation for modals */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* Dropdown animation */
select {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Button hover animations */
button {
  transition: all 0.2s ease;
}

/* Card hover effect */
.bg-white {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.bg-white:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>