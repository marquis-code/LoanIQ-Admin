<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <section class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="mb-4 md:mb-6 animate-fadeIn">
        <h1 class="text-2xl font-semibold text-gray-900">Users Management</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage and monitor user accounts, KYC status, and activities
        </p>
      </div>

      <div v-if="canCreate('user-management')" class="w-full md:w-auto animate-fadeIn" style="animation-delay: 0.2s">
        <button 
          @click="openAddUserModal = true" 
          class="w-full md:w-auto text-sm text-white bg-primary hover:bg-primary/90 transition-all duration-300 rounded-md py-2.5 px-5 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <UserPlus class="h-4 w-4" />
          Add User
        </button>
      </div>
    </section>
  
    <section v-if="users?.length && !loading" class="animate-fadeIn" style="animation-delay: 0.3s">
      <!-- Filters -->
      <div class="mb-6 grid gap-4 rounded-lg bg-white p-4 shadow-sm lg:flex lg:items-center lg:justify-between border border-gray-100">
        <div class="flex flex-1 flex-wrap gap-4">
          <!-- Search -->
          <div class="min-w-[240px] flex-1">
            <div class="relative group">
              <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors duration-200" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search users..."
                class="w-full outline-none py-3 border-[0.5px] rounded-md border-gray-300 pl-9 focus:border-primary focus:ring-primary transition-all duration-200 group-hover:border-primary/50"
              />
            </div>
          </div>
  
          <!-- Status Filter -->
          <select
            v-model="filters.status"
            class="rounded-md border-[0.5px] py-2 outline-none text-sm px-2.5 border-gray-300 focus:border-primary focus:ring-primary cursor-pointer hover:border-primary/50 transition-all duration-200"
          >
            <option value="">All Status</option>
            <option value="activated">Activated</option>
            <option value="invested">Invested</option>
            <option value="borrowed">Borrowed</option>
          </select>
  
          <!-- KYC Tier Filter -->
          <select
            v-model="filters.kycTier"
            class="rounded-md border-[0.5px] py-2 outline-none text-sm px-2.5 border-gray-300 focus:border-primary focus:ring-primary cursor-pointer hover:border-primary/50 transition-all duration-200"
          >
            <option value="">All KYC Tiers</option>
            <option value="1">Tier 1</option>
            <option value="2">Tier 2</option>
            <option value="3">Tier 3</option>
          </select>
  
          <!-- Date Range -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input
              v-model="filters.dateFrom"
              type="date"
              class="rounded-md border-[0.5px] py-2 outline-none text-sm px-2.5 border-gray-300 focus:border-primary focus:ring-primary hover:border-primary/50 transition-all duration-200"
            />
            <span class="text-gray-500 hidden sm:inline">to</span>
            <input
              v-model="filters.dateTo"
              type="date"
              class="rounded-md border-[0.5px] py-2 outline-none text-sm px-2.5 border-gray-300 focus:border-primary focus:ring-primary hover:border-primary/50 transition-all duration-200"
            />
          </div>
        </div>
  
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="resetFilters"
            class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all duration-300 hover:border-primary/50"
          >
            <RefreshCw class="mr-2 h-4 w-4" />
            Reset Filters
          </button>

          <button 
            @click="downloadAllUsers" 
            :disabled="isDownloading"
            class="download-btn flex items-center border py-2 px-4 rounded-md justify-center gap-x-2 hover:bg-gray-50 transition-all duration-300 hover:border-primary/50 bg-white shadow-sm"
          >
            <span>{{ isDownloading ? `Downloading... ${progress}%` : 'Export All Users' }}</span>
            <Download class="h-4 w-4" />
          </button>
        </div>

        <div v-if="isDownloading" class="progress-bar w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
          <div class="progress h-full bg-primary transition-all duration-300" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
  
      <!-- Users Table -->
      <div class="rounded-lg bg-white shadow-sm overflow-hidden border border-gray-100">
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
                    <button @click="sortBy(header.key)" v-if="header.sortable" class="text-gray-400 hover:text-primary transition-colors duration-200">
                      <ArrowUpDown class="h-4 w-4" />
                    </button>
                  </div>
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr 
                v-for="(user, index) in paginatedUsers" 
                :key="user.id"
                class="hover:bg-gray-50 transition-all duration-200 group"
                :class="{'animate-fadeIn': animateRows}"
                :style="{ animationDelay: `${index * 50}ms` }"
              >
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full transform group-hover:scale-105 transition-transform duration-300">
                      <img
                        src="@/assets/icons/avatar.svg"
                        :alt="user.firstName"
                        class="h-10 w-10 rounded-full"
                      />
                    </div>
                    <div class="ml-4">
                      <div class="font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
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
                <td class="whitespace-nowrap px-6 py-4">
                  <span class="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 group-hover:bg-blue-200 transition-colors duration-200">
                    Tier {{ user.tier }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    :class="{
                      'bg-red-100 text-red-800 group-hover:bg-red-200': user.blockStatus === true,
                      'bg-green-100 text-green-800 group-hover:bg-green-200': user.blockStatus === false
                    }"
                    class="rounded-full px-2 py-1 text-xs font-medium transition-colors duration-200"
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
                    class="text-primary flex items-center gap-x-2 text-sm hover:text-primary/80 transition-colors duration-200 group-hover:translate-x-1 transform"
                  >
                    <Eye class="h-4 w-4" />
                    View Details
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Pagination -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-t px-4 sm:px-6 py-3 gap-4">
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
              class="rounded-md border px-3 py-1 text-sm disabled:opacity-50 hover:bg-gray-50 transition-all duration-200 hover:border-primary/50 disabled:hover:border-gray-300"
            >
              <ChevronLeft class="h-4 w-4 inline mr-1" />
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="rounded-md border px-3 py-1 text-sm disabled:opacity-50 hover:bg-gray-50 transition-all duration-200 hover:border-primary/50 disabled:hover:border-gray-300"
            >
              Next
              <ChevronRight class="h-4 w-4 inline ml-1" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <div 
      v-else-if="!users?.length && !loading"
      class="flex mx-auto border-[0.5px] mt-5 mx-6 flex-col items-center justify-center h-64 bg-white rounded-lg animate-fadeIn shadow-sm"
    >
      <div class="flex items-center justify-center p-6 mb-4 animate-pulse">
        <img :src="dynamicIcons('illustration')" />
      </div>
      <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
        No Users Available
      </p>
    </div>
    
    <CoreLoader v-else class="mt-6" />

    <!-- Add User Modal -->
    <TransitionRoot appear :show="openAddUserModal" as="template">
      <Dialog as="div" @close="closeAddUserModal" class="relative z-50">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] mx-auto lg:w-[500px] max-w-[520px] bg-white p-6 rounded-xl shadow-xl">
                <DialogTitle class="text-lg font-medium">
                  <h1 class="text-xl font-semibold text-gray-800 text-center">Create User</h1>
                  <p class="text-sm text-gray-400 text-center mb-6">Fill in the information below to create a user</p> 
                </DialogTitle>
                
                <!-- User Creation Options -->
                <div v-if="!selectedUserCreationType" class="space-y-6 animate-fadeIn">
                  <div 
                    @click="selectUserCreationType('with-wallet')"
                    class="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
                  >
                    <div class="bg-primary/10 p-3 rounded-full">
                      <Wallet class="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-800">Create User with Wallet</h3>
                      <p class="text-sm text-gray-500">User will have a wallet for transactions</p>
                    </div>
                  </div>
                  
                  <div 
                    @click="selectUserCreationType('without-wallet')"
                    class="border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
                  >
                    <div class="bg-primary/10 p-3 rounded-full">
                      <UserCircle class="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-800">Create User without Wallet</h3>
                      <p class="text-sm text-gray-500">User will not have a wallet</p>
                    </div>
                  </div>
                </div>
                
                <!-- With Wallet Form -->
                <div v-if="selectedUserCreationType === 'with-wallet'" class="animate-slideInRight">
                  <button 
                    @click="selectedUserCreationType = null" 
                    class="mb-4 text-sm flex items-center text-gray-600 hover:text-primary transition-colors duration-200 group"
                  >
                    <ChevronLeft class="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span class="group-hover:underline">Back to options</span>
                  </button>
                  
                  <form @submit.prevent="submitUserWithWallet" class="space-y-4">
                    <div class="form-field-animation">
                      <label for="emailWithWallet" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div class="relative">
                        <Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 peer-focus:text-primary transition-colors duration-200" />
                        <input
                          id="emailWithWallet"
                          v-model="userWithWalletForm.email"
                          type="email"
                          class="peer w-full border-gray-300 border py-3 rounded-lg pl-9 pr-3 shadow-sm focus:border-primary focus:ring-primary transition-all duration-200"
                          :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': emailWithWalletError}"
                          @input="validateEmailWithWallet"
                          placeholder="user@example.com"
                        />
                      </div>
                      <p v-if="emailWithWalletError" class="mt-1 text-sm text-red-600 animate-fadeIn">{{ emailWithWalletError }}</p>
                    </div>
                    
                    <div class="form-field-animation" style="animation-delay: 0.1s">
                      <label for="phoneNumberWithWallet" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div class="relative">
                        <Phone class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 peer-focus:text-primary transition-colors duration-200" />
                        <input
                          id="phoneNumberWithWallet"
                          v-model="userWithWalletForm.phoneNumber"
                          type="text"
                          class="peer w-full border-gray-300 border py-3 rounded-lg pl-9 pr-3 shadow-sm focus:border-primary focus:ring-primary transition-all duration-200"
                          :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': phoneNumberWithWalletError}"
                          @input="validatePhoneNumberWithWallet"
                          placeholder="Enter 11-digit phone number"
                          maxlength="11"
                        />
                      </div>
                      <p v-if="phoneNumberWithWalletError" class="mt-1 text-sm text-red-600 animate-fadeIn">{{ phoneNumberWithWalletError }}</p>
                    </div>

                    <div class="form-field-animation" style="animation-delay: 0.2s">
                      <label for="bvnWithWallet" class="block text-sm font-medium text-gray-700 mb-1">BVN</label>
                      <div class="relative">
                        <CreditCard class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 peer-focus:text-primary transition-colors duration-200" />
                        <input
                          id="bvnWithWallet"
                          v-model="userWithWalletForm.bvn"
                          type="text"
                          class="peer w-full border-gray-300 border py-3 rounded-lg pl-9 pr-3 shadow-sm focus:border-primary focus:ring-primary transition-all duration-200"
                          :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': bvnWithWalletError}"
                          @input="validateBVNWithWallet"
                          placeholder="Enter 11-digit BVN"
                          maxlength="11"
                        />
                      </div>
                      <p v-if="bvnWithWalletError" class="mt-1 text-sm text-red-600 animate-fadeIn">{{ bvnWithWalletError }}</p>
                    </div>
                    
                    <div class="pt-4 form-field-animation" style="animation-delay: 0.3s">
                      <button
                        type="submit"
                        class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:scale-[1.02]"
                        :disabled="isSubmittingWithWallet || !!emailWithWalletError || !!phoneNumberWithWalletError || !!bvnWithWalletError"
                      >
                        <Loader2 v-if="isSubmittingWithWallet" class="animate-spin mr-2 h-4 w-4" />
                        {{ isSubmittingWithWallet ? 'Creating User...' : 'Create User' }}
                      </button>
                    </div>
                  </form>
                </div>
                
                <!-- Without Wallet Form -->
                <div v-if="selectedUserCreationType === 'without-wallet'" class="animate-slideInRight">
                  <button 
                    @click="selectedUserCreationType = null" 
                    class="mb-4 text-sm flex items-center text-gray-600 hover:text-primary transition-colors duration-200 group"
                  >
                    <ChevronLeft class="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
                    <span class="group-hover:underline">Back to options</span>
                  </button>
                  
                  <form @submit.prevent="submitUserWithoutWallet" class="space-y-4">
                    <div class="form-field-animation">
                      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div class="relative">
                        <Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 peer-focus:text-primary transition-colors duration-200" />
                        <input
                          id="email"
                          v-model="userWithoutWalletForm.email"
                          type="email"
                          class="peer w-full border-gray-300 border py-3 rounded-lg pl-9 pr-3 shadow-sm focus:border-primary focus:ring-primary transition-all duration-200"
                          :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': emailError}"
                          @input="validateEmail"
                          placeholder="user@example.com"
                        />
                      </div>
                      <p v-if="emailError" class="mt-1 text-sm text-red-600 animate-fadeIn">{{ emailError }}</p>
                    </div>
                    
                    <div class="form-field-animation" style="animation-delay: 0.1s">
                      <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div class="relative">
                        <Phone class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 peer-focus:text-primary transition-colors duration-200" />
                        <input
                          id="phoneNumber"
                          v-model="userWithoutWalletForm.phoneNumber"
                          type="text"
                          class="peer w-full border-gray-300 border py-3 rounded-lg pl-9 pr-3 shadow-sm focus:border-primary focus:ring-primary transition-all duration-200"
                          :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': phoneNumberError}"
                          @input="validatePhoneNumber"
                          placeholder="Enter 11-digit phone number"
                          maxlength="11"
                        />
                      </div>
                      <p v-if="phoneNumberError" class="mt-1 text-sm text-red-600 animate-fadeIn">{{ phoneNumberError }}</p>
                    </div>
                    
                    <div class="form-field-animation" style="animation-delay: 0.2s">
                      <label for="bvn" class="block text-sm font-medium text-gray-700 mb-1">BVN</label>
                      <div class="relative">
                        <CreditCard class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 peer-focus:text-primary transition-colors duration-200" />
                        <input
                          id="bvn"
                          v-model="userWithoutWalletForm.bvn"
                          type="text"
                          class="peer w-full border-gray-300 border py-3 rounded-lg pl-9 pr-3 shadow-sm focus:border-primary focus:ring-primary transition-all duration-200"
                          :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': bvnError}"
                          @input="validateBVN"
                          placeholder="Enter 11-digit BVN"
                          maxlength="11"
                        />
                      </div>
                      <p v-if="bvnError" class="mt-1 text-sm text-red-600 animate-fadeIn">{{ bvnError }}</p>
                    </div>
                    
                    <div class="pt-4 form-field-animation" style="animation-delay: 0.3s">
                      <button
                        type="submit"
                        class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:scale-[1.02]"
                        :disabled="isSubmitting || !!emailError || !!bvnError || !!phoneNumberError"
                      >
                        <Loader2 v-if="isSubmitting" class="animate-spin mr-2 h-4 w-4" />
                        {{ isSubmitting ? 'Creating User...' : 'Create User' }}
                      </button>
                    </div>
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Success Toast -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <div 
        v-if="showSuccessToast" 
        class="fixed bottom-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce-in"
      >
        <CheckCircle class="h-5 w-5 text-green-500" />
        <span>User created successfully!</span>
        <button @click="showSuccessToast = false" class="ml-2 text-green-600 hover:text-green-800 transition-colors duration-200">
          <X class="h-4 w-4" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useGetUsers } from '@/composables/modules/users/useGetUsers'
