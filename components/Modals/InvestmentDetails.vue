<template>
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
        <div 
          class="bg-gradient-to-br from-white to-gray-50 w-11/12 md:w-[560px] p-8 rounded-2xl shadow-xl relative"
          :class="[
            'transform transition-all duration-300',
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          ]"
        >
          <!-- Header -->
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-semibold text-gray-800">Investment Details</h2>
            <button 
              @click="close"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="border rounded-full p-1" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
  
          <div class="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>
  
          <!-- Content -->
          <section class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Basic Info -->
              <div class="space-y-4">
                <div>
                  <label class="text-sm text-gray-500">Investment Name</label>
                  <p class="text-gray-900 font-medium">{{ investment?.name }}</p>
                </div>
                
                <div>
                  <label class="text-sm text-gray-500">Investor</label>
                  <p class="text-gray-900 font-medium">
                    {{ investment?.userName?.firstName }} {{ investment?.userName?.lastName }}
                  </p>
                </div>
  
                <div>
                  <label class="text-sm text-gray-500">Amount Invested</label>
                  <p class="text-gray-900 font-medium">{{ formatCurrency(investment?.amount) }}</p>
                </div>
              </div>
  
              <!-- Dates -->
              <div class="space-y-4">
                <div>
                  <label class="text-sm text-gray-500">Start Date</label>
                  <p class="text-gray-900 font-medium">
                    {{ moment(investment?.startDate).format("MMMM Do YYYY") }}
                  </p>
                </div>
  
                <div>
                  <label class="text-sm text-gray-500">Maturity Date</label>
                  <p class="text-gray-900 font-medium">
                    {{ moment(investment?.maturityDate).format("MMMM Do YYYY") }}
                  </p>
                </div>
  
                <div>
                  <label class="text-sm text-gray-500">Days to Maturity</label>
                  <p class="text-gray-900 font-medium">{{ investment?.daysToMaturity }} days</p>
                </div>
              </div>
            </div>
  
            <!-- Returns Section -->
            <div class="bg-gray-50 p-4 rounded-xl space-y-4 mt-4">
              <h3 class="text-lg font-medium text-gray-800">Returns</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-gray-500">Interest Accrued</label>
                  <p class="text-gray-900 font-medium">{{ formatCurrency(investment?.interestAccrued) }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-500">Return On Investment</label>
                  <p class="text-gray-900 font-medium">{{ formatCurrency(investment?.returnOnInvestment) }}</p>
                </div>
              </div>
            </div>
  
            <!-- Status -->
            <div class="flex items-center justify-between pt-4">
              <span class="text-sm text-gray-500">Status</span>
              <span 
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="getStatusColor"
              >
                {{ investment?.status }}
              </span>
            </div>
          </section>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup lang="ts">
  import moment from "moment";
  import { useCurrencyFormatter } from '@/composables/core/useCurrencyFormatter'
  import { defineProps, defineEmits, computed } from 'vue';
  
  const { formatCurrency } = useCurrencyFormatter()
  
  const props = defineProps({
    isOpen: Boolean,
    investment: {
      type: Object as () => any,
      required: false,
    },
  });
  
  const emits = defineEmits(['close']);
  
  const close = () => {
    emits('close');
  };
  
  const getStatusColor = computed(() => {
    switch (props.investment?.status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  });
  </script>
  
  <style scoped>
  .backdrop-blur-sm {
    backdrop-filter: blur(8px);
  }
  </style>