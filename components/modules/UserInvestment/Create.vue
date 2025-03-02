<template>
  <main class="w-full">
    <div class="">
      <h1 class="font-semibold text-lg mb-6">Create Investment</h1>
      
      <!-- Progress Bar -->
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
          <div v-else-if="currentStep === 2" key="step2" class="space-y-6">
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
          </div>

          <!-- Step 3: Investment Product -->
          <div v-else-if="currentStep === 3" key="step3" class="space-y-6">
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

          <!-- Step 4: Configuration -->
          <div v-else-if="currentStep === 4" key="step4" class="space-y-6">
            <h2 class="text-base font-medium">Investment Configuration</h2>
            
            <div v-if="Object.keys(selectedInvestmentProduct).length">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select 
                  v-model="payload.automatedFrequency"
                  class="w-full p-3 border border-gray-300 rounded-md bg-[#F4F5F7] focus:outline-none focus:ring-2 focus:ring-[#2F6D67]"
                >
                  <option value="">Please select Frequency</option>
                  <option 
                    :value="item" 
                    v-for="(item, idx) in selectedInvestmentProduct?.automatedFrequency" 
                    :key="idx"
                  >
                    {{ item }}
                  </option>
                </select>
              </div>

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
                <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select 
                  v-model="payload.paymentMethod"
                  class="w-full p-3 border border-gray-300 rounded-md bg-[#F4F5F7] focus:outline-none focus:ring-2 focus:ring-[#2F6D67]"
                >
                  <option value="">Please select a payment method</option>
                  <option 
                    :value="item" 
                    v-for="(item, idx) in paymentMethods" 
                    :key="idx"
                  >
                    {{ item }}
                  </option>
                </select>
              </div>
            </div>
            <div v-else class="text-center py-4 text-red-500">
              Please select an investment product first
            </div>
          </div>

          <!-- Step 5: Review and Submit -->
          <div v-else-if="currentStep === 5" key="step5" class="space-y-6">
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
                <span class="text-gray-600">Frequency:</span>
                <span class="font-medium">{{ payload.automatedFrequency || 'Not selected' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Interest Payment:</span>
                <span class="font-medium">{{ payload.interestPaymentSchedule || 'Not selected' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Payment Method:</span>
                <span class="font-medium">{{ payload.paymentMethod || 'Not selected' }}</span>
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
import { useCreateInvestment } from '@/composables/modules/investments/useCreateInvestment';
import { useFetchInvestmentProducts } from '@/composables/modules/investment-products/useFetchInvestmentProducts';
import { ref, computed, watch } from 'vue';

const emit = defineEmits(['cancel']);

const { payload, loading: creating, createInvestment } = useCreateInvestment();
const { investmentProducts: products, loading: fetchingInvestmentsProducts } = useFetchInvestmentProducts();

const selectedInvestmentProduct = ref({});
const formattedPrincipal = ref('');
const paymentMethods = ref(['manual']);

// Multi-step form management
const currentStep = ref(1);
const totalSteps = 5;
const stepTitles = [
  'Basic Information',
  'Investment Amount',
  'Investment Product',
  'Configuration',
  'Review'
];

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
  payload.value.principal = parseFloat(rawValue); // Convert to a number
};

// Watch for changes in selectedInvestmentProduct
watch(selectedInvestmentProduct, () => {
  if (selectedInvestmentProduct.value && selectedInvestmentProduct.value.id) {
    payload.value.productId = selectedInvestmentProduct.value.id;
  }
});

// Validation for each step
const isStep1Valid = computed(() => {
  return payload.value.email && payload.value.name;
});

const isStep2Valid = computed(() => {
  return payload.value.principal && payload.value.principal > 0;
});

const isStep3Valid = computed(() => {
  return selectedInvestmentProduct.value && selectedInvestmentProduct.value.id;
});

const isStep4Valid = computed(() => {
  return (
    payload.value.automatedFrequency &&
    payload.value.interestPaymentSchedule &&
    payload.value.paymentMethod
  );
});

const isFormValid = computed(() => {
  return isStep1Valid.value && 
         isStep2Valid.value && 
         isStep3Valid.value && 
         isStep4Valid.value;
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
  // You can customize this function based on your requirements
  // Option 1: Reset the form
  payload.value = {
    email: '',
    name: '',
    principal: 0,
    productId: '',
    automatedFrequency: '',
    interestPaymentSchedule: '',
    paymentMethod: ''
  };
  formattedPrincipal.value = '';
  selectedInvestmentProduct.value = {};
  
  // Option 2: Navigate away (uncomment one of these based on your routing setup)
  // navigateTo('/dashboard'); // For Nuxt 3 navigation
  // router.push('/dashboard'); // For Vue Router
  
  // For demo purposes, we'll just emit an event that parent components can listen to
  emit('cancel');
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  if (isFormValid.value) {
    await createInvestment();
  }
};
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

