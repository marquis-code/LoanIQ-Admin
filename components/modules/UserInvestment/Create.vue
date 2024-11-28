<template>
    <main>
      <div class="p-6 max-w-4xl space-y-8 bg-white rounded-lg">
       <p class="">Create Investment</p>
        <section class="lg:flex gap-x-10 space-y-6 lg:space-y-0">
          <form @submit="createInvestment" class="lg:w-6/12 space-y-6">
            <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
            <input
              id="email"
              v-model="payload.email"
              type="email"
              placeholder="Enter email"
              class="input-field"
            />
          </div>

            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
              <input
                  id="name"
                  v-model="payload.name"
                  type="text"
                  placeholder="Enter investment name"
                  class="input-field"
              />
            </div>

            <div class="w-full">
              <label for="principal" class="input-label text-sm">Principal</label>
              <div class="mt-1">
                <input
                    type="text"
                    v-model="formattedPrincipal"
                    name="principal"
                    id="principal"
                    class="input-field"
                    @input="formatPrincipal"
                    @blur="updatePrincipal"
                />
              </div>
            </div>

          <div v-if="!fetchingInvestmentsProducts">
            <label for="investment-product" class="block text-sm font-medium text-gray-700">Investment Product</label>
              <select class="input-field" v-model="selectedInvestmentProduct">
                <option value="">Please select investment product</option>
                <option v-for="product in products" :key="product.id" :value="product"> {{ product.name }}</option>
              </select>
         </div>

<section class="space-y-6" v-if="Object.keys(selectedInvestmentProduct).length">
  <div class="border-b pb-3">
    <h3 class="font-semibold text-sm mb-2">Benefits</h3>
    <div class="grid grid-cols-2 gap-4">
      <p v-for="(item, idx) in selectedInvestmentProduct?.benefits" :key="idx"
         class="text-sm text-gray-600 flex items-center gap-x-2"><svg width="24" height="24" viewBox="0 0 24 24"
                                                                      fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_0_1859)">
          <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM9.29 16.29L5.7 12.7C5.31 12.31 5.31 11.68 5.7 11.29C6.09 10.9 6.72 10.9 7.11 11.29L10 14.17L16.88 7.29C17.27 6.9 17.9 6.9 18.29 7.29C18.68 7.68 18.68 8.31 18.29 8.7L10.7 16.29C10.32 16.68 9.68 16.68 9.29 16.29Z"
              fill="#D80032" />
        </g>
        <defs>
          <clipPath id="clip0_0_1859">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
        {{ item }}</p>
    </div>
  </div>

  <div>
    <label class="text-[#7D8799] text-sm">Frequency</label>
    <select v-model="payload.automatedFrequency"
            class="w-full outline-none border-none p-2 py-4 text-sm border bg-[#F4F5F7] border-gray-300 rounded">
      <option value="">Please select Frequency</option>
      <option :value="item" v-for="(item, idx) in selectedInvestmentProduct?.automatedFrequency" :key="idx">{{ item }}
      </option>
    </select>
  </div>

  <div>
    <label class="text-[#7D8799] text-sm">Interest payment option</label>
    <select v-model="payload.interestPaymentSchedule"
            class="w-full outline-none border-none p-2 py-4 text-sm border bg-[#F4F5F7] border-gray-300 rounded">
      <option value="">Please select an Interest payment option</option>
      <option :value="item" v-for="(item, idx) in selectedInvestmentProduct?.interestPaymentSchedule" :key="idx">{{ item }}
      </option>
    </select>
  </div>

  <div>
    <label class="text-[#7D8799] text-sm">Payment Method</label>
    <select v-model="payload.paymentMethod"
            class="w-full outline-none border-none p-2 py-4 text-sm border bg-[#F4F5F7] border-gray-300 rounded">
      <option value="">Please select a payment method</option>
      <option :value="item" v-for="(item, idx) in paymentMethods" :key="idx">{{ item }}
      </option>
    </select>
  </div>
</section>

                        <div class="pt-6">
                          <button :disabled="creating"
                            class="w-full py-3.5 bg-[#2F6D67] disabled:cursor-not-allowed disabled:opacity-25 text-white rounded-md">{{ creating ? 'processing..' : 'Submit'}}</button>
                        </div>
          </form>
        </section>
    
      </div>
    </main>
    </template>

<script setup lang="ts">
import { useCreateInvestment } from '@/composables/modules/investments/useCreateInvestment'
import { useFetchInvestmentProducts } from '@/composables/modules/investment-products/useFetchInvestmentProducts';
import {ref} from "vue";
const { payload, loading: creating, createInvestment } = useCreateInvestment()
const { investmentProducts: products, loading: fetchingInvestmentsProducts } = useFetchInvestmentProducts();

const selectedInvestmentProduct = ref({})

const formattedPrincipal = ref('');

// Format the Min Investment value for display (currency format)
const formatPrincipal = () => {
  // Remove non-numeric characters and format the value with commas
  const numericValue = formattedPrincipal.value.replace(/[^0-9]/g, '');
  formattedPrincipal.value = numericValue
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') // Add commas for thousands
      .replace(/^/, '₦'); // Add currency symbol at the beginning
};

// Update the minInvestment value on payload when the user finishes editing (on blur)
const updatePrincipal = () => {
  const rawValue = formattedPrincipal.value.replace(/[^\d.-]/g, ''); // Remove non-numeric characters (currency symbol, commas)
  payload.value.principal = parseFloat(rawValue); // Convert to a number
};

const paymentMethods = ref(['manual'])

watch(selectedInvestmentProduct, () => {
  payload.value.productId = selectedInvestmentProduct?.value?.id
})
</script>

    <style>
    /* Remove the number input caret (spinners) */
    input[type="number"].no-caret::-webkit-inner-spin-button,
    input[type="number"].no-caret::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type="number"].no-caret {
      -moz-appearance: textfield; /* Firefox */
    }
    
    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #7D8799;
      cursor: pointer;
    }
    
    input[type="range"]::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #7D8799;
      cursor: pointer;
    }
    
    input[type="range"]::-ms-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #7D8799;
      cursor: pointer;
    }
    </style>