import { usePermissions } from '@/composables/core/usePermissions'
import { useCSVDownload } from '@/composables/useCSVDownload'
import { useCreateUserWithoutWallet } from "@/composables/modules/users/useCreateUserWithoutWallet"
import { useCreateUser } from "@/composables/modules/users/useCreateUser"
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue"
import {
  User,
  UserPlus,
  UserCircle,
  Flag,
  Ban,
  MapPin,
  Monitor,
  LogIn,
  CreditCard,
  Search,
  ArrowUpDown,
  RefreshCw,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Loader2,
  CheckCircle,
  X,
  Mail,
  Phone
} from "lucide-vue-next"

const { canView, canCreate } = usePermissions()
const { isDownloading, progress, downloadPaginatedCSV } = useCSVDownload()
const { createUserWithoutWallet, loading: creating } = useCreateUserWithoutWallet()
const { createUser: createUserWithWallet, loading: creatingWithWallet } = useCreateUser()
const { loading, metadata, users } = useGetUsers()

// Animation state
const animateRows = ref(false)

// Table headers configuration
const tableHeaders = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'Phone', sortable: false },
  { key: 'kycTier', label: 'KYC Tier', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'dateOnboarded', label: 'Date Onboarded', sortable: true },
]

// Modal state
const openAddUserModal = ref(false)
const selectedUserCreationType = ref<null | 'with-wallet' | 'without-wallet'>(null)

