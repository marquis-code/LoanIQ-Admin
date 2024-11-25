<!-- components/InvestmentDetailsModal.vue -->
<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg shadow-lg relative">
        <!-- Close Button -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-medium">Investment Details</h2>
            <button @click="close" class="text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
    </div>
      <section class="space-y-6 mt-6">
              <!-- Modal Content -->
              <p clas=""><strong class="text-gray-800">Code:</strong> {{ investment?.code }}</p>
              <p clas=""><strong class="text-gray-800">Investor:</strong> {{ investment?.investor }}</p>
              <p clas=""><strong class="text-gray-800">Amount Invested (₦):</strong> {{ investment?.amountInvested.toLocaleString() }}</p>
              <p clas=""><strong class="text-gray-800">Date Created:</strong> {{ investment?.dateCreated }}</p>
              <p clas=""><strong class="text-gray-800">End Date:</strong> {{ investment?.endDate }}</p>
              <p clas=""><strong class="text-gray-800">Days to Maturity:</strong> {{ investment?.daysToMaturity }} days</p>
              <p clas=""><strong class="text-gray-800">Interest Accrued (₦):</strong> {{ investment?.interestAccrued.toLocaleString() }}</p>
              <p clas=""><strong class="text-gray-800">Status:</strong> {{ investment?.status }}</p>
      </section>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    isOpen: Boolean,
    investment: {
      type: Object,
      required: false,
    },
  });
  
  const emits = defineEmits(['close']);
  
  const close = () => {
    emits('close');
  };
  </script>
  
  <style scoped>
  /* Optional styling for modal */
  </style>
  