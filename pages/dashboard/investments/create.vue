<template>
  <div class="max-w-6xl mx-auto p-4">
    <!-- Header Section -->
    <div class="bg-white rounded-lg border-[0.5px] pt-3">
      <div class="pl-4">
        <button @click="router.back()" class="bg-gray-100 rounded-full border p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>
        </button>
      </div>
      <ModulesUserInvestmentCreate />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCreateInvestment } from '@/composables/modules/investments/useCreateInvestment'
const { createInvestment, loading} = useCreateInvestment()
const router = useRouter()


definePageMeta({
          layout: 'admin-dashboard',
           middleware: 'auth'
      })
</script>