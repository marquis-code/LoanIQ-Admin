<template>
    <div class="bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <!-- Form Header -->
      <div class="bg-gray-50 p-6 rounded-t-lg border-b">
        <h2 class="text-2xl font-semibold text-gray-900">Create Investment Product</h2>
        <p class="mt-1 text-sm text-gray-600">Step {{ currentStep }} of {{ totalSteps }}</p>
      </div>
  
      <!-- Progress Bar -->
      <div class="w-full bg-gray-200 h-2">
        <div 
          class="bg-primary h-2 transition-all duration-300" 
          :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
        ></div>
      </div>
  
      <!-- Form Content -->
      <div class="p-6">
        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="space-y-4">
            <div>
              <label for="investment-name" class="block text-sm font-medium text-gray-700 flex items-center">
                Product Name
                <InfoTooltip message="Enter a unique and descriptive name for your investment product." />
              </label>
              <input
                type="text"
                v-model="payload.name"
                id="investment-name"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="e.g., High Yield Savings Plan"
              />
            </div>
            
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 flex items-center">
                Description
                <InfoTooltip message="Provide a clear and concise description of the investment product and its key features." />
              </label>
              <textarea
                v-model="payload.description"
                id="description"
                rows="4"
                class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="Describe your investment product..."
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 flex items-center">
                Investment Benefits
                <InfoTooltip message="List the key benefits that investors will gain from this product." />
              </label>
              <ModulesInvestmentBenefitInput :initialBenefits="benefits" @update:benefits="updateBenefits" />
            </div>
          </div>
        </div>
        
        <!-- Step 2: Financial Details -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="minimumInvestment" class="block text-sm font-medium text-gray-700 flex items-center">
                Min Investment
                <InfoTooltip message="The minimum amount an investor can invest in this product." />
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm">₦</span>
                </div>
                <input
                  type="text"
                  v-model="formattedMinInvestment"
                  id="minimumInvestment"
                  class="block w-full pl-7 pr-12 rounded-md border border-gray-300 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="0.00"
                  @input="formatMinInvestment"
                  @blur="updateMinInvestment"
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
                  class="block w-full pr-12 rounded-md border border-gray-300 focus:ring-primary focus:border-primary sm:text-sm"
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
          
          <div>
            <label for="preLiquidationFee" class="block text-sm font-medium text-gray-700 flex items-center">
              Pre Liquidation Fee
              <InfoTooltip message="The fee charged if an investor withdraws before the maturity date." />
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">₦</span>
              </div>
              <input
                type="text"
                v-model="formattedPreLiquidationFee"
                id="preLiquidationFee"
                class="block w-full pl-7 pr-12 rounded-md border border-gray-300 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="0.00"
                @input="formatPreLiquidationFee"
                @blur="updatePreLiquidationFee"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 flex items-center mb-2">
              Investment Tenor
              <InfoTooltip message="Set the minimum and maximum investment duration in months." />
            </label>
            <div class="space-y-4">
              <div>
                <label for="minTenor" class="block text-sm font-medium text-gray-600">Min Tenor: {{ selectedTenor.minTenor }} months</label>
                <input
                  type="range"
                  id="minTenor"
                  v-model="selectedTenor.minTenor"
                  min="1"
                  :max="selectedTenor.maxTenor"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label for="maxTenor" class="block text-sm font-medium text-gray-600">Max Tenor: {{ selectedTenor.maxTenor }} months</label>
                <input
                  type="range"
                  id="maxTenor"
                  v-model="selectedTenor.maxTenor"
                  :min="selectedTenor.minTenor"
                  max="60"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Step 3: Payment Options -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 flex items-center mb-2">
                Interest Payment Schedule
                <InfoTooltip message="Select when interest payments will be made to investors." />
              </label>
              <ModulesInvestmentInterestPaymentSchedule 
                @update:selectedInterestSchedules="selectedInterestSchedules = $event"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 flex items-center mb-2">
                Automated Frequency
                <InfoTooltip message="Choose the frequency of automated investment actions." />
              </label>
              <ModulesInvestmentAutomatedFrequency 
                @update:selectedAutomatedFrequencies="selectedAutomatedFrequencies = $event"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 flex items-center mb-2">
                Flexible
                <InfoTooltip message="Allow investors to withdraw their funds before maturity without penalties." />
              </label>
              <ToggleSwitch v-model="payload.flexible" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 flex items-center mb-2">
                Can Top Up
                <InfoTooltip message="Allow investors to add more funds to their investment after the initial deposit." />
              </label>
              <ToggleSwitch v-model="payload.canTopUp" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 flex items-center mb-2">
                Can Withdraw Early
                <InfoTooltip message="Allow investors to withdraw their funds before the maturity date, possibly with a fee." />
              </label>
              <ToggleSwitch v-model="payload.canWithdrawEarly" />
            </div>
          </div>
        </div>
      </div>
  
      <!-- Navigation Buttons -->
      <div class="flex justify-between items-center p-6 bg-gray-50 rounded-b-lg border-t">
        <button
          v-if="currentStep > 1"
          @click="prevStep"
          class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Previous
        </button>
        <div v-else></div>
        
        <button
          v-if="currentStep < totalSteps"
          @click="nextStep"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Next
        </button>
        <button
          v-else
          @click="submitForm"
          :disabled="loading"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? "Creating..." : "Create Product" }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useCreateInvestmentProduct } from '@/composables/modules/investment-products/useCreateInvestmentProduct';
  
  // Import custom components
  import InfoTooltip from '@/components/InfoTooltip.vue';
  import ToggleSwitch from '@/components/ToggleSwitch.vue';
  
  // Initialize composable
  const { createInvestmentProduct, loading, payload } = useCreateInvestmentProduct();
  
  // Form state
  const currentStep = ref(1);
  const totalSteps = 3;
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
    maxTenor: 12,
  });
  
  // Methods
  const formatMinInvestment = () => {
    const numericValue = formattedMinInvestment.value.replace(/[^0-9]/g, '');
    formattedMinInvestment.value = numericValue
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  const updateMinInvestment = () => {
    const rawValue = formattedMinInvestment.value.replace(/[^\d.-]/g, '');
    payload.value.minInvestment = parseFloat(rawValue);
  };
  
  const formatInterestRate = () => {
    const numericValue = formattedInterestRate.value.replace(/[^0-9.]/g, '');
    formattedInterestRate.value = numericValue;
  };
  
  const updateInterestRate = () => {
    const rawValue = formattedInterestRate.value.replace(/[^\d.-]/g, '');
    payload.value.interestRate = Math.min(parseFloat(rawValue), 100);
  };
  
  const formatPreLiquidationFee = () => {
    const numericValue = formattedPreLiquidationFee.value.replace(/[^0-9]/g, '');
    formattedPreLiquidationFee.value = numericValue
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  const updatePreLiquidationFee = () => {
    const rawValue = formattedPreLiquidationFee.value.replace(/[^\d.-]/g, '');
    payload.value.preLiquidationFee = parseFloat(rawValue);
  };
  
  const updateBenefits = (newBenefits: string[]) => {
    benefits.value = newBenefits;
    payload.value.benefits = benefits.value;
  };
  
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
  
  const submitForm = async () => {
    try {
      await createInvestmentProduct();
      // Handle successful creation (e.g., show success message, close modal, refresh list)
    } catch (error) {
      console.error('Error creating investment product:', error);
      // Handle error (e.g., show error message)
    }
  };
  
  // Watch for changes
  watch(selectedTenor, (newTenor) => {
    payload.value.minTenor = newTenor.minTenor;
    payload.value.maxTenor = newTenor.maxTenor;
  });
  
  watch(selectedInterestSchedules, (newSchedules) => {
    payload.value.interestPaymentSchedule = newSchedules;
  });
  
  watch(selectedAutomatedFrequencies, (newFrequencies) => {
    payload.value.automatedFrequency = newFrequencies;
  });
  </script>
  
  <style scoped>
  /* Add any additional styles here */
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #2F6D67;
    cursor: pointer;
    border-radius: 50%;
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #2F6D67;
    cursor: pointer;
    border-radius: 50%;
  }
  </style>
  
  