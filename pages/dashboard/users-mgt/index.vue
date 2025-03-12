<template>
    <div class="min-h-screen bg-gray-50 p-4">
     <section class="flex justify-between items-center">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Users Management</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage and monitor user accounts, KYC status, and activities
        </p>
      </div>

      <div v-if="canCreate('user-management')" class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button @click="openAddUserModal = true" class="text-sm text-white bg-black rounded-md py-2.5 px-5">Add User</button>
      </div>
     </section>
  
      <section v-if="users?.length && !loading">
            <!-- Filters -->
            <div class="mb-6 grid gap-4 rounded-lg bg-white p-4 shadow-sm lg:flex lg:items-center lg:justify-between">
          <div class="flex flex-1 flex-wrap gap-4">
            <!-- Search -->
            <div class="min-w-[240px] flex-1">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search users..."
                  class="w-full outline-none py-3 border-[0.5px] rounded-md border-gray-300 pl-9 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
    
            <!-- Status Filter -->
            <select
              v-model="filters.status"
              class="rounded-md border-[0.5px] py-2 outline-none text-sm px-2.5 border-gray-300 focus:border-primary focus:ring-primary"
            >
              <option value="">All Status</option>
              <option value="activated">Activated</option>
              <option value="invested">Invested</option>
              <option value="borrowed">Borrowed</option>
            </select>
    
            <!-- KYC Tier Filter -->
            <select
              v-model="filters.kycTier"
              class="rounded-md border-[0.5px] py-2 outline-none text-sm px-2.5 border-gray-300 focus:border-primary focus:ring-primary"
            >
              <option value="">All KYC Tiers</option>
              <option value="1">Tier 1</option>
              <option value="2">Tier 2</option>
              <option value="3">Tier 3</option>
            </select>
    
            <!-- Date Range -->
            <div class="flex items-center gap-2">
              <input
                v-model="filters.dateFrom"
                type="date"
                class="rounded-md border-[0.5px] py-2 outline-none text-sm px-2.5 border-gray-300 focus:border-primary focus:ring-primary"
              />
              <span class="text-gray-500">to</span>
              <input
                v-model="filters.dateTo"
                type="date"
                class="rounded-md border-[0.5px] py-2 outline-none text-sm px-2.5 border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
    
          <button
            @click="resetFilters"
            class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <RefreshCw class="mr-2 h-4 w-4" />
            Reset Filters
          </button>

         <div>
          <button 
              @click="downloadAllUsers" 
              :disabled="isDownloading"
              class="download-btn flex items-center border py-3 px-4 rounded-lg justify-center gap-x-2"
            >
              {{ isDownloading ? `Downloading... ${progress}%` : 'Export All Users' }}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M216,112v96a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V112A16,16,0,0,1,56,96H80a8,8,0,0,1,0,16H56v96H200V112H176a8,8,0,0,1,0-16h24A16,16,0,0,1,216,112ZM93.66,69.66,120,43.31V136a8,8,0,0,0,16,0V43.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,69.66Z"></path></svg>
            </button>

            <div v-if="isDownloading" class="progress-bar">
              <div class="progress" :style="{ width: `${progress}%` }"></div>
            </div>
         </div>
        </div>
    
        <!-- Users Table -->
        <div class="rounded-lg bg-white shadow-sm">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="header in tableHeaders"
                    :key="header.key"
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    <div class="flex items-center gap-2">
                      {{ header.label }}
                      <button @click="sortBy(header.key)" v-if="header.sortable" class="text-gray-400 hover:text-gray-600">
                        <ArrowUpDown class="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <!-- {{usersList}} -->
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td class="whitespace-nowrap px-6 py-4">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <img
                          src="@/assets/icons/avatar.svg"
                          :alt="user.firstName"
                          class="h-10 w-10 rounded-full"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="font-medium text-gray-900">
                          {{ user.firstName }} {{ user.lastName }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ user.email }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ user.phoneNumber }}
                  </td>
                  <!-- <td class="whitespace-nowrap px-6 py-4">
                    {{ user.id }}
                  </td> -->
                  <td class="whitespace-nowrap px-6 py-4">
                    <span class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      Tier {{ user.tier }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                      <span
                        :class="{
                          'bg-red-100 text-red-800': user.blockStatus === true,
                          'bg-green-100 text-green-800': user.blockStatus === false
                        }"
                        class="rounded-full px-2 py-1 text-xs font-medium"
                      >
                        {{ user.blockStatus ? 'Blocked' : 'Active' }}
                      </span>
                    </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    {{ new Date(user.createdAt).toLocaleDateString() }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-right">
                    <NuxtLink
                      :to="`/dashboard/users-mgt/${user.id}`"
                      class="text-primary flex items-center gap-x-2 text-sm hover:text-primary/80"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      View Details
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
    
          <!-- Pagination -->
          <div class="flex items-center justify-between border-t px-6 py-3">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ paginationStart }}</span>
                to
                <span class="font-medium">{{ paginationEnd }}</span>
                of
                <span class="font-medium">{{ totalUsers }}</span>
                results
              </span>
            </div>
    
            <div class="flex items-center gap-2">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </section>
      <div v-else-if="!users?.length && !loading"
           class="flex mx-auto border-[0.5px] mt-5 mx-6 flex-col items-center justify-center h-64 bg-white rounded-lg">
        <div class="flex items-center justify-center p-6 mb-4">
          <img :src="dynamicIcons('illustration')" />
        </div>
        <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
          No Users Available
        </p>
      </div>
      <CoreLoader v-else class="mt-6" />

             <!-- OTP Modal Modal -->
    <TransitionRoot appear :show="openAddUserModal" as="template">
          <Dialog as="div" @close="openAddUserModal = false" class="relative z-50 rounded-xl">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="fixed inset-0 bg-black/80" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto rounded-xl">
              <div class="flex min-h-full items-center justify-center p-4 rounded-xl">
                <TransitionChild
                  enter="duration-300 ease-out"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="duration-200 ease-in"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] mx-auto lg:w-[500px] max-w-[5200px]  bg-white p-6">
                    <!-- <h1 class="text-xl font-semibold text-gray-800 text-center">Create User</h1>
                    <p class="text-sm text-gray-400 text-center -mt-3">Fill in the information below to create a user</p> -->
                    <DialogTitle class="text-lg font-medium">
                      <h1 class="text-xl font-semibold text-gray-800 text-center">Create User</h1>
                      <p class="text-sm text-gray-400 text-center mb-6">Fill in the information below to create a user</p> 
                     </DialogTitle>
                    <ModulesUsersCreate @success="openAddUserModal = false" />

                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
    </TransitionRoot>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useGetUsers } from '@/composables/modules/users/useGetUsers'
    import { usePermissions } from '@/composables/core/usePermissions'
    import { useCSVDownload } from '@/composables/useCSVDownload'
    const { canView, canCreate } = usePermissions()
    const { isDownloading, progress, downloadPaginatedCSV } = useCSVDownload()
    import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  User,
  Flag,
  Ban,
  MapPin,
  Monitor,
  LogIn,
  CreditCard,
  Search, ArrowUpDown,
  RefreshCw
} from "lucide-vue-next";
  // import { Search, ArrowUpDown, RefreshCw } from 'lucide-vue-next'
  
  const { loading, metadata,
    users } = useGetUsers()
  
  // Table headers configuration
  const tableHeaders = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
    // { key: 'userId', label: 'User ID', sortable: true },
    { key: 'kycTier', label: 'KYC Tier', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'dateOnboarded', label: 'Date Onboarded', sortable: true },
  ]
  
  // // Dummy users data
  const openAddUserModal = ref(false)
  
  // Filters state
  const searchQuery = ref('')
  const filters = ref({
    status: '',
    kycTier: '',
    dateFrom: '',
    dateTo: '',
  })
  
  // Sorting state
  const sortKey = ref('dateOnboarded')
  const sortOrder = ref('desc')
  
  // Pagination state
  const currentPage = ref(1)
  const itemsPerPage = 10
  
  // Computed properties
  const filteredUsers = computed(() => {
    let result = [...users.value]
  
    // Apply search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(
        user =>
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phoneNumber.includes(query) ||
          user.alternatePhoneNumber.includes(query) ||
          user.id.toLowerCase().includes(query)
      )
    }
  
    // Apply filters
    if (filters.value.status) {
      result = result.filter(user => user.blockStatus === filters.value.status)
    }
    if (filters.value.kycTier) {
      result = result.filter(user => user.tier === parseInt(filters.value.kycTier))
    }
    if (filters.value.dateFrom) {
      result = result.filter(
        user => new Date(user.createdAt) >= new Date(filters.value.dateFrom)
      )
    }
    if (filters.value.dateTo) {
      result = result.filter(
        user => new Date(user.dateOnboarded) <= new Date(filters.value.dateTo)
      )
    }
  
    // Apply sorting
    result.sort((a: any, b: any) => {
      const modifier = sortOrder.value === 'asc' ? 1 : -1
      return a[sortKey.value] > b[sortKey.value] ? modifier : -modifier
    })
  
    return result
  })
  
  const totalUsers = computed(() => filteredUsers.value.length)
  const totalPages = computed(() => Math.ceil(totalUsers.value / itemsPerPage))
  const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
  const paginationEnd = computed(() =>
    Math.min(currentPage.value * itemsPerPage, totalUsers.value)
  )
  
  // Methods
  const resetFilters = () => {
    searchQuery.value = ''
    filters.value = {
      status: '',
      kycTier: '',
      dateFrom: '',
      dateTo: '',
    }
  }
  
  const sortBy = (key: string) => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortOrder.value = 'asc'
    }
  }
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  definePageMeta({
    layout: 'admin-dashboard',
    middleware: 'auth'
})


