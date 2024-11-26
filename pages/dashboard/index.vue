<template>
  <div class="container mx-auto p-4 space-y-8">
    <!-- User Profile Card -->
   <CoreHeader :user="user"  />

    <!-- Investment Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
      <div v-for="card in summaryCards" :key="card.title" class="bg-white border-[0.5px] space-y-4 border-gray-100 rounded-lg shadow-smpavarae p-4">
        <h3 class="text-[#2F6D67] font-semibold">{{ card.title }}</h3>
        
        <div class="flex gap-3 my-2 flex-wrap">
          <button
            v-for="filter in card.filters"
            :key="filter"
            :class="{ 'bg-[#2F6D67] text-white': filter === 'Today' }"
            class="px-3 py-1 rounded border border-[#2F6D67] text-gray-700 text-sm"
          >
            {{ filter }}
          </button>
        </div>

        <p class="text-gray-500">{{ card.description }}</p>
        <p class="text-2xl font-bold">₦ 0.00</p>
        <p class="text-gray-500">{{ card.subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUser } from '@/composables/auth/user'
const { user } = useUser()
import { ref } from 'vue';

const summaryCards = ref([
  {
    title: 'Active Investments',
    description: 'Active Investments',
    subtitle: '0 Active Investments',
    filters: ['Today', 'MTD', 'YTD'],
  },
  {
    title: 'Investments Awaiting Approval',
    description: 'Investments Awaiting Approval',
    subtitle: '0 Investments Awaiting Approval',
    filters: ['Today', 'MTD', 'YTD'],
  },
  {
    title: 'Liquidated Investments',
    description: 'Liquidated Investments',
    subtitle: '0 Liquidated Investments',
    filters: ['Today', 'MTD', 'YTD'],
  },
  {
    title: 'Investment Due to Mature',
    description: 'Investment Due to Mature',
    subtitle: '0 Investment due to Mature',
    filters: ['Today', 'Next Day', 'Next 7 Days', 'Next 30 Days'],
  },
  {
    title: 'Matured Investments',
    description: 'Matured Investment',
    subtitle: '0 Matured Investment',
    filters: ['Today', 'MTD', 'YTD'],
  },
]);

definePageMeta({
    layout: 'admin-dashboard',
    middleware: 'auth'
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
