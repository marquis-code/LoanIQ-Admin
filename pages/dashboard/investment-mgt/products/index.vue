<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6 sm:flex sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Investment Products</h2>
        <p class="mt-1 text-sm text-gray-500">
          Manage your investment products and track their performance
        </p>
      </div>
      <button
        @click="openCreateModal"
        class="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 sm:mt-0"
      >
        <Plus class="mr-2 h-4 w-4" />
        New Product
      </button>
    </div>

    <!-- Filters -->
    <div class="grid gap-4 rounded-t-lg border bg-white p-4 sm:flex sm:items-center">
      <div class="flex flex-1 gap-4">
        <div class="flex-1">
          <input
            v-model="search"
            type="text"
            placeholder="Search products..."
            class="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
        <select
          v-model="filters.status"
          class="rounded-md border border-gray-300 px-6 py-2.5 outline-none focus:border-primary focus:ring-primary sm:text-sm"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    </div>

    <!-- Products Table -->
    <div v-if="!loading && products.length" class="rounded-b-lg border bg-white">
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
                {{ product?.interestRate || "Nil" }}%
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                {{ product?.minTenor || "Nil" }} months
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
                  <button
                    @click="viewProductDetails(product)"
                    class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button
                    v-if="product.status === 'active'"
                    @click="archiveProduct(product)"
                    class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <Archive class="h-4 w-4" />
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
    
    <!-- Loading State -->
    <div v-else-if="loading" class="flex justify-center items-center py-20 bg-white rounded-lg border">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-20 bg-white rounded-lg border">
      <div class="rounded-full bg-gray-100 p-3 mb-4">
        <InboxIcon class="h-8 w-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900">No Investment Products Available</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new investment product.</p>
      <button
        @click="openCreateModal"
        class="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
      >
        <Plus class="mr-2 h-4 w-4" />
        New Product
      </button>
    </div>

    <!-- Create Investment Product Modal -->
    <TransitionRoot appear :show="showCreateModal" as="template">
      <Dialog as="div" @close="closeCreateModal" class="relative z-50">
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
              <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] rounded-xl mx-auto lg:w-[500px] max-w-[5200px] bg-white">
                <DialogTitle class="flex items-center justify-between p-6 border-b">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">Create Investment Product</h3>
                    <p class="mt-1 text-sm text-gray-500">Step {{ currentStep }} of {{ totalSteps }}</p>
                  </div>
                  <button @click="closeCreateModal" class="text-gray-400 hover:text-gray-500">
                    <X class="h-5 w-5" />
                  </button>
                </DialogTitle>
                
                <!-- Progress Bar -->
                <div class="w-full bg-gray-200 h-1">
                  <div 
                    class="bg-primary h-1 transition-all duration-300" 
                    :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
                  ></div>
                </div>
                
                <!-- Step 1: Basic Information -->
                <div v-if="currentStep === 1" class="p-6">
                  <div class="space-y-4">
                    <div>
                      <label for="investment-name" class="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        v-model="payload.name"
                        id="investment-name"
                        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        v-model="payload.description"
                        id="description"
                        rows="3"
                        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-primary sm:text-sm"
                      ></textarea>
                    </div>
                    
                    <div>
                      <!-- <label class="block text-sm font-medium text-gray-700">Investment Benefits</label> -->
                      <ModulesInvestmentBenefitInput :initialBenefits="benefits" @update:benefits="updateBenefits" />
                    </div>
                  </div>
                </div>
                
                <!-- Step 2: Financial Details -->
                <div v-if="currentStep === 2" class="p-6">
                  <div class="space-y-4">
                    <section class="flex w-full items-center justify-between gap-x-6">
                      <div class="w-full">
                        <label for="minimumInvestment" class="block text-sm font-medium text-gray-700">Min Investment</label>
                        <input
                          type="text"
                          v-model="formattedMinInvestment"
                          id="minimumInvestment"
                          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-primary sm:text-sm"
                          @input="formatMinInvestment"
                          @blur="updateMinInvestment"
                        />
                      </div>

                      <div class="w-full">
                        <label for="interestRate" class="block text-sm font-medium text-gray-700">Interest Rate</label>
                        <input
                          type="text"
                          v-model="formattedInterestRate"
                          id="interestRate"
                          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-primary sm:text-sm"
                          @input="formatInterestRate"
                          @blur="updateInterestRate"
                        />
                      </div>
                    </section>
                    
                    <div>
                      <label for="preLiquidationFee" class="block text-sm font-medium text-gray-700">Pre Liquidation Charge (%)</label>
                      <input
                        type="text"
                        v-model="formattedPreLiquidationFee"
                        id="preLiquidationFee"
                        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-primary sm:text-sm"
                        @input="formatPreLiquidationFee"
                        @blur="updatePreLiquidationFee"
                      />
                    </div>
                    
                    <div>
                      <ModulesInvestmentTenorSlider @update:selectedTenor="handleTenorSelection" />
                    </div>
                  </div>
                </div>
                
                <!-- Step 3: Payment Options -->
                <div v-if="currentStep === 3" class="p-6">
                  <div class="space-y-6">
                    <div class="flex justify-between items-center gap-6">
                      <ModulesInvestmentInterestPaymentSchedule 
                        @update:selectedInterestSchedules="selectedInterestSchedules = $event"
                      />

                      <ModulesInvestmentAutomatedFrequency 
                        @update:selectedAutomatedFrequencies="selectedAutomatedFrequencies = $event"
                      />
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Flexible</label>
                        <label class="inline-flex items-center space-x-4 cursor-pointer">
                          <span>No</span>
                          <span class="relative">
                            <input v-model="payload.flexible" type="checkbox" class="hidden peer">
                            <div class="w-10 h-6 rounded-full shadow-inner bg-gray-300 peer-checked:bg-primary"></div>
                            <div class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow bg-white peer-checked:right-0 peer-checked:left-auto"></div>
                          </span>
                          <span>Yes</span>
                        </label>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Can Top Up</label>
                        <label class="inline-flex items-center space-x-4 cursor-pointer">
                          <span>No</span>
                          <span class="relative">
                            <input v-model="payload.canTopUp" type="checkbox" class="hidden peer">
                            <div class="w-10 h-6 rounded-full shadow-inner bg-gray-300 peer-checked:bg-primary"></div>
                            <div class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow bg-white peer-checked:right-0 peer-checked:left-auto"></div>
                          </span>
                          <span>Yes</span>
                        </label>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Can Withdraw Early</label>
                        <label class="inline-flex items-center space-x-4 cursor-pointer">
                          <span>No</span>
                          <span class="relative">
                            <input v-model="payload.canWithdrawEarly" type="checkbox" class="hidden peer">
                            <div class="w-10 h-6 rounded-full shadow-inner bg-gray-300 peer-checked:bg-primary"></div>
                            <div class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow bg-white peer-checked:right-0 peer-checked:left-auto"></div>
                          </span>
                          <span>Yes</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Navigation Buttons -->
                <div class="flex justify-between items-center p-6 border-t">
                  <button
                    v-if="currentStep > 1"
                    @click="prevStep"
                    class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <div v-else></div>
                  
                  <button
                    v-if="currentStep < totalSteps"
                    @click="nextStep"
                    class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    Next
                  </button>
                  <button
                    v-else
                    @click="submitForm"
                    :disabled="creatingProduct"
                    class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ creatingProduct ? "Creating..." : "Create Product" }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- View Product Details Modal -->
    <TransitionRoot appear :show="!!selectedProduct" as="template">
      <Dialog as="div" @close="selectedProduct = null" class="relative z-50">
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
              <DialogPanel v-if="selectedProduct" class="w-full max-w-2xl mx-auto rounded-lg bg-white shadow-xl">
                <DialogTitle class="flex items-center justify-between p-6 border-b">
                  <h3 class="text-lg font-medium text-gray-900">Investment Product Details</h3>
                  <button @click="selectedProduct = null" class="text-gray-400 hover:text-gray-500">
                    <X class="h-5 w-5" />
                  </button>
                </DialogTitle>
                
                <div class="p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Product Name</h4>
                      <p class="mt-1 text-base">{{ selectedProduct.name }}</p>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Status</h4>
                      <p class="mt-1">
                        <span
                          :class="{
                            'bg-green-100 text-green-800': selectedProduct.status === 'active',
                            'bg-gray-100 text-gray-800': selectedProduct.status === 'archived'
                          }"
                          class="rounded-full px-2 py-1 text-xs font-medium"
                        >
                          {{ selectedProduct.status }}
                        </span>
                      </p>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Minimum Investment</h4>
                      <p class="mt-1 text-base">{{ formatCurrency(selectedProduct.minInvestment) }}</p>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Interest Rate</h4>
                      <p class="mt-1 text-base">{{ selectedProduct.interestRate }}%</p>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Tenor</h4>
                      <p class="mt-1 text-base">{{ selectedProduct.minTenor }} - {{ selectedProduct.maxTenor }} months</p>
                    </div>
                    
                    <div>
                      <h4 class="text-sm font-medium text-gray-500">Pre-Liquidation Fee</h4>
                      <p class="mt-1 text-base">{{ formatCurrency(selectedProduct.preLiquidationFee) }}</p>
                    </div>
                  </div>
                  
                  <div class="mt-6">
                    <h4 class="text-sm font-medium text-gray-500">Description</h4>
                    <p class="mt-1 text-base">{{ selectedProduct.description }}</p>
                  </div>
                  
                  <div class="mt-6" v-if="selectedProduct.benefits && selectedProduct.benefits.length">
                    <h4 class="text-sm font-medium text-gray-500">Benefits</h4>
                    <ul class="mt-2 space-y-2">
                      <li v-for="(benefit, index) in selectedProduct.benefits" :key="index" class="flex items-start">
                        <CheckCircle class="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{{ benefit }}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="flex items-center">
                      <div class="mr-2 rounded-full bg-gray-100 p-2">
                        <RefreshCw class="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Flexible</p>
                        <p class="font-medium">{{ selectedProduct.flexible ? 'Yes' : 'No' }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center">
                      <div class="mr-2 rounded-full bg-gray-100 p-2">
                        <PlusCircle class="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Can Top Up</p>
                        <p class="font-medium">{{ selectedProduct.canTopUp ? 'Yes' : 'No' }}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center">
                      <div class="mr-2 rounded-full bg-gray-100 p-2">
                        <ArrowDownCircle class="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Early Withdrawal</p>
                        <p class="font-medium">{{ selectedProduct.canWithdrawEarly ? 'Yes' : 'No' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="flex justify-end p-6 border-t">
                  <button
                    @click="selectedProduct = null"
                    class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

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
                    :disabled="archiving"
                    class="rounded-md disabled:cursor-not-allowed disabled:opacity-25 bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    {{ archiving ? 'Processing...' : 'Archive' }}
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
  Archive,
  X,
  Eye,
  CheckCircle,
  RefreshCw,
  PlusCircle,
  ArrowDownCircle,
  InboxIcon
} from 'lucide-vue-next';

// Import composables
import { useInvestment } from '@/composables/core/useReturnsCalculator';
import { useArchiveInvestmentProduct } from '~/composables/modules/investment-products/useArchiveInvestmentProduct';
import { useFetchInvestmentProducts } from '@/composables/modules/investment-products/useFetchInvestmentProducts';
import { useCreateInvestmentProduct } from '@/composables/modules/investment-products/useCreateInvestmentProduct';

// Initialize composables
const { loading: productsLoading, investmentProducts: products, metadata } = useFetchInvestmentProducts();
const { archiveInvestmentProduct, loading: archiving } = useArchiveInvestmentProduct();
const { createInvestmentProduct, loading: creatingProduct, payload } = useCreateInvestmentProduct();
const { calculateReturn } = useInvestment();

// Table configuration
const tableHeaders = [
  { key: 'name', label: 'Product Name', sortable: true },
  { key: 'minInvestment', label: 'Minimum Amount', sortable: true },
  { key: 'interestRate', label: 'Interest Rate (%)', sortable: true },
  { key: 'minTenor', label: 'Tenor', sortable: true },
  { key: 'preLiquidationFee', label: 'Pre Liquidation Fee', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

// State
const search = ref('');
const filters = ref({
  status: '',
});
const sortKey = ref('name');
const sortOrder = ref('asc');
const currentPage = ref(1);
const itemsPerPage = 10;
const loading = computed(() => productsLoading.value);

const showCreateModal = ref(false);
const selectedProduct = ref(null);
const archivingProduct = ref(null);
const currentStep = ref(1);
const totalSteps = 3;

// Form data
const benefits = ref<string[]>([]);
const selectedInterestSchedules = ref<string[]>([]);
const selectedAutomatedFrequencies = ref<string[]>([]);

// Formatted values for inputs
const formattedMinInvestment = ref('');
const formattedInterestRate = ref('');
const formattedPreLiquidationFee = ref('');

// Selected tenor
const selectedTenor = ref<{ minTenor: number; maxTenor: number }>({
  minTenor: 3,
  maxTenor: 6,
});

// Computed
const filteredProducts = computed(() => {
  let result = [...products.value];

  if (search.value) {
    const query = search.value.toLowerCase();
    result = result.filter(
      product => product.name.toLowerCase().includes(query)
    );
  }

  if (filters.value.status) {
    result = result.filter(
      product => product.status === filters.value.status
    );
  }

  result.sort((a: any, b: any) => {
    const modifier = sortOrder.value === 'asc' ? 1 : -1;
    return a[sortKey.value] > b[sortKey.value] ? modifier : -modifier;
  });

  return result;
});

const totalProducts = computed(() => filteredProducts.value.length);
const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage));
const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const paginationEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage, totalProducts.value)
);

