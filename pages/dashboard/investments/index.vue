<template>
  <div class="container mx-auto p-4">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Investments</h1>
      <button @click="openAddInvestmentModal = true" v-if="canCreate('investment')" class="bg-[#2F6D67] text-sm text-white px-4 py-3 rounded-lg">Add New</button>
      <!-- <NuxtLink v-if="canCreate('investment')" to="/dashboard/investments/create" class="bg-[#2F6D67] text-sm text-white px-4 py-3 rounded-lg">Add New</NuxtLink> -->
    </div>
<section class="lg:flex justify-between items-center">
  <div class="flex space-x-4 mb-4 border rounded-lg p-2">
    <button
        v-for="status in statuses"
        :key="status"
        :class="{'bg-teal-600 text-white': activeTab === status}"
        class="px-6 py-2 text-sm rounded-md focus:outline-none"
        @click="handleTabChange(status)"
    >
      {{ status }}
    </button>
  </div>
</section>

    <!-- Search and Pagination Controls -->

    <!-- Investment List Component -->
    <!-- <ModulesUserInvestmentList
        v-if="canView('investment')" 
        :loading="computedLoader"
        :investments="filteredInvestments"
        @selected="handleSelected"
    /> -->
    <InvestmentsActive  @selected="handleSelected" v-if="activeTab === 'Active'" />
    <InvestmentsCompleted  @selected="handleSelected"  v-if="activeTab === 'Completed'" />
    <InvestmentsDeactivated  @selected="handleSelected"  v-if="activeTab === 'Deactivated'" />

    <!-- Investment Details Modal -->
    <ModalsInvestmentDetails
        :isOpen="isModalOpen"
        :investment="selectedInvestment"
        @close="closeModal"
    />

    <CoreBaseModal @success="openAddInvestmentModal = false" @update:show="openAddInvestmentModal = false" :show="openAddInvestmentModal">
      <ModulesUserInvestmentCreate @cancel="openAddInvestmentModal = false" />
  </CoreBaseModal>
  </div>
</template>

<script setup lang="ts">
  import { usePermissions } from '@/composables/core/usePermissions'
  const { canView, canCreate } = usePermissions()
import { ref, computed } from 'vue';
// import BaseModal from '~/components/core/BaseModal.vue';

const openAddInvestmentModal = ref(false)


// Sample statuses
const statuses = ['Active', 'Completed', 'Deactivated'];
const activeTab = ref('Active');

// State for search query and pagination
const searchQuery = ref('');
const itemsPerPage = ref(10);

// Modal state
const isModalOpen = ref(false);
const selectedInvestment = ref(null);


// Functions to handle tab change and modal
const handleTabChange = (status: string) => {
  activeTab.value = status;
};

const openModal = (investment) => {
  selectedInvestment.value = investment;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedInvestment.value = null;
};

const handleSelected = (data: any) => {
    selectedInvestment.value = data
    isModalOpen.value = true
  }


definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth',
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
