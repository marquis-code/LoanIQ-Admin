<template>
  <div class="max-w-6xl mx-auto p-4">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl text-[#2F6D67] font-medium">New Investment</h2>
      <button class="text-gray-500 text-lg">&times;</button>
    </div>

    <!-- Form Section -->
    <div class="bg-white rounded-lg">
      <form class="max-w-3xl border-[0.5px] space-y-7 border-gray-100 p-6 rounded-lg" @submit.prevent="handleSubmit">
        <div class="space-y-5">
          <!-- Email -->
          <div class="flex items-center gap-x-6 w-full">
            <div class="w-full">
              <label class="block text-gray-400 text-sm font-medium mb-1">Email Address *</label>
              <input type="email" placeholder="Enter email to begin"
                class="w-full py-3.5 pl-3 outline-none border-gray-100 b rounded bg-gray-100"
                v-model="formData.email" />
            </div>
            <!-- First Name -->
            <div class="w-full">
              <label class="block text-gray-400 text-sm font-medium mb-1">First Name *</label>
              <input type="text" class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"
                v-model="formData.firstName" />
            </div>
          </div>
          <div class="flex items-center gap-x-6 w-full">
            <!-- Last Name -->
            <div class="w-full">
              <label class="block text-gray-400 text-sm font-medium mb-1">Last Name *</label>
              <input type="text" class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"
                v-model="formData.lastName" />
            </div>
            <!-- Phone Number -->
            <div class="w-full">
              <label class="block text-gray-400 text-sm font-medium mb-1">Phone Number *</label>
              <input type="text" class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"
                v-model="formData.phone" />
            </div>
          </div>
          <div class="flex items-center gap-x-6 w-full">
            <!-- Alternative Phone Number -->
            <div class="w-full">
              <label class="block text-gray-400 text-sm font-medium mb-1">Alternative Phone Number</label>
              <input type="text" class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"
                v-model="formData.altPhone" />
            </div>
            <!-- Address -->
            <div class="w-full">
              <label class="block text-gray-400 text-sm font-medium mb-1">Investor's Residential Address *</label>
              <textarea class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"
                v-model="formData.address"></textarea>
            </div>
          </div>
          <div class="flex items-center gap-x-6 w-full">
            <!-- Investor's Bank -->
            <div class="w-full">
              <label class="block text-gray-400 text-sm font-medium mb-1">Investor's Bank</label>
              <select class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"
                v-model="formData.bank">
                <option>Select Bank</option>
                <option>Bank A</option>
                <option>Bank B</option>
              </select>
            </div>
            <!-- Bank Account Number -->
            <div class="w-full">
              <label class="block text-gray-400 text-sm font-medium mb-1">Bank Account Number</label>
              <input type="text" class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"
                v-model="formData.accountNumber" />
            </div>
          </div>
          <div class="flex items-center gap-x-6 w-full">
            <!-- Type of Investment -->
            <div class="w-full">
              <label class="block text-gray-400 text-sm font-medium mb-1">Type of Investment *</label>
              <select class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"
                v-model="formData.investmentType">
                <option>Select Investment</option>
                <option>Stocks</option>
                <option>Bonds</option>
              </select>
            </div>
            <!-- Investment Amount -->
            <div class="w-full">
              <label class="block text-gray-400 text-sm font-medium mb-1">Investment Amount *</label>
              <input type="number" class="w-full py-3.5 pl-3 outline-none border-gray-100 border rounded bg-gray-100"
                v-model="formData.amount" />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center">
          <button type="button" class="text-yellow-600 underline">Preview Investment Certificate</button>
          <button type="submit" class="bg-[#2F6D67] text-sm text-white px-4 py-3 rounded-lg">Submit Application</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const formData = ref({
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  altPhone: '',
  address: '',
  bank: '',
  accountNumber: '',
  investmentType: '',
  amount: 0,
});

const handleSubmit = () => {
  console.log('Submitted Data:', formData.value);
};

definePageMeta({
          layout: 'admin-dashboard',
           middleware: 'auth'
      })
</script>