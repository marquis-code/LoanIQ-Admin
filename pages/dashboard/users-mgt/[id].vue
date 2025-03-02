<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- Breadcrumb -->
    <div class="mb-6 flex items-center text-sm text-gray-600">
      <NuxtLink to="/dashboard/users-mgt" class="hover:text-primary">Users</NuxtLink>
      <span class="mx-2">/</span>
      <span class="font-medium">{{ user?.firstName }} {{ user?.lastName }}</span>
    </div>

    <!-- User Quick Info -->
    <div v-if="!loading" class="mb-6 rounded-lg bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="h-16 w-16 overflow-hidden rounded-full bg-gray-100">
            <img src="@/assets/icons/avatar.svg" :alt="user?.firstName" class="h-full w-full object-cover" />
          </div>
          <div>
            <h1 class="text-xl font-semibold text-gray-900">
              {{ user?.firstName }} {{ user?.lastName }}
            </h1>
            <p class="text-sm text-gray-500">ID: {{ user?.id }}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <span :class="{
            'bg-green-100 text-green-800': user?.blockStatus === false,
            'bg-red-100 text-red-800': user?.blockStatus === true,
            'bg-yellow-100 text-yellow-800': user?.flagStatus === true,
          }" class="rounded-full px-3 py-1 text-sm font-medium">
            {{ user?.blockStatus ? "Blocked" : "Active" }}
            {{ user?.flagStatus ? "Flagged" : "" }}
            <!-- {{ user.status.charAt(0).toUpperCase() + user.status.slice(1) }} -->
          </span>
          <span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            KYC Tier {{ user?.tier }}
          </span>
        </div>
      </div>
    </div>
    <CoreLoader v-else class="mt-6" />

    <!-- Tabs -->
    <div class="mb-6 rounded-lg bg-white shadow-sm">
      <div class="border-b">
        <div class="flex overflow-x-auto">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="{
            'border-primary text-primary': activeTab === tab.id,
            'border-transparent text-gray-500 hover:text-gray-700':
              activeTab !== tab.id,
          }" class="flex min-w-max items-center border-b-2 px-4 py-3 text-sm font-medium focus:outline-none">
            <component :is="tab.icon" class="mr-2 h-4 w-4" />
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- User Details Tab -->
        <div v-if="activeTab === 'details'" class="space-y-6">
          <Info />
        </div>

        <!-- Transactions Tab -->
        <div v-if="activeTab === 'transactions'" class="overflow-x-auto">
          <Transactions />
        </div>

        <!-- Investments Tab -->
        <div v-if="activeTab === 'investments'" class="overflow-x-auto">
            <Investments />
        </div>

        <!-- KYC Documents Tab -->
        <div v-if="activeTab === 'kyc'" class="space-y-6">
          <KycDocuments />
        </div>

        <!-- Activity Tab -->
        <div v-if="activeTab === 'activity'" class="space-y-6">
            <SessionLogs />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import moment from "moment";
import { useGetUserDetails } from "@/composables/modules/users/useGetUserDetails";
const { user, loading } = useGetUserDetails();

import {
  User,
  Flag,
  Monitor,
  CreditCard,
  RefreshCw
} from "lucide-vue-next";


const tabs = [
  { id: "details", name: "User Details", icon: User },
  { id: "transactions", name: "Transactions", icon: CreditCard },
  { id: "investments", name: "Investments", icon: RefreshCw },
  { id: "kyc", name: "KYC Documents", icon: Flag },
  { id: "activity", name: "Activity", icon: Monitor },
];

const activeTab = ref("details");
definePageMeta({
  layout: "admin-dashboard",
  middleware: "auth",
});
</script>

<style scoped>
.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.group-hover\:rotate-y-180:hover {
  transform: rotateY(180deg);
}
</style>
