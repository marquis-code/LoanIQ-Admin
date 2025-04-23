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
        <transition-group name="fade" appear>
          <div 
            v-for="(stat, index) in statsData" 
            :key="stat.title" 
            class="bg-white rounded-lg shadow p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-105"
            :style="{ transitionDelay: `${index * 100}ms` }"
          >
            <h3 class="text-sm font-medium text-gray-500 mb-1">{{ stat.title }}</h3>
            <p class="text-3xl font-bold text-gray-900">{{ stat.value }}</p>
          </div>
        </transition-group>
      </div>
      
      <!-- Create Referral Code -->
      <div class="bg-white rounded-lg shadow p-6 mb-8 transform transition-all duration-300 hover:shadow-lg">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Generate New Referral Code</h2>
        
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              id="name" 
              v-model="newCode.name" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter a name for this code"
            />
          </div>
          
          <div class="flex-1">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              id="email" 
              v-model="newCode.email" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Your email address"
              type="email"
            />
          </div>
          
          <div class="flex-1">
            <label for="platform" class="block text-sm font-medium text-gray-700 mb-1">Platform</label>
            <select 
              id="platform" 
              v-model="newCode.code" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
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
              :disabled="createLoading || !isFormValid"
              class="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
            >
              <span v-if="createLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
              <span v-else>Generate Code</span>
            </button>
          </div>
        </div>
        
        <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md animate-pulse">
          {{ errorMessage }}
        </div>
        
        <transition name="fade">
          <div v-if="currentReferral" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 class="font-medium text-green-800 mb-2">Referral Code Generated!</h3>
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div class="bg-white px-4 py-2 border border-green-300 rounded font-mono text-lg">
                {{ currentReferral.code }}
              </div>
              <button 
                @click="copyToClipboard(currentReferral.code)"
                class="px-4 py-2 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition duration-200"
              >
                Copy to Clipboard
              </button>
            </div>
            <p class="mt-2 text-sm text-green-700">
              Share this code with your friends. When they sign up using this code, you'll earn rewards!
            </p>
          </div>
        </transition>
      </div>
      
      <!-- Test Referral Code -->
      <div class="bg-white rounded-lg shadow p-6 mb-8 transform transition-all duration-300 hover:shadow-lg">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Use Referral Code</h2>
        <p class="text-gray-600 mb-4">
          Enter a referral code to test it and see if it's valid.
        </p>
        
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <label for="referralCode" class="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
            <input 
              id="referralCode" 
              v-model="referralCode" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter referral code"
            />
          </div>
          
          <div class="flex-1">
            <label for="userName" class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input 
              id="userName" 
              v-model="userName" 
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter your name"
            />
          </div>
          
          <div class="md:self-end">
            <button 
              @click="handleUseReferral" 
              :disabled="updateLoading || !referralCode || !userName"
              class="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
            >
              <span v-if="updateLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
              <span v-else>Use Code</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Management Actions -->
      <div class="bg-white rounded-lg shadow p-6 mb-8 transform transition-all duration-300 hover:shadow-lg">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Manage Referral Codes</h2>
        
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <button 
              @click="refreshReferralCodes" 
              :disabled="fetchReferralCodesLoading"
              class="w-full px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
            >
              <span v-if="fetchReferralCodesLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </span>
              <span v-else>Refresh Referral Codes</span>
            </button>
          </div>
          
          <div class="flex-1">
            <button 
              @click="fetchUsersForSelectedCode" 
              :disabled="fetchReferralCodeUsersLoading || !selectedReferralCode"
              class="w-full px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
            >
              <span v-if="fetchReferralCodeUsersLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Fetching Users...
              </span>
              <span v-else>View Users for Selected Code</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Referrals List -->
      <div class="bg-white rounded-lg shadow overflow-hidden transform transition-all duration-300 hover:shadow-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">Your Referral Codes</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-if="referralCodes.length > 0">
                <tr 
                  v-for="referral in referralCodes" 
                  :key="referral.id"
                  :class="{'bg-blue-50': selectedReferralCode === referral.id}"
                  class="transition-all duration-200 hover:bg-gray-50 cursor-pointer"
                  @click="selectReferralCode(referral.id)"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ referral.code }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ referral.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ referral.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      referral.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`">
                      {{ referral.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ referral.userCount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(referral.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      @click.stop="deactivateCode(referral.id)"
                      :disabled="deactivateLoading && deactivatingId === referral.id"
                      class="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition duration-200"
                    >
                      <span v-if="deactivateLoading && deactivatingId === referral.id">
                        Deactivating...
                      </span>
                      <span v-else>
                        Deactivate
                      </span>
                    </button>
                  </td>
                </tr>
              </template>
              <tr v-if="referralCodes.length === 0 && !fetchReferralCodesLoading">
                <td colspan="7" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  No referral codes yet. Generate a code to get started!
                </td>
              </tr>
              <tr v-if="fetchReferralCodesLoading && referralCodes.length === 0">
                <td colspan="7" class="px-6 py-8 whitespace-nowrap">
                  <div class="flex justify-center items-center">
                    <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Users List (if any) -->
      <transition name="fade">
        <div v-if="users.length > 0" class="mt-8 bg-white rounded-lg shadow overflow-hidden transform transition-all duration-300 hover:shadow-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800">Users for Code: {{ selectedCodeInfo?.code }}</h2>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user.id" class="transition-all duration-200 hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ user.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(user.createdAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </transition>
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
import { ref, computed, onMounted } from 'vue';
import { useNotification } from '~/composables/useNotification';
import { 
  useCreateReferralCode 
} from '@/composables/modules/referral-codes/useCreateReferralCode';

import { 
  useUpdateReferralCode 
} from '@/composables/modules/referral-codes/useUpdateReferralCode';

import { 
  useFetchReferralCodes 
} from '@/composables/modules/referral-codes/useFetchReferralCodes';

import { 
  useFetchReferralCodeUsers 
} from '@/composables/modules/referral-codes/useFetchReferralCodeUsers';

import { 
  useDeactivateReferralCode 
} from '@/composables/modules/referral-codes/useDeactivateReferralCode';

// Destructuring from composables
const { createReferralCode, response: createResponse, loading: createLoading } = useCreateReferralCode();
const { updateReferralCode, response: updateResponse, loading: updateLoading } = useUpdateReferralCode();
const { fetchReferralCodes, referralCodes, loading: fetchReferralCodesLoading } = useFetchReferralCodes();
const { fetchReferralCodeUsers, users, loading: fetchReferralCodeUsersLoading } = useFetchReferralCodeUsers();
const { deactivateReferralCode, response: deactivateResponse, loading: deactivateLoading } = useDeactivateReferralCode();

const {
  showNotification,
  notificationMessage,
  notificationType,
  notificationTimeout,
  notify,
  hideNotification
} = useNotification();

// Local state
const errorMessage = ref('');
const currentReferral = ref(null);
const referralCode = ref('');
const userName = ref('');
const selectedReferralCode = ref('');
const deactivatingId = ref('');

// Form state for creating new code
const newCode = ref({
  name: '',
  email: '',
  code: 'facebook' // Default platform
});

// Computed properties
const isFormValid = computed(() => {
  return newCode.value.name && newCode.value.email && newCode.value.code;
});

const selectedCodeInfo = computed(() => {
  return referralCodes.value.find(code => code.id === selectedReferralCode.value);
});

const statsData = computed(() => {
  const totalCodes = referralCodes.value.length;
  const activeCodes = referralCodes.value.filter(code => code.status === 'active').length;
  const totalUsers = referralCodes.value.reduce((sum, code) => sum + code.userCount, 0);
  
  const conversionRate = totalCodes > 0 
    ? ((totalUsers / totalCodes) * 100).toFixed(1) + '%'
    : '0.0%';
  
  return [
    { title: 'Total Codes', value: totalCodes },
    { title: 'Active Codes', value: activeCodes },
    { title: 'Total Users', value: totalUsers },
    { title: 'Conversion Rate', value: conversionRate }
  ];
});

// Methods
const handleCreateReferral = async () => {
  try {
    errorMessage.value = '';
    const payload = {
      name: newCode.value.name,
      email: newCode.value.email,
      code: newCode.value.code
    };
    
    const result = await createReferralCode(payload);
    
    if (result) {
      currentReferral.value = result;
      notify({
        message: 'Referral code created successfully!',
        type: 'success'
      });
      
      // Reset form and refresh codes list
      newCode.value = { name: '', email: '', code: 'facebook' };
      refreshReferralCodes();
    }
  } catch (error) {
    errorMessage.value = error.message || 'Failed to create referral code';
    notify({
      message: errorMessage.value,
      type: 'error'
    });
  }
};

const handleUseReferral = async () => {
  try {
    const payload = {
      code: referralCode.value,
      userName: userName.value
    };
    
    const result = await updateReferralCode(payload);
    
    if (result) {
      notify({
        message: 'Referral code used successfully!',
        type: 'success'
      });
      referralCode.value = '';
      userName.value = '';
      refreshReferralCodes();
    }
  } catch (error) {
    notify({
      message: error.message || 'Failed to use referral code',
      type: 'error'
    });
  }
};

const refreshReferralCodes = async () => {
  try {
    await fetchReferralCodes();
  } catch (error) {
    notify({
      message: 'Failed to fetch referral codes',
      type: 'error'
    });
  }
};

const selectReferralCode = (id) => {
  selectedReferralCode.value = id === selectedReferralCode.value ? '' : id;
};

const fetchUsersForSelectedCode = async () => {
  if (!selectedReferralCode.value) return;
  
  try {
    await fetchReferralCodeUsers(selectedReferralCode.value);
  } catch (error) {
    notify({
      message: 'Failed to fetch users for this code',
      type: 'error'
    });
  }
};

const deactivateCode = async (id) => {
  deactivatingId.value = id;
  
  try {
    await deactivateReferralCode(id);
    
    notify({
      message: 'Referral code deactivated successfully!',
      type: 'success'
    });
    
    // Refresh the list
    await refreshReferralCodes();
  } catch (error) {
    notify({
      message: 'Failed to deactivate referral code',
      type: 'error'
    });
  } finally {
    deactivatingId.value = '';
  }
};

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Copy referral code to clipboard
const copyToClipboard = (text) => {
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

// Initial data load
onMounted(async () => {
  await refreshReferralCodes();
});

definePageMeta({
  layout: 'admin-dashboard'
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-move {
  transition: transform 0.5s;
}

/* Add a pulse animation for new code creation */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

.pulse {
  animation: pulse 1.5s infinite;
}
</style>