// Form state for user without wallet
const userWithoutWalletForm = ref({
  email: '',
  bvn: '',
  phoneNumber: ''
})
const emailError = ref('')
const bvnError = ref('')
const phoneNumberError = ref('')
const isSubmitting = ref(false)
const showSuccessToast = ref(false)

// Form state for user with wallet
const userWithWalletForm = ref({
  email: '',
  bvn: '',
  phoneNumber: ''
})
const emailWithWalletError = ref('')
const bvnWithWalletError = ref('')
const phoneNumberWithWalletError = ref('')
const isSubmittingWithWallet = ref(false)

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
        user.alternatePhoneNumber?.includes(query) ||
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

// Get paginated users for current page
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
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

// Modal methods
const closeAddUserModal = () => {
  openAddUserModal.value = false
  // Reset form after animation completes
  setTimeout(() => {
    selectedUserCreationType.value = null
    userWithoutWalletForm.value = { email: '', bvn: '', phoneNumber: '' }
    userWithWalletForm.value = { email: '', bvn: '', phoneNumber: '' }
    emailError.value = ''
    bvnError.value = ''
    phoneNumberError.value = ''
    emailWithWalletError.value = ''
    bvnWithWalletError.value = ''
    phoneNumberWithWalletError.value = ''
  }, 300)
}