const formatHeader = (header: string): string => {
  const withSpaces = header.replace(/([A-Z])/g, ' $1')
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).trim()
}

// // Only include specific fields
// downloadCSV(data, {
//   title: 'User Data',
//   flattenObjects: true,
//   includeFields: [
//     'id', 
//     'name', 
//     'wallet_balance', 
//     'investments_*_type',  // Include type for all investments
//     'investments_*_amount' // Include amount for all investments
//   ]
// })

// // Or use a function for more complex filtering
// downloadCSV(data, {
//   title: 'User Data',
//   flattenObjects: true,
//   includeFields: (field) => {
//     // Include all fields except email
//     if (field === 'email') return false
    
//     // Include only specific investment details
//     if (field.includes('investments') && field.includes('details')) {
//       return field.includes('company') || field.includes('issuer')
//     }

const downloadAllUsers = async () => {
  try {
    await downloadPaginatedCSV(
      '/user',
      {
        title: 'All Users',
        filename: 'all_users.csv',
        dataPath: 'data.users',
        flattenObjects: true,
        nestedDelimiter: '_',
        includeHeaders: true,
        transformHeaders: (headers) => {
          return headers.map(header => {
            if (header === 'firstName') return 'First Name'
            if (header === 'lastName') return 'Last Name'
            if (header === 'email') return 'Email'
            return formatHeader(header)
          })
        }
      },
      { sort: 'name', order: 'asc' } // Optional query parameters
    )
  } finally {
  }
}
  </script>