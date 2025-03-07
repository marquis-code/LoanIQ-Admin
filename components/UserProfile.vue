<script setup lang="ts">
import { computed } from 'vue'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  gender: string
  title: string
  residentialAddress: string
  stateOfOrigin: string
  stateOfResidence: string
  maritalStatus: string | null
  avatar: string
  dateOfBirth: string
  alternatePhoneNumber: string
  bvn: string
  nin: string
  KYCStatus: number
  tier: number
  dailyLimit: string
  blockStatus: boolean
  flagStatus: boolean
  loginWithFaceID?: boolean
  loginWithTouchID?: boolean
  setPin?: boolean
  accountType: string
  createdAt: string
  updatedAt: string
}

// Define props to accept user data directly
const props = defineProps({
  user: {
    type: Object as () => UserProfile,
    required: true
  },
  wallet: {
    type: Object as () => {
      accountName: string
      accountNumber: string
      bankName: string
      balance: number
      ledgerBalance: number
    },
    default: () => ({
      accountName: "",
      accountNumber: "",
      bankName: "",
      balance: 0,
      ledgerBalance: 0
    })
  },
  investmentBalance: {
    type: Number,
    default: 0
  }
})

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Profile Card -->
    <div class="rounded-lg bg-white p-6 shadow-lg border-l-4 border-indigo-500">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="h-20 w-20 overflow-hidden rounded-full bg-indigo-100 border-2 border-indigo-300">
            <!-- <img :src="user.avatar || '@/assets/icons/avatar.svg'" :alt="`${user.firstName} ${user.lastName}`" class="h-full w-full object-cover" /> -->
             <img src="@/assets/icons/avatar.svg" class="h-full w-full object-cover"  />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ user?.title }} {{ user?.firstName }} {{ user?.lastName }}
            </h1>
            <p class="text-sm text-gray-600">{{ user?.email }}</p>
            <p class="text-sm text-gray-600">{{ user?.phoneNumber }}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <span :class="{
            'bg-green-100 text-green-800 border border-green-300': !user?.blockStatus,
            'bg-red-100 text-red-800 border border-red-300': user?.blockStatus,
          }" class="rounded-full px-3 py-1 text-sm font-medium">
            {{ user?.blockStatus ? "Blocked" : "Active" }}
          </span>
          <span v-if="user?.flagStatus" class="rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 px-3 py-1 text-sm font-medium">
            Flagged
          </span>
          <span class="rounded-full bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 text-sm font-medium">
            KYC Tier {{ user?.tier }}
          </span>
          <span class="rounded-full bg-purple-100 text-purple-800 border border-purple-300 px-3 py-1 text-sm font-medium">
            {{user?.accountType}}
            <!-- {{ user.accountType.charAt(0).toUpperCase() + user.accountType.slice(1) }} -->
          </span>
        </div>
      </div>
    </div>

    <!-- Financial Summary -->
    <FinancialSummary 
      :user="user" 
      :wallet="wallet" 
      :investment-balance="investmentBalance" 
      :format-currency="formatCurrency" 
    />

    <!-- Personal Information -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="rounded-lg bg-white p-6 shadow-lg border-t-4 border-purple-500">
        <h2 class="text-xl font-semibold mb-4 text-purple-700">Personal Information</h2>
        <div class="space-y-3">
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Gender</span>
            <span class="font-medium">{{ user?.gender || 'Not Specified' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Date of Birth</span>
            <span class="font-medium">{{ user?.dateOfBirth ? formatDate(user?.dateOfBirth) : 'Not Specified' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Marital Status</span>
            <span class="font-medium">{{ user?.maritalStatus || 'Not Specified' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">State of Origin</span>
            <span class="font-medium">{{ user?.stateOfOrigin || 'Not Specified' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">State of Residence</span>
            <span class="font-medium">{{ user?.stateOfResidence || 'Not Specified' }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow-lg border-t-4 border-cyan-500">
        <h2 class="text-xl font-semibold mb-4 text-cyan-700">Contact & Address</h2>
        <div class="space-y-3">
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Primary Phone</span>
            <span class="font-medium">{{ user?.phoneNumber || 'Not Specified' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Alternate Phone</span>
            <span class="font-medium">{{ user?.alternatePhoneNumber || 'Not Specified' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Email Address</span>
            <span class="font-medium">{{ user?.email || 'Not Specified' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Residential Address</span>
            <span class="font-medium">{{ user?.residentialAddress || 'Not Specified' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Verification Information -->
    <div class="rounded-lg bg-white p-6 shadow-lg border-t-4 border-amber-500">
      <h2 class="text-xl font-semibold mb-4 text-amber-700">Verification Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-amber-50 p-4 rounded-lg">
          <span class="text-sm text-gray-500">BVN</span>
          <p class="font-medium">{{ user?.bvn || 'Not Verified' }}</p>
        </div>
        <div class="bg-amber-50 p-4 rounded-lg">
          <span class="text-sm text-gray-500">NIN</span>
          <p class="font-medium">{{ user?.nin || 'Not Verified' }}</p>
        </div>
        <div class="bg-amber-50 p-4 rounded-lg">
          <span class="text-sm text-gray-500">KYC Status</span>
          <p class="font-medium">Level {{ user?.KYCStatus || '0' }}</p>
        </div>
      </div>
    </div>

    <!-- Account Information -->
    <div class="rounded-lg bg-white p-6 shadow-lg border-t-4 border-green-500">
      <h2 class="text-xl font-semibold mb-4 text-green-700">Account Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-3">
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Account ID</span>
            <span class="font-medium">{{ user?.id || 'N/A' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Created On</span>
            <span class="font-medium">{{ user?.createdAt ? formatDate(user?.createdAt) : 'N/A' }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Last Updated</span>
            <span class="font-medium">{{ user?.updatedAt ? formatDate(user?.updatedAt) : 'N/A' }}</span>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Face ID Login:</span>
            <span :class="user?.loginWithFaceID ? 'text-green-600' : 'text-red-600'" class="font-medium">
              {{ user?.loginWithFaceID ? 'Enabled' : 'Disabled' }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Touch ID Login:</span>
            <span :class="user?.loginWithTouchID ? 'text-green-600' : 'text-red-600'" class="font-medium">
              {{ user?.loginWithTouchID ? 'Enabled' : 'Disabled' }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Transaction PIN:</span>
            <span :class="user?.setPin ? 'text-green-600' : 'text-red-600'" class="font-medium">
              {{ user?.setPin ? 'Set' : 'Not Set' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