// Methods
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(value);
};

const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

// Modal methods
const openCreateModal = () => {
  showCreateModal.value = true;
  currentStep.value = 1;
  resetForm();
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  resetForm();
};

const resetForm = () => {
  payload.value = {
    name: '',
    description: '',
    minInvestment: 0,
    interestRate: 0,
    preLiquidationFee: 0,
    minTenor: 3,
    maxTenor: 6,
    flexible: false,
    canTopUp: false,
    canWithdrawEarly: false,
    benefits: [],
    interestPaymentSchedule: [],
    automatedFrequency: []
  };
  benefits.value = [];
  selectedInterestSchedules.value = [];
  selectedAutomatedFrequencies.value = [];
  formattedMinInvestment.value = '';
  formattedInterestRate.value = '';
  formattedPreLiquidationFee.value = '';
};

// Step navigation
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// Form submission
const submitForm = async () => {
  try {
    await createInvestmentProduct();
    closeCreateModal();
  } catch (error) {
    console.error('Error creating investment product:', error);
  }
};

// Product actions
const viewProductDetails = (product: any) => {
  selectedProduct.value = product;
};

const archiveProduct = (product: any) => {
  archivingProduct.value = product;
};

const confirmArchive = async () => {
  if (archivingProduct.value) {
    await archiveInvestmentProduct(archivingProduct.value.id);
    archivingProduct.value = null;
  }
};

