<template>
    <div class="space-y-10 divide-y divide-gray-900/10">
      <div class="grid grid-cols-1 gap-x-8 gap-y-8">
        <form @submit.prevent="createInvestmentProduct" class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div class="px-4 py-6 sm:p-8">
            <div class="space-y-3">
  
              <!-- Last Name Field -->
              <div class="sm:col-span-3">
                <label for="investment-name" class="input-label">Name</label>
                <div class="mt-2">
                  <input
                    type="text"
                    v-model="payload.name"
                    name="investment-name"
                    id="investment-name"
                    class="input-field"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="description" class="input-label">Description</label>
                <div class="mt-2">
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
                <label for="description" class="input-label">Investment Benefits</label>
                <ul>
                  <li v-for="item in payload.benefits">
                     {{ item }}
                  </li>
                </ul>
              </div>

              <div class="sm:col-span-3">
                <label for="minimumInvestment" class="input-label">Min Investment</label>
                <div class="mt-2">
                  <input
                    type="number"
                    v-model="payload.minInvestment"
                    name="minimumInvestment"
                    id="minimumInvestment"
                    class="input-field"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="interestRate" class="input-label">Interest Rate</label>
                <div class="mt-2">
                  <input
                    type="number"
                    v-model="payload.interestRate"
                    name="interestRate"
                    id="interestRate"
                    class="input-field"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="tenor" class="input-label">Tenor</label>
                <div class="mt-2">
                  <input
                    type="number"
                    v-model="payload.tenor"
                    name="tenor"
                    id="tenor"
                    class="input-field"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="preLiquidationFee" class="input-label">Pre Liquidation Fee</label>
                <div class="mt-2">
                  <input
                    type="number"
                    v-model="payload.preLiquidationFee"
                    name="preLiquidationFee"
                    id="preLiquidationFee"
                    class="input-field"
                  />
                </div>
              </div>
  

              <div class="sm:col-span-3">
                <label for="preLiquidationFee" class="input-label">Flexible</label>
                <div class="mt-2">
                  <input
                    type="number"
                    v-model="payload.preLiquidationFee"
                    name="preLiquidationFee"
                    id="preLiquidationFee"
                    class="input-field"
                  />
                </div>
              </div>


              <div class="sm:col-span-3">
                <label for="preLiquidationFee" class="input-label">Can Top Up</label>
                <div class="mt-2">
                  <input
                    type="number"
                    v-model="payload.preLiquidationFee"
                    name="preLiquidationFee"
                    id="preLiquidationFee"
                    class="input-field"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="preLiquidationFee" class="input-label">Can Withdraw early</label>
                <div class="mt-2">
                  <input
                    type="number"
                    v-model="payload.preLiquidationFee"
                    name="preLiquidationFee"
                    id="preLiquidationFee"
                    class="input-field"
                  />
                </div>
              </div>
        
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useCreateInvestmentProduct } from '@/composables/modules/investment-products/useCreateInvestmentProduct'
  import { ref, computed, watch } from 'vue';
  const { createInvestmentProduct, loading, payload } = useCreateInvestmentProduct()
  

  </script>
  