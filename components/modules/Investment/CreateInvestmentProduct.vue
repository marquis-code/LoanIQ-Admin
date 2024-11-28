<template>
    <div class="space-y-10 divide-y divide-gray-900/10">
      <div class="grid grid-cols-1 gap-x-8 gap-y-8">
      <form @submit.prevent="createInvestmentProduct" class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
       <div class="px-4 py-4">
      <div class="space-y-4">
              <!-- Last Name Field -->
      <div class="">
                <label for="investment-name" class="input-label text-sm">Name</label>
                <div class="mt-1">
                  <input
                    type="text"
                    v-model="payload.name"
                    name="investment-name"
                    id="investment-name"
                    class="input-field text-sm"
                  />
                </div>
      </div>

      <div class="">
                <label for="description" class="input-label text-sm">Description</label>
                <div class="mt-1">
                  <input
                    type="text"
                    v-model="payload.description"
                    name="description"
                    id="description"
                    class="input-field text-sm"
                  />
                </div>
       </div>

      <div>
                <!-- <label for="description" class="input-label text-sm">Investment Benefits</label> -->
                <ModulesInvestmentBenefitInput :initialBenefits="benefits" @update:benefits="updateBenefits" />
                <!-- <ul class="space-y-3">
                  <li class="flex items-center gap-x-2 text-xs text-gray-500" v-for="item in payload.benefits">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#417505" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                     {{ item }}
                  </li>
                </ul> -->
      </div>


      <section class="flex w-full items-center justify-between gap-x-6">
    <!-- Min Investment Input -->
    <div class="w-full">
      <label for="minimumInvestment" class="input-label text-sm">Min Investment</label>
      <div class="mt-1">
        <input
          type="text"
          v-model="formattedMinInvestment"
          name="minimumInvestment"
          id="minimumInvestment"
          class="input-field"
          @input="formatMinInvestment"
          @blur="updateMinInvestment"
        />
      </div>
    </div>

    <!-- Interest Rate Input -->
    <div class="w-full">
      <label for="interestRate" class="input-label text-sm">Interest Rate</label>
      <div class="mt-1">
        <input
          type="text"
          v-model="formattedInterestRate"
          name="interestRate"
          id="interestRate"
          class="input-field"
          @input="formatInterestRate"
          @blur="updateInterestRate"
        />
      </div>
    </div>
  </section>

       <section class="flex w-full items-center justify-between gap-x-6">
        <!-- <div class="w-full">
                <label for="tenor" class="input-label text-sm">Tenor</label>
                <div class="mt-1">
                  <input
                    type="number"
                    v-model="payload.tenor"
                    name="tenor"
                    id="tenor"
                    class="input-field"
                  />
                </div>
              </div> -->

              <!-- <div class="w-full">
                <label for="preLiquidationFee" class="input-label text-sm">Pre Liquidation Fee</label>
                <div class="mt-1">
                  <input
                    type="number"
                    v-model="payload.preLiquidationFee"
                    name="preLiquidationFee"
                    id="preLiquidationFee"
                    class="input-field"
                  />
                </div>
              </div> -->
              <section class="flex w-full items-center justify-between gap-x-6">
    <!-- Pre Liquidation Fee Input -->
    <div class="w-full">
      <label for="preLiquidationFee" class="input-label text-sm">Pre Liquidation Fee</label>
      <div class="mt-1">
        <input
          type="text"
          v-model="formattedPreLiquidationFee"
          name="preLiquidationFee"
          id="preLiquidationFee"
          class="input-field"
          @input="formatPreLiquidationFee"
          @blur="updatePreLiquidationFee"
        />
      </div>
    </div>
  </section>
       </section>
  
       <section class="flex w-full items-center justify-between gap-x-6">
              <div class="w-full">
                <label for="flexible" class="input-label text-sm">Flexible</label>
                <div class="mt-1">
                  <label for="flexible" class="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-800">
                  <span>No</span>
                  <span class="relative">
                    <input v-model="payload.flexible" id="flexible" type="checkbox" class="hidden peer">
                    <div class="w-10 h-6 rounded-full shadow-inner dark:bg-gray-600 peer-checked:dark:bg-[#2F6D67]"></div>
                    <div class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto dark:bg-gray-100"></div>
                  </span>
                  <span>Yes</span>
                </label>
                </div>
              </div>


              <div class="w-full">
                <label for="canTopUp" class="input-label text-sm">Can Top Up</label>
                <div class="mt-1">
                  <label for="canTopUp" class="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-800">
                  <span>No</span>
                  <span class="relative">
                    <input v-model="payload.canTopUp" id="canTopUp" type="checkbox" class="hidden peer">
                    <div class="w-10 h-6 rounded-full shadow-inner dark:bg-gray-600 peer-checked:dark:bg-[#2F6D67]"></div>
                    <div class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto dark:bg-gray-100"></div>
                  </span>
                  <span>Yes</span>
                </label>
        
                </div>
              </div>
       </section>

       <div class="container mx-auto">
    <!-- TenorSlider Component -->
        <ModulesInvestmentTenorSlider @update:selectedTenor="handleTenorSelection" />

    <!-- Display selected values -->
        <!-- <div class="mt-2">
          <h3 class="font-semibold text-sm">Selected Tenor Range:</h3>
          <pre>Min Tenor: {{ selectedTenor.minTenor }}</pre>
          <pre>Max Tenor: {{ selectedTenor.maxTenor }}</pre>
        </div> -->
      </div>

       <div class="flex justify-between items-center">
          <ModulesInvestmentInterestPaymentSchedule 
            @update:selectedInterestSchedules="selectedInterestSchedules = $event"
          />

          <!-- Automated Frequency Component -->
          <ModulesInvestmentAutomatedFrequency 
            @update:selectedAutomatedFrequencies="selectedAutomatedFrequencies = $event"
          />
        </div>
        
        <div class="">
                <label for="preLiquidationFee" class="input-label text-sm">Can Withdraw early</label>
                <label for="canWithdrawEarly" class="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-800">
                  <span>No</span>
                  <span class="relative">
                    <input v-model="payload.canWithdrawEarly" id="canWithdrawEarly" type="checkbox" class="hidden peer">
                    <div class="w-10 h-6 rounded-full shadow-inner dark:bg-gray-600 peer-checked:dark:bg-[#2F6D67]"></div>
                    <div class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto dark:bg-gray-100"></div>
                  </span>
                  <span>Yes</span>
                </label>
        </div>
        
        </div>
        </div>

          <div class="flex justify-center items-center p-6">
            <button
             type="submit"
             :disabled="loading"
             class="bg-[#2F6D67] text-white disabled:cursor-not-allowed disabled:opacity-25 rounded-md text-center w-full py-3.5 font-semibold flex justify-center items-center"
        >
          {{ loading ? "Resending..." : "Submit" }}

        </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useCreateInvestmentProduct } from '@/composables/modules/investment-products/useCreateInvestmentProduct';

  // Import custom composable to handle product creation
  const { createInvestmentProduct, loading, payload } = useCreateInvestmentProduct();

  // Define reactive arrays for selected values
  const benefits = ref<string[]>([]);
  const selectedInterestSchedules = ref<string[]>([]);
  const selectedAutomatedFrequencies = ref<string[]>([]);

  // Method to update benefits
  const updateBenefits = (newBenefits: string[]) => {
    benefits.value = newBenefits;
    payload.value.benefits = benefits.value;  // Sync benefits to payload
  };

  // Reactive property for selected tenor
  const selectedTenor = ref<{ minTenor: number; maxTenor: number }>({
    minTenor: 3,
    maxTenor: 6,
  });

  // Method to handle tenor selection from the child component
  const handleTenorSelection = (tenor: { minTenor: number; maxTenor: number }) => {
    selectedTenor.value = tenor;
    payload.value.minTenor = tenor.minTenor;  // Sync minTenor to payload
    payload.value.maxTenor = tenor.maxTenor;  // Sync maxTenor to payload
  };

  // Watch for changes in selectedInterestSchedules and update payload
  watch(selectedInterestSchedules, (newSelectedInterestSchedules) => {
    payload.value.interestPaymentSchedule = newSelectedInterestSchedules;
  });

  // Watch for changes in selectedAutomatedFrequencies and update payload
  watch(selectedAutomatedFrequencies, (newSelectedAutomatedFrequencies) => {
    payload.value.automatedFrequency = newSelectedAutomatedFrequencies;
  });

  // Initialize payload values with selected schedules and frequencies
  payload.value.interestPaymentSchedule = selectedInterestSchedules.value;
  payload.value.automatedFrequency = selectedAutomatedFrequencies.value;