const selectUserCreationType = (type: 'with-wallet' | 'without-wallet') => {
  selectedUserCreationType.value = type
}

// Form validation for user without wallet
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!userWithoutWalletForm.value.email) {
    emailError.value = 'Email is required'
  } else if (!emailRegex.test(userWithoutWalletForm.value.email)) {
    emailError.value = 'Please enter a valid email address'
  } else {
    emailError.value = ''
  }
}

const validateBVN = () => {
  const bvnRegex = /^\d{11}$/
  if (!userWithoutWalletForm.value.bvn) {
    bvnError.value = 'BVN is required'
  } else if (!bvnRegex.test(userWithoutWalletForm.value.bvn)) {
    bvnError.value = 'BVN must be 11 digits'
  } else {
    bvnError.value = ''
  }
}

const validatePhoneNumber = () => {
  const phoneRegex = /^\d{11}$/
  if (!userWithoutWalletForm.value.phoneNumber) {
    phoneNumberError.value = 'Phone number is required'
  } else if (!phoneRegex.test(userWithoutWalletForm.value.phoneNumber)) {
    phoneNumberError.value = 'Phone number must be 11 digits'
  } else {
    phoneNumberError.value = ''
  }
}

// Form validation for user with wallet
const validateEmailWithWallet = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!userWithWalletForm.value.email) {
    emailWithWalletError.value = 'Email is required'
  } else if (!emailRegex.test(userWithWalletForm.value.email)) {
    emailWithWalletError.value = 'Please enter a valid email address'
  } else {
    emailWithWalletError.value = ''
  }
}

