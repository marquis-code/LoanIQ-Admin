<!-- pages/index.vue -->
<template>
    <div class="bg-gray-50 min-h-screen">
      <header class="bg-white shadow">
        <div class="container mx-auto px-4 py-6">
          <h1 class="text-2xl font-bold text-gray-800">Referral Dashboard</h1>
        </div>
      </header>
      
      <main class="container mx-auto px-4 py-8">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Total Referrals</h3>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalReferrals }}</p>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Pending</h3>
            <p class="text-3xl font-bold text-gray-900">{{ stats.pendingReferrals }}</p>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Completed</h3>
            <p class="text-3xl font-bold text-gray-900">{{ stats.completedReferrals }}</p>
          </div>
          
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Conversion Rate</h3>
            <p class="text-3xl font-bold text-gray-900">{{ stats.conversionRate.toFixed(1) }}%</p>
          </div>
        </div>
        
        <!-- Create Referral Code -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Generate New Referral Code</h2>
          
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <label for="platform" class="block text-sm font-medium text-gray-700 mb-1">Platform</label>
              <select 
                id="platform" 
                v-model="platform" 
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="email">Email</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div class="md:self-end">
              <button 
                @click="handleCreateReferral" 
                :disabled="isLoading"
                class="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <span v-if="isLoading">Creating...</span>
                <span v-else>Generate Code</span>
              </button>
            </div>
          </div>
          
          <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {{ error }}
          </div>
          
          <div v-if="newReferral" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 class="font-medium text-green-800 mb-2">Referral Code Generated!</h3>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div class="bg-white px-4 py-2 border border-green-300 rounded font-mono text-lg">
                {{ newReferral.code }}
              </div>
              <button 
                @click="copyToClipboard(newReferral.code)"
                class="px-4 py-2 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
              >
                Copy to Clipboard
              </button>
            </div>
            <p class="mt-2 text-sm text-green-700">
              Share this code with your friends. When they sign up using this code, you'll earn rewards!
            </p>
          </div>
        </div>
        
        <!-- Test Referral Code (In a real app, this would be on a separate signup page) -->
        <div class="bg-white rounded-lg shadow p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Test Referral Code</h2>
          <p class="text-gray-600 mb-4">
            This section is for demonstration purposes. In a real application, this would be on the signup page.
          </p>
          
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <label for="referralCode" class="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
              <input 
                id="referralCode" 
                v-model="referralCode" 
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter referral code"
              />
            </div>
            
            <div class="flex-1">
              <label for="userName" class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input 
                id="userName" 
                v-model="userName" 
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>
            
            <div class="md:self-end">
              <button 
                @click="handleUseReferral" 
                :disabled="isLoading || !referralCode || !userName"
                class="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <span v-if="isLoading">Processing...</span>
                <span v-else>Use Code</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Referrals List -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800">Your Referrals</h2>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referred User
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Created
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Used
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="referral in userReferrals" :key="referral.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ referral.code }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {{ referral.platform }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      referral.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`">
                      {{ referral.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ referral.referredUserName || 'Pending' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(referral.dateCreated) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ referral.dateUsed ? formatDate(referral.dateUsed) : 'Not used yet' }}
                  </td>
                </tr>
                <tr v-if="userReferrals.length === 0">
                  <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No referrals yet. Generate a code to get started!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <!-- Notification component -->
      <Notification
        :show="showNotification"
        :message="notificationMessage"
        :type="notificationType"
        :timeout="notificationTimeout"
        @close="hideNotification"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useReferralApi } from '~/composables/useReferralApi';
  import { useNotification } from '~/composables/useNotification';
  import type { Referral } from '~/types';
  
  const { 
    isLoading, 
    error, 
    createReferralCode, 
    useReferralCode,
    getReferralStats,
    getUserReferrals
  } = useReferralApi();
  
  const {
    showNotification,
    notificationMessage,
    notificationType,
    notificationTimeout,
    notify,
    hideNotification
  } = useNotification();
  
  const platform = ref('facebook');
  const newReferral = ref<Referral | null>(null);
  const referralCode = ref('');
  const userName = ref('');
  
  // Computed properties
  const stats = getReferralStats;
  const userReferrals = getUserReferrals;
  
  // Handle creating a new referral code
  const handleCreateReferral = async () => {
    const result = await createReferralCode(platform.value);
    if (result) {
      newReferral.value = result;
      notify({
        message: 'Referral code created successfully!',
        type: 'success'
      });
    }
  };
  
  // Handle using a referral code
  const handleUseReferral = async () => {
    const success = await useReferralCode(referralCode.value, userName.value);
    if (success) {
      notify({
        message: 'Referral code used successfully!',
        type: 'success'
      });
      referralCode.value = '';
      userName.value = '';
    } else {
      notify({
        message: error.value || 'Failed to use referral code',
        type: 'error'
      });
    }
  };
  
  // Helper function to format dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Copy referral code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        notify({
          message: 'Copied to clipboard!',
          type: 'success',
          timeout: 2000
        });
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        notify({
          message: 'Failed to copy to clipboard',
          type: 'error'
        });
      });
  };

  definePageMeta({
    layout: 'admin-dashboard'
  })
  </script>