<template>
  <div class="container mx-auto p-4">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold">Investments</h1>
      <NuxtLink v-if="canCreate('investment')" to="/dashboard/investments/create" class="bg-[#2F6D67] text-sm text-white px-4 py-3 rounded-lg">Add New</NuxtLink>
    </div>

    <!-- Tabs -->
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
  <div class="flex justify-between items-center mb-4">
    <div class="flex items-center">
      <input
          type="text"
          placeholder="Enter Keyword"
          v-model="searchQuery"
          class="p-2 border input-field"
      />
      <button class="bg-black text-white p-2 rounded-r">
        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </button>
    </div>
  </div>
</section>

    <!-- Search and Pagination Controls -->

    <!-- Investment List Component -->
    <ModulesUserInvestmentList
        v-if="canView('investment')" 
        :loading="computedLoader"
        :investments="filteredInvestments"
        @selected="handleSelected"
    />

    <!-- Investment Details Modal -->
    <ModalsInvestmentDetails
        v-if="canView('investment')" 
        :isOpen="isModalOpen"
        :investment="selectedInvestment"
        @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
  import { usePermissions } from '@/composables/core/usePermissions'
  const { canView, canCreate } = usePermissions()
import { useCompletedInvestments } from '@/composables/modules/investments/useCompletedInvestments'
import { useActiveInvestments } from '@/composables/modules/investments/useActiveInvestments'
import { useDeactivatedInvestments } from '@/composables/modules/investments/useDeactivatedInvestments'
import { ref, computed } from 'vue';

const { completedInvestments, loading: loadingCompleted } = useCompletedInvestments()
const { activeInvestments, loading: loadingActive } = useActiveInvestments()
const { deactivatedInvestments, loading: loadingDeactivated } = useDeactivatedInvestments()

// Sample statuses
const statuses = ['Active', 'Completed', 'Deactivated'];
const activeTab = ref('Active');

// State for search query and pagination
const searchQuery = ref('');
const itemsPerPage = ref(10);

// Modal state
const isModalOpen = ref(false);
const selectedInvestment = ref(null);

// Reactive investment data
const investments = computed(() => {
  switch (activeTab.value) {
    case 'Active':
      return activeInvestments.value;
    case 'Completed':
      return completedInvestments.value;
    case 'Deactivated':
      return deactivatedInvestments.value;
    default:
      return [];
  }
});

const computedLoader = computed(() => {
  switch (activeTab.value) {
    case 'Active':
      return loadingActive.value;
    case 'Completed':
      return loadingCompleted.value;
    case 'Deactivated':
      return loadingDeactivated.value;
    default:
      return false;
  }
});

// Filtered investments based on search query
const filteredInvestments = computed(() => {
  if(investments.value.length > 0) {
    return investments.value.filter(inv =>
        inv.investor.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
});

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
