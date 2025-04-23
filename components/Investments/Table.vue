<template>
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Interest Rate
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Maturity Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="investment in investments" :key="investment.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ investment.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ investment.productId }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">${{ formatCurrency(investment.amount) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ investment.interestRate }}%</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ formatDate(investment.startDate) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ formatDate(investment.maturityDate) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': investment.status === 'active',
                  'bg-yellow-100 text-yellow-800': investment.status === 'pending',
                  'bg-red-100 text-red-800': investment.status === 'liquidated',
                  'bg-blue-100 text-blue-800': investment.status === 'matured'
                }"
              >
                {{ capitalizeFirstLetter(investment.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button
                  class="text-indigo-600 hover:text-indigo-900"
                  @click="viewInvestment(investment.id)"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#000000" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                </button>
                <button
                  v-if="!investment.liquidated && !investment.matured"
                  class="text-red-600 hover:text-red-900"
                  @click="liquidateInvestment(investment.id)"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#000000" viewBox="0 0 256 256"><path d="M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm-8-48A95.44,95.44,0,0,0,60.08,60.15C52.81,67.51,46.35,74.59,40,82V64a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H49c7.15-8.42,14.27-16.35,22.39-24.57a80,80,0,1,1,1.66,114.75,8,8,0,1,0-11,11.64A96,96,0,1,0,128,32Z"></path></svg>
                  <!-- Liquidate -->
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="investments?.length === 0">
            <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">
              No investments found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Investment {
    id: string;
    userId: string;
    name: string;
    productId: string;
    parentId: string | null;
    amount: string;
    topUpAmount: string;
    tenor: number;
    tenorInDays: number | null;
    interestRate: string;
    startDate: string;
    maturityDate: string;
    interestAccrued: string;
    returnOnInvestment: string;
    withholdingTax: string;
    preliquidionCharge: string;
    automatedFrequency: string;
    interestPaymentSchedule: string;
    type: string | null;
    bookedBy: string;
    lock: boolean;
    matured: boolean;
    liquidated: boolean;
    liquidatedAt: string | null;
    status: string;
    investment_approved_status: boolean;
    createdAt: string;
    updatedAt: string;
    wealthManagerId: string;
    assignedTo: string | null;
  }
  
  // Props for the component
  const props = defineProps<{
    investments: Investment[];
  }>();
  
  // Emits for action buttons
  const emit = defineEmits<{
    'view': [id: string];
    'liquidate': [id: string];
  }>();
  
  // Format currency function
  const formatCurrency = (value: string): string => {
    return parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };
  
  // Format date function
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Capitalize first letter function
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  // Function to view investment details
  const viewInvestment = (id: string) => {
    emit('view', id);
  };
  
  // Function to liquidate investment
  const liquidateInvestment = (id: string) => {
    emit('liquidate', id);
  };
  </script>