const validateBVNWithWallet = () => {
  const bvnRegex = /^\d{11}$/
  if (!userWithWalletForm.value.bvn) {
    bvnWithWalletError.value = 'BVN is required'
  } else if (!bvnRegex.test(userWithWalletForm.value.bvn)) {
    bvnWithWalletError.value = 'BVN must be 11 digits'
  } else {
    bvnWithWalletError.value = ''
  }
}

const validatePhoneNumberWithWallet = () => {
  const phoneRegex = /^\d{11}$/
  if (!userWithWalletForm.value.phoneNumber) {
    phoneNumberWithWalletError.value = 'Phone number is required'
  } else if (!phoneRegex.test(userWithWalletForm.value.phoneNumber)) {
    phoneNumberWithWalletError.value = 'Phone number must be 11 digits'
  } else {
    phoneNumberWithWalletError.value = ''
  }
}

// Form submission for user without wallet
const submitUserWithoutWallet = async () => {
  validateEmail()
  validateBVN()
  validatePhoneNumber()
  
  if (emailError.value || bvnError.value || phoneNumberError.value) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    await createUserWithoutWallet({
      email: userWithoutWalletForm.value.email,
      bvn: userWithoutWalletForm.value.bvn,
      phoneNumber: userWithoutWalletForm.value.phoneNumber
    })
    
    // Close modal and show success toast
    closeAddUserModal()
    showSuccessToast.value = true
    
    // Hide toast after 5 seconds
    setTimeout(() => {
      showSuccessToast.value = false
    }, 5000)
    
  } catch (error) {
    console.error('Error creating user:', error)
    // Handle error (could add error toast here)
  } finally {
    isSubmitting.value = false
  }
}

