<template>
  <div class="container mx-auto p-4">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold text-[#2F6D67]">Investments</h1>
      <NuxtLink to="/dashboard/invest/create" class="bg-[#2F6D67] text-sm text-white px-4 py-3 rounded-lg">Add New</NuxtLink>
    </div>
  
    <!-- Tabs -->
    <div class="flex space-x-4 mb-4 border-b pb-2">
      <button
        v-for="status in statuses"
        :key="status"
        :class="{'bg-teal-600 text-white': activeTab === status}"
        class="px-6 py-2 text-sm rounded-md focus:outline-none"
        @click="activeTab = status"
      >
        {{ status }}
      </button>
    </div>
  
    <!-- Search and Pagination Controls -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center">
        <input
          type="text"
          placeholder="Enter Keyword"
          v-model="searchQuery"
          class="p-2 border rounded-l"
        />
        <button class="bg-orange-500 text-white p-2 rounded-r">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4h8M4 8h16M4 12h16m-6 4h6" />
          </svg>
        </button>
      </div>
    </div>
  
    <!-- Investment Table -->
    <div class="bg-white border-[0.5px] border-gray-100 rounded-lg overflow-x-auto">
      <table class="min-w-full text-left text-gray-700">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-2 text-sm px-4">Code</th>
            <th class="py-2 text-sm px-4">Investor</th>
            <th class="py-2 text-sm px-4">Amount Invested (₦)</th>
            <th class="py-2 text-sm px-4">Date Created</th>
            <th class="py-2 text-sm px-4">End Date</th>
            <th class="py-2 text-sm px-4">Days to Maturity</th>
            <th class="py-2 text-sm px-4">Interest Accrued (₦)</th>
            <th class="py-2 text-sm px-4">Status</th>
            <th class="py-2 text-sm px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="investment in filteredInvestments"
            :key="investment.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="py-4 text-sm px-4 text-orange-600">{{ investment.code }}</td>
            <td class="py-4 text-sm px-4">{{ investment.investor }}</td>
            <td class="py-4 text-sm px-4">{{ investment.amountInvested.toLocaleString() }}</td>
            <td class="py-4 text-sm px-4">{{ investment.dateCreated }}</td>
            <td class="py-4 text-sm px-4">{{ investment.endDate }}</td>
            <td class="py-4 text-sm px-4">{{ investment.daysToMaturity }} days</td>
            <td class="py-4 text-sm px-4">{{ investment.interestAccrued.toLocaleString() }}</td>
            <td class="py-4 text-sm px-4">
              <span
                class="px-4 text-sm py-1 rounded-full text-sm font-semibold"
                :class="{
                  'bg-yellow-200 text-yellow-800': investment.status === 'Active',
                  'bg-red-200 text-red-800': investment.status === 'Terminated',
                  'bg-gray-200 text-gray-800': investment.status === 'Deactivated'
                }"
              >
                {{ investment.status }}
              </span>
            </td>
            <td class="py-4 text-sm px-4">
              <button @click="openModal(investment)" class="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm">Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Investment Details Modal -->
    <ModalsInvestmentDetails
      :isOpen="isModalOpen"
      :investment="selectedInvestment"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Sample statuses and data
const statuses = ['Pool', 'Active', 'Terminated', 'Deactivated'];
const activeTab = ref('Active');

// Sample investment data
const investments = ref([
  { id: 1, code: 'INV-0026', investor: 'ADEBIMPE ADEDEJI', amountInvested: 25000000, dateCreated: '08/11/2024', endDate: '05/01/2025', daysToMaturity: 55, interestAccrued: 44262.29, status: 'Active' },
  // Add more sample data as needed
]);

// Search and pagination state
const searchQuery = ref('');
const itemsPerPage = ref(10);

// Modal state
const isModalOpen = ref(false);
const selectedInvestment = ref(null);

// Functions to open and close the modal
const openModal = (investment) => {
  selectedInvestment.value = investment;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedInvestment.value = null;
};

// Filtered investments based on tab and search query
const filteredInvestments = computed(() => {
  return investments.value
    .filter(inv => (activeTab.value === 'All' || inv.status === activeTab.value))
    .filter(inv => inv.investor.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

definePageMeta({
  layout: 'admin-dashboard'
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