// Pagination
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Form input formatters
const formatMinInvestment = () => {
  const numericValue = formattedMinInvestment.value.replace(/[^0-9]/g, '');
  formattedMinInvestment.value = numericValue
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    .replace(/^/, '₦');
};

const updateMinInvestment = () => {
  const rawValue = formattedMinInvestment.value.replace(/[^\d.-]/g, '');
  payload.value.minInvestment = parseFloat(rawValue);
};

const formatInterestRate = () => {
  const numericValue = formattedInterestRate.value.replace(/[^0-9]/g, '');
  formattedInterestRate.value = `${Math.min(parseInt(numericValue || '0'), 100)}%`;
};

const updateInterestRate = () => {
  const rawValue = formattedInterestRate.value.replace(/[^\d.-]/g, '');
  payload.value.interestRate = Math.min(parseFloat(rawValue), 100);
};

const formatPreLiquidationFee = () => {
  const numericValue = formattedPreLiquidationFee.value.replace(/[^0-9]/g, '');
  formattedPreLiquidationFee.value = '₦' + numericValue
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const updatePreLiquidationFee = () => {
  const rawValue = formattedPreLiquidationFee.value.replace(/[^\d.-]/g, '');
  payload.value.preLiquidationFee = parseFloat(rawValue);
};

// Update benefits
const updateBenefits = (newBenefits: string[]) => {
  benefits.value = newBenefits;
  payload.value.benefits = benefits.value;
};

// Handle tenor selection
const handleTenorSelection = (tenor: { minTenor: number; maxTenor: number }) => {
  selectedTenor.value = tenor;
  payload.value.minTenor = tenor.minTenor;
  payload.value.maxTenor = tenor.maxTenor;
};

// Watch for changes in selected schedules and frequencies
watch(selectedInterestSchedules, (newSchedules) => {
  payload.value.interestPaymentSchedule = newSchedules;
});

watch(selectedAutomatedFrequencies, (newFrequencies) => {
  payload.value.automatedFrequency = newFrequencies;
});

// Page meta
definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth'
});
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #dcdcdc;
}

.input-label {
  font-weight: 600;
}

.input-field:focus {
  outline: none;
  border-color: #4caf50;
}
</style>