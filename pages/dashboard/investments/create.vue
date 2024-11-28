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
<!--      <form class="max-w-3xl border-[0.5px] space-y-7 border-gray-100 rounded-lg" @submit.prevent="handleSubmit">-->
<!--        <div class="flex justify-between items-center mb-6 border-b px-6 py-4">-->
<!--      <h2 class="text-xl text-[#2F6D67] font-medium">New Investment</h2>-->
<!--    </div>-->
<!--        <div class="space-y-5 px-6">-->
<!--          <div class="flex items-center gap-x-6 w-full">-->
<!--            <div class="w-full">-->
<!--              <label class="block text-gray-400 text-sm font-medium mb-1">Email Address *</label>-->
<!--              <input type="email" placeholder="Enter email to begin"-->
<!--                class="w-full py-3.5 pl-3 outline-none border-gray-100 b rounded bg-gray-100"-->
<!--                v-model="formData.email" />-->
<!--            </div>-->
<!--            <div class="w-full">-->
<!--              <label class="block text-gray-400 text-sm font-medium mb-1">First Name *</label>-->
<!--              <input type="text" class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"-->
<!--                v-model="formData.firstName" />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="flex items-center gap-x-6 w-full">-->
<!--            <div class="w-full">-->
<!--              <label class="block text-gray-400 text-sm font-medium mb-1">Last Name *</label>-->
<!--              <input type="text" class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"-->
<!--                v-model="formData.lastName" />-->
<!--            </div>-->
<!--            <div class="w-full">-->
<!--              <label class="block text-gray-400 text-sm font-medium mb-1">Phone Number *</label>-->
<!--              <input type="text" class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"-->
<!--                v-model="formData.phone" />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="flex items-center gap-x-6 w-full">-->
<!--            <div class="w-full">-->
<!--              <label class="block text-gray-400 text-sm font-medium mb-1">Alternative Phone Number</label>-->
<!--              <input type="text" class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"-->
<!--                v-model="formData.altPhone" />-->
<!--            </div>-->
<!--            <div class="w-full">-->
<!--              <label class="block text-gray-400 text-sm font-medium mb-1">Investor's Residential Address *</label>-->
<!--              <textarea class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"-->
<!--                v-model="formData.address"></textarea>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="flex items-center gap-x-6 w-full">-->
<!--            <div class="w-full">-->
<!--              <label class="block text-gray-400 text-sm font-medium mb-1">Investor's Bank</label>-->
<!--              <select class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"-->
<!--                v-model="formData.bank">-->
<!--                <option>Select Bank</option>-->
<!--                <option>Bank A</option>-->
<!--                <option>Bank B</option>-->
<!--              </select>-->
<!--            </div>-->
<!--            <div class="w-full">-->
<!--              <label class="block text-gray-400 text-sm font-medium mb-1">Bank Account Number</label>-->
<!--              <input type="text" class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"-->
<!--                v-model="formData.accountNumber" />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="flex items-center gap-x-6 w-full">-->
<!--            <div class="w-full">-->
<!--              <label class="block text-gray-400 text-sm font-medium mb-1">Type of Investment *</label>-->
<!--              <select class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"-->
<!--                v-model="formData.investmentType">-->
<!--                <option>Select Investment</option>-->
<!--                <option>Stocks</option>-->
<!--                <option>Bonds</option>-->
<!--              </select>-->
<!--            </div>-->
<!--            <div class="w-full">-->
<!--              <label class="block text-gray-400 text-sm font-medium mb-1">Investment Amount *</label>-->
<!--              <input type="number" class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"-->
<!--                v-model="formData.amount" />-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="flex justify-between items-center p-6">-->
<!--          <button type="button" class="text-yellow-600 underline">Preview Investment Certificate</button>-->
<!--          <button type="submit" class="bg-[#2F6D67] text-sm text-white px-4 py-3 rounded-lg">Submit Application</button>-->
<!--        </div>-->
<!--      </form>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCreateInvestment } from '@/composables/modules/investments/useCreateInvestment'
const { createInvestment, loading} = useCreateInvestment()
const router = useRouter()

const handleSubmit = () => {
  console.log('Submitted Data:', formData.value);
};

definePageMeta({
          layout: 'admin-dashboard',
           middleware: 'auth'
      })
</script>