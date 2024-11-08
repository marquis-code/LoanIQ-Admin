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
                    class="input-field"
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
                    class="input-field"
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
        <div class="w-full">
                <label for="minimumInvestment" class="input-label text-sm">Min Investment</label>
                <div class="mt-1">
                  <input
                    type="number"
                    v-model="payload.minInvestment"
                    name="minimumInvestment"
                    id="minimumInvestment"
                    class="input-field"
                  />
                </div>
              </div>

              <div class="w-full">
                <label for="interestRate" class="input-label text-sm">Interest Rate</label>
                <div class="mt-1">
                  <input
                    type="number"
                    v-model="payload.interestRate"
                    name="interestRate"
                    id="interestRate"
                    class="input-field"
                  />
                </div>
              </div>
      </section>

       <section class="flex w-full items-center justify-between gap-x-6">
        <div class="w-full">
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
              </div>

              <div class="w-full">
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
              </div>
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
             class="bg-[#2F6D67] text-white rounded-md text-center w-full py-3.5 font-semibold flex justify-center items-center"
        >
          {{ loading ? "Resending..." : "Submit" }}

        </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useCreateInvestmentProduct } from '@/composables/modules/investment-products/useCreateInvestmentProduct'
  const { createInvestmentProduct, loading, payload } = useCreateInvestmentProduct()
  
  const benefits = ref<string[]>([]);

const updateBenefits = (newBenefits: string[]) => {
  benefits.value = newBenefits;
  payload.value.benefits = benefits.value
};

  </script>
  