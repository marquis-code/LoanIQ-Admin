<template>
  <main class="w-full">
    <div class="">
      <!-- Progress Bar -->
       <!-- {{parseFloat(selectedInvestmentProduct?.minInvestment)}} -->
      <div class="mb-4">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-medium">Step {{ currentStep }} of {{ totalSteps }}</span>
          <span class="text-sm text-gray-500">{{ stepTitles[currentStep - 1] }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            class="bg-[#2F6D67] h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          ></div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Step content with transitions -->
        <transition 
          name="slide" 
          mode="out-in"
        >
          <!-- Step 1: Basic Information -->
          <div v-if="currentStep === 1" key="step1" class="space-y-6">
            <h2 class="text-base font-medium">Basic Information</h2>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
              <input
                id="email"
                v-model="payload.email"
                type="email"
                placeholder="Enter email"
                class="input-field w-full mt-1 p-3 border border-gray-300 rounded-md bg-[#F4F5F7] focus:outline-none focus:ring-2 focus:ring-[#2F6D67]"
              />
            </div>

            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
              <input
                id="name"
                v-model="payload.name"
                type="text"
                placeholder="Enter investment name"
                class="input-field w-full mt-1 p-3 border border-gray-300 rounded-md bg-[#F4F5F7] focus:outline-none focus:ring-2 focus:ring-[#2F6D67]"
              />
            </div>
          </div>

          <!-- Step 2: Investment Amount -->
          <div v-else-if="currentStep === 3" key="step3" class="space-y-6">
            <h2 class="text-base font-medium">Investment Amount</h2>
            <div class="w-full">
              <label for="principal" class="block text-sm font-medium text-gray-700">Principal Amount:</label>
              <div class="mt-1">
                <input
                  type="text"
                  v-model="formattedPrincipal"
                  name="principal"
                  id="principal"
                  class="input-field w-full p-3 border border-gray-300 rounded-md bg-[#F4F5F7] focus:outline-none focus:ring-2 focus:ring-[#2F6D67]"
                  @input="formatPrincipal"
                  @blur="updatePrincipal"
                  placeholder="₦0"
                />
              </div>
            </div>

            <div>
              <label for="interestRate" class="block text-sm font-medium text-gray-700 flex items-center">
                Interest Rate
                <InfoTooltip message="The annual interest rate for this investment product." />
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  v-model="formattedInterestRate"
                  id="interestRate"
                  class="block w-full pr-12 py-3 px-3 rounded-md border border-gray-300 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="0.00"
                  @input="formatInterestRate"
                  @blur="updateInterestRate"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Step 3: Investment Product -->
          <div v-else-if="currentStep === 2" key="step2" class="space-y-6">
            <h2 class="text-base font-medium">Investment Product</h2>
            <div v-if="!fetchingInvestmentsProducts">
              <label for="investment-product" class="block text-sm font-medium text-gray-700">Select Investment Product:</label>
              <select 
                class="w-full mt-1 p-3 border border-gray-300 rounded-md bg-[#F4F5F7] focus:outline-none focus:ring-2 focus:ring-[#2F6D67]" 
                v-model="selectedInvestmentProduct"
              >
                <option value="">Please select investment product</option>
                <option v-for="product in products" :key="product.id" :value="product">{{ product.name }}</option>
              </select>
            </div>
            <div v-else class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F6D67]"></div>
            </div>

            <!-- Product Benefits (if product is selected) -->
            <div v-if="Object.keys(selectedInvestmentProduct).length && selectedInvestmentProduct?.benefits?.length" class="border-b pb-3">
              <h3 class="font-semibold text-sm mb-2">Benefits</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p 
                  v-for="(item, idx) in selectedInvestmentProduct?.benefits" 
                  :key="idx"
                  class="text-sm text-gray-600 flex items-center gap-x-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_0_1859)">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM9.29 16.29L5.7 12.7C5.31 12.31 5.31 11.68 5.7 11.29C6.09 10.9 6.72 10.9 7.11 11.29L10 14.17L16.88 7.29C17.27 6.9 17.9 6.9 18.29 7.29C18.68 7.68 18.68 8.31 18.29 8.7L10.7 16.29C10.32 16.68 9.68 16.68 9.29 16.29Z"
                        fill="#D80032" 
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_0_1859">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  {{ item }}
                </p>
              </div>
            </div>
          </div>

          <!-- Step 4: Payment Method -->
          <div v-else-if="currentStep === 4" key="step4" class="space-y-6">
            <h2 class="text-base font-medium">Payment Method</h2>
            
            <div class="space-y-4">
              <p class="text-sm text-gray-600">Does the user have a wallet?</p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  @click="selectPaymentMethod('wallet')"
                  class="border rounded-lg p-4 cursor-pointer transition-all"
                  :class="payload.payment_method === 'wallet' ? 'border-[#2F6D67] bg-[#2F6D67]/10' : 'border-gray-300 hover:border-[#2F6D67]'"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 rounded-full bg-[#2F6D67]/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#2F6D67]">
                          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 class="font-medium">Wallet</h3>
                        <p class="text-sm text-gray-500">User has a wallet</p>
                      </div>
                    </div>
                    <div class="w-5 h-5 rounded-full border flex items-center justify-center" 
                      :class="payload.payment_method === 'wallet' ? 'border-[#2F6D67] bg-[#2F6D67]' : 'border-gray-300'"
                    >
                      <svg v-if="payload.payment_method === 'wallet'" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div 
                  @click="selectPaymentMethod('manual')"
                  class="border rounded-lg p-4 cursor-pointer transition-all"
                  :class="payload.payment_method === 'manual' ? 'border-[#2F6D67] bg-[#2F6D67]/10' : 'border-gray-300 hover:border-[#2F6D67]'"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 rounded-full bg-[#2F6D67]/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#2F6D67]">
                          <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                          <line x1="2" x2="22" y1="10" y2="10"></line>
                        </svg>
                      </div>
                      <div>
                        <h3 class="font-medium">Manual</h3>
                        <p class="text-sm text-gray-500">User does not have a wallet</p>
                      </div>
                    </div>
                    <div class="w-5 h-5 rounded-full border flex items-center justify-center" 
                      :class="payload.payment_method === 'manual' ? 'border-[#2F6D67] bg-[#2F6D67]' : 'border-gray-300'"
                    >
                      <svg v-if="payload.payment_method === 'manual'" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Optional: Assign To Field -->
              <!-- <div class="mt-6">
                <label for="assignTo" class="block text-sm font-medium text-gray-700">Assign To (Optional):</label>
                <input
                  id="assignTo"
                  v-model="payload.assignTo"
                  type="text"
                  placeholder="Enter user to assign investment to"
                  class="input-field w-full mt-1 p-3 border border-gray-300 rounded-md bg-[#F4F5F7] focus:outline-none focus:ring-2 focus:ring-[#2F6D67]"
                />
                <p class="text-xs text-gray-500 mt-1">Leave blank if not assigning to another user</p>
              </div> -->
            </div>
          </div>

          <!-- Step 5: Wealth Manager Selection -->
          <div v-else-if="currentStep === 5" key="step5" class="space-y-6">
            <h2 class="text-base font-medium">Wealth Manager Information</h2>
            
            <div class="space-y-6">
              <!-- Question about wealth manager bringing in the investment -->
              <div class="space-y-4">
                <p class="text-sm font-medium text-gray-700">Is this investment brought in by a wealth manager?</p>
                
                <div class="space-y-4">
                  <div 
                    @click="selectBroughtInByManager(true)"
                    class="border rounded-lg p-4 cursor-pointer transition-all"
                    :class="isBroughtInByManager ? 'border-[#2F6D67] bg-[#2F6D67]/10' : 'border-gray-300 hover:border-[#2F6D67]'"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full bg-[#2F6D67]/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#2F6D67]">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 class="font-medium">Yes</h3>
                          <p class="text-sm text-gray-500">A wealth manager brought in this investment</p>
                        </div>
                      </div>
                      <div class="w-5 h-5 rounded-full border flex items-center justify-center" 
                        :class="isBroughtInByManager ? 'border-[#2F6D67] bg-[#2F6D67]' : 'border-gray-300'"
                      >
                        <svg v-if="isBroughtInByManager" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    @click="selectBroughtInByManager(false)"
                    class="border rounded-lg p-4 cursor-pointer transition-all"
                    :class="isBroughtInByManager === false ? 'border-[#2F6D67] bg-[#2F6D67]/10' : 'border-gray-300 hover:border-[#2F6D67]'"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full bg-[#2F6D67]/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#2F6D67]">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            <line x1="17" y1="8" x2="22" y2="13"></line>
                            <line x1="22" y1="8" x2="17" y2="13"></line>
                          </svg>
                        </div>
                        <div>
                          <h3 class="font-medium">No</h3>
                          <p class="text-sm text-gray-500">This investment was not brought in by a wealth manager</p>
                        </div>
                      </div>
                      <div class="w-5 h-5 rounded-full border flex items-center justify-center" 
                        :class="isBroughtInByManager === false ? 'border-[#2F6D67] bg-[#2F6D67]' : 'border-gray-300'"
                      >
                        <svg v-if="isBroughtInByManager === false" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Conditional Wealth Manager Selection -->
              <div v-if="isBroughtInByManager !== null" class="mt-6">
                <div v-if="!fetchingWealthManagers">
                  <!-- If brought in by wealth manager -->
                  <div v-if="isBroughtInByManager">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Select Wealth Manager who brought in this investment
                    </label>
                    <div class="relative">
                      <select
                        v-model="payload.wealthManagerId"
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
                  
                  <!-- If not brought in by wealth manager -->
                  <div v-else>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Select Wealth Manager to assign this investment to
                    </label>
                    <div class="relative">
                      <select
                        v-model="payload.assignTo"
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
                <div v-else class="flex justify-center items-center py-4">
                  <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2F6D67]"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 6: Configuration -->
          <div v-else-if="currentStep === 6" key="step6" class="space-y-6">
            <h2 class="text-base font-medium">Investment Configuration</h2>
            
            <div v-if="Object.keys(selectedInvestmentProduct).length">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Interest Payment Option</label>
                <select 
                  v-model="payload.interestPaymentSchedule"
                  class="w-full p-3 border border-gray-300 rounded-md bg-[#F4F5F7] focus:outline-none focus:ring-2 focus:ring-[#2F6D67]"
                >
                  <option value="">Please select an Interest payment option</option>
                  <option 
                    :value="item" 
                    v-for="(item, idx) in selectedInvestmentProduct?.interestPaymentSchedule" 
                    :key="idx"
                  >
                    {{ item }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tenor: {{ payload.tenor }} months
                </label>
                <div class="px-2">
                  <input
                    v-model="payload.tenor"
                    type="range"
                    min="3"
                    max="24"
                    step="1"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>3</span>
                    <span>12</span>
                    <span>24</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-red-500">
              Please select an investment product first
            </div>
          </div>

          <!-- Step 7: Review and Submit -->
          <div v-else-if="currentStep === 7" key="step7" class="space-y-10 text-sm">
            <h2 class="text-base font-medium">Review Your Investment</h2>
            
            <div class="bg-gray-50 p-4 rounded-lg space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Email:</span>
                <span class="font-medium">{{ payload.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Name:</span>
                <span class="font-medium">{{ payload.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Principal Amount:</span>
                <span class="font-medium">{{ formattedPrincipal }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Investment Product:</span>
                <span class="font-medium">{{ selectedInvestmentProduct?.name || 'Not selected' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Interest Rate:</span>
                <span class="font-medium">{{ payload.interestRate || 'Not selected' }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Payment Method:</span>
                <span class="font-medium">{{ payload.payment_method === 'wallet' ? 'Wallet' : 'Manual' }}</span>
              </div>
              <div class="flex justify-between" v-if="payload.assignTo">
                <span class="text-gray-600">Assigned To User:</span>
                <span class="font-medium">{{ payload.assignTo }}</span>
              </div>
              <div class="flex justify-between" v-if="isBroughtInByManager">
                <span class="text-gray-600">Brought in by Wealth Manager:</span>
                <span class="font-medium">{{ getWealthManagerName(payload.wealthManagerId) }}</span>
              </div>
              <div class="flex justify-between" v-else>
                <span class="text-gray-600">Assigned to Wealth Manager:</span>
                <span class="font-medium">{{ getWealthManagerName(payload.assignTo) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Interest Payment:</span>
                <span class="font-medium">{{ payload.interestPaymentSchedule || 'Not selected' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tenor:</span>
                <span class="font-medium">{{ payload.tenor || 'Not selected' }} months</span>
              </div>
            </div>
          </div>
        </transition>

        <!-- Navigation Buttons -->
        <div class="flex justify-between pt-6">
          <button 
            type="button" 
            v-if="currentStep > 1" 
            @click="prevStep"
            class="px-6 py-3 border border-[#2F6D67] text-[#2F6D67] rounded-md hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button 
            type="button" 
            v-if="currentStep === 1" 
            @click="cancelProcess"
            class="px-6 py-3 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
          
          <button 
            type="button" 
            v-if="currentStep < totalSteps" 
            @click="nextStep"
            class="px-6 py-3 bg-[#2F6D67] text-white rounded-md hover:bg-[#265652] transition-colors"
            :disabled="!canProceed"
          >
            Next
          </button>
          
          <button 
            type="submit" 
            v-else 
            class="px-6 py-3 bg-[#2F6D67] text-white rounded-md hover:bg-[#265652] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="creating || !isFormValid"
          >
            {{ creating ? 'Processing...' : 'Submit' }}
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
 import { useFetchWealthManagers } from '@/composables/modules/wealth-managers/useFetchWealthManagers';
import { useCreateInvestment } from '@/composables/modules/investments/useCreateInvestment';
import { useFetchInvestmentProducts } from '@/composables/modules/investment-products/useFetchInvestmentProducts';
import { ref, computed, watch, onMounted } from 'vue';

const emit = defineEmits(['cancel']);

const { payload, loading: creating, createInvestment } = useCreateInvestment();
const { investmentProducts: products, loading: fetchingInvestmentsProducts } = useFetchInvestmentProducts();
const { wealthManagersList: wealthManagers, loading: fetchingWealthManagers } = useFetchWealthManagers()

const selectedInvestmentProduct = ref({});
const formattedPrincipal = ref('');
const paymentMethods = ref(['manual', 'wallet']);
const tenorValue = ref(3);
const maxTenorValue = ref(24);
const formattedInterestRate = ref('');
const isBroughtInByManager = ref(null); // null = not selected, true = yes, false = no
const principalError = ref('');
const principalAmount = ref(0); // New ref for tracking principal

// Multi-step form management
const currentStep = ref(1);
const totalSteps = 7; // Increased from 6 to 7 to accommodate the new wealth manager selection step
const stepTitles = [
  'Basic Information',
  'Investment Product',
  'Investment Amount',
  'Payment Method',
  'Wealth Manager',
  'Configuration',
  'Review'
];

// Initialize payment_method in payload
if (!payload.value.payment_method) {
  payload.value.payment_method = '';
}

// Function to select payment method
const selectPaymentMethod = (method: string) => {
  payload.value.payment_method = method;
};

// Function to select whether investment was brought in by wealth manager
const selectBroughtInByManager = (value: boolean) => {
  isBroughtInByManager.value = value;
  
  // Clear the fields that are not applicable based on selection
  if (value) {
    // If brought in by wealth manager, use wealthManagerId and clear assignTo
    payload.value.assignTo = '';
  } else {
    // If not brought in by wealth manager, use assignTo and clear wealthManagerId
    payload.value.wealthManagerId = '';
  }
};

// Get wealth manager name by ID
const getWealthManagerName = (id: string) => {
  if (!id) return 'Not selected';
  const manager = wealthManagers.value.find(m => m.id === id);
  return manager ? `${manager.firstName} ${manager.lastName}` : 'Unknown';
};

// Format the Principal value for display (currency format)
const formatPrincipal = () => {
  // Remove non-numeric characters and format the value with commas
  const numericValue = formattedPrincipal.value.replace(/[^0-9]/g, '');
  formattedPrincipal.value = numericValue
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') // Add commas for thousands
    .replace(/^/, '₦'); // Add currency symbol at the beginning
};

// Update the principal value on payload when the user finishes editing (on blur)
const updatePrincipal = () => {
  const rawValue = formattedPrincipal.value.replace(/[^\d.-]/g, ''); // Remove non-numeric characters
  const amount = parseFloat(rawValue); // Convert to a number
  
  payload.value.principal = amount;
  principalAmount.value = amount; // Update our tracking ref
  
  // Validate minimum investment amount
  validateMinimumInvestment();
};

// Validate principal against minimum investment amount
const validateMinimumInvestment = () => {
  principalError.value = '';
  
  if (selectedInvestmentProduct.value && 
      selectedInvestmentProduct.value.minInvestment && 
      principalAmount.value > 0) {
    
    const minInvestment = parseFloat(selectedInvestmentProduct.value.minInvestment);
    
    if (principalAmount.value < minInvestment) {
      principalError.value = `Principal amount must not be below the minimum investment of ₦${minInvestment.toLocaleString()}`;
    }
  }
};

// Watch for changes in selectedInvestmentProduct
watch(selectedInvestmentProduct, (newValue) => {
  if (newValue && newValue.id) {
    payload.value.productId = newValue.id;
    
    // When investment product changes, validate minimum investment amount
    validateMinimumInvestment();
  }
}, { deep: true });

// Watch for changes in principalAmount
watch(principalAmount, () => {
  validateMinimumInvestment();
});

// Validation for each step
const isStep1Valid = computed(() => {
  return payload.value.email;
  //  && payload.value.name;
});

const isStep3Valid = computed(() => {
  // Check both that principal exists and is above minimum investment if applicable
  return principalAmount.value > 0 && principalError.value === '';
});

const isStep2Valid = computed(() => {
  return selectedInvestmentProduct.value && selectedInvestmentProduct.value.id;
});

const isStep4Valid = computed(() => {
  return payload.value.payment_method; // Payment method is required
});

const isStep5Valid = computed(() => {
  // Check if wealth manager selection is valid based on the selection
  if (isBroughtInByManager.value === null) {
    return false; // User hasn't made a selection yet
  }
  
  return isBroughtInByManager.value 
    ? !!payload.value.wealthManagerId // If brought in by manager, wealthManagerId is required
    : !!payload.value.assignTo; // If not brought in by manager, assignTo is required
});

const isStep6Valid = computed(() => {
  return (
    payload.value.interestPaymentSchedule &&
    payload.value.tenor
  );
});

const isFormValid = computed(() => {
  return isStep1Valid.value && 
         isStep2Valid.value && 
         isStep3Valid.value && 
         isStep4Valid.value &&
         isStep5Valid.value &&
         isStep6Valid.value;
});

// Determine if user can proceed to next step
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return isStep1Valid.value;
    case 2:
      return isStep2Valid.value;
    case 3:
      return isStep3Valid.value;
    case 4:
      return isStep4Valid.value;
    case 5:
      return isStep5Valid.value;
    case 6:
      return isStep6Valid.value;
    default:
      return true;
  }
});

// Navigation functions
const nextStep = () => {
  if (currentStep.value < totalSteps && canProceed.value) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const cancelProcess = () => {
  // Reset the form
  payload.value = {
    email: '',
    name: '',
    principal: 0,
    productId: '',
    automatedFrequency: '',
    interestPaymentSchedule: '',
    payment_method: '',
    assignTo: '',
    wealthManagerId: '',
    tenor: 3
  };
  formattedPrincipal.value = '';
  selectedInvestmentProduct.value = {};
  isBroughtInByManager.value = null;
  principalError.value = '';
  principalAmount.value = 0;
  
  // Emit cancel event
  emit('cancel');
};

const handleSubmit = async (e: Event) => {   
  e.preventDefault();   
  
  if (isFormValid.value) {     
    // Before submitting, ensure we're not sending both wealthManagerId and assignTo     
    if (isBroughtInByManager.value === false) {       
      payload.value.wealthManagerId = '';     
    } else {       
      payload.value.assignTo = '';     
    }
    
    // Remove assignTo if it's an empty string
    if (payload.value.assignTo === '') {
      delete payload.value.assignTo;
    }

    // Remove wealthManagerId if it's an empty string
    if (payload.value.wealthManagerId === '') {
      delete payload.value.wealthManagerId;
    }
    
    const res = await createInvestment();   
    if(res){
      emit('cancel')
    }
  }
};

const formatInterestRate = () => {
  const numericValue = formattedInterestRate.value.replace(/[^0-9.]/g, '');
  formattedInterestRate.value = numericValue;
};

const updateInterestRate = () => {
  const rawValue = formattedInterestRate.value.replace(/[^\d.-]/g, '');
  payload.value.interestRate = Math.min(parseFloat(rawValue), 100);
};

// Run initial validation if there's already a principal value
onMounted(() => {
  if (payload.value.principal) {
    principalAmount.value = payload.value.principal;
    validateMinimumInvestment();
  }
});
</script>

<style scoped>
/* Transition animations */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Remove the number input caret (spinners) */
input[type="number"].no-caret::-webkit-inner-spin-button,
input[type="number"].no-caret::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"].no-caret {
  -moz-appearance: textfield; /* Firefox */
}
</style>