// Form submission for user with wallet
const submitUserWithWallet = async () => {
  validateEmailWithWallet()
  validateBVNWithWallet()
  validatePhoneNumberWithWallet()
  
  if (emailWithWalletError.value || bvnWithWalletError.value || phoneNumberWithWalletError.value) {
    return
  }
  
  isSubmittingWithWallet.value = true
  
  try {
    // Submit the form data
    await createUserWithWallet({
      email: userWithWalletForm.value.email,
      bvn: userWithWalletForm.value.bvn,
      phoneNumber: userWithWalletForm.value.phoneNumber
    })
    
    // Close modal and show success toast
    closeAddUserModal()
    showSuccessToast.value = true
    
    // Hide toast after 5 seconds
    setTimeout(() => {
      showSuccessToast.value = false
    }, 5000)
    
  } catch (error) {
    console.error('Error creating user with wallet:', error)
    // Handle error (could add error toast here)
  } finally {
    isSubmittingWithWallet.value = false
  }
}

const formatHeader = (header: string): string => {
  const withSpaces = header.replace(/([A-Z])/g, ' $1')
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).trim()
}

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
    // Completion logic if needed
  }
}

// Trigger row animation when data changes
watch(() => users.value, () => {
  animateRows.value = false
  setTimeout(() => {
    animateRows.value = true
  }, 100)
})

onMounted(() => {
  // Trigger animation after initial render
  setTimeout(() => {
    animateRows.value = true
  }, 300)
})

definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth'
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out forwards;
}

.animate-slideInRight {
  animation: slideInRight 0.3s ease-out forwards;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

.form-field-animation {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  60% {
    opacity: 1;
    transform: scale(1.05) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive improvements */
@media (max-width: 640px) {
  .download-btn {
    width: 100%;
    justify-content: center;
  }
  
  .progress-bar {
    margin-top: 8px;
  }
}
</style>