// Formatted values that are displayed in the input fields
const formattedMinInvestment = ref('');
const formattedInterestRate = ref('');

// Format the Min Investment value for display (currency format)
const formatMinInvestment = () => {
  // Remove non-numeric characters and format the value with commas
  const numericValue = formattedMinInvestment.value.replace(/[^0-9]/g, '');
  formattedMinInvestment.value = numericValue
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') // Add commas for thousands
    .replace(/^/, '₦'); // Add currency symbol at the beginning
};

// Update the minInvestment value on payload when the user finishes editing (on blur)
const updateMinInvestment = () => {
  const rawValue = formattedMinInvestment.value.replace(/[^\d.-]/g, ''); // Remove non-numeric characters (currency symbol, commas)
  payload.value.minInvestment = parseFloat(rawValue); // Convert to a number
};

// Format the Interest Rate value for display (percentage format)
const formatInterestRate = () => {
  // Remove non-numeric characters and format the value with percentage symbol
  const numericValue = formattedInterestRate.value.replace(/[^0-9]/g, '');
  formattedInterestRate.value = `${Math.min(parseInt(numericValue || '0'), 100)}%`; // Max percentage is 100%
};

// Update the interestRate value on payload when the user finishes editing (on blur)
const updateInterestRate = () => {
  const rawValue = formattedInterestRate.value.replace(/[^\d.-]/g, ''); // Remove non-numeric characters (percentage symbol)
  payload.value.interestRate = Math.min(parseFloat(rawValue), 100); // Ensure the percentage is not greater than 100
};

// Formatted value that is displayed in the input field
const formattedPreLiquidationFee = ref('');

// Format the Pre Liquidation Fee value for display (currency format)
const formatPreLiquidationFee = () => {
  // Remove non-numeric characters and format the value with commas and currency symbol
  const numericValue = formattedPreLiquidationFee.value.replace(/[^0-9]/g, '');
  formattedPreLiquidationFee.value = '₦' + numericValue
    .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas for thousands
};

// Update the preLiquidationFee value on payload when the user finishes editing (on blur)
const updatePreLiquidationFee = () => {
  const rawValue = formattedPreLiquidationFee.value.replace(/[^\d.-]/g, ''); // Remove non-numeric characters (currency symbol, commas)
  payload.value.preLiquidationFee = parseFloat(rawValue); // Convert to a number
};
</script>

  
<style scoped>
/* Custom input styles */
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