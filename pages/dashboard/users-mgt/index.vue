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
      <div class="rounded-lg bg-white shadow-sm overflow-hidden border border-gray-100 relative">
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
                <td class="whitespace-nowrap px-6 py-4 text-right relative">
                  <div class="flex justify-end">
                    <button 
                      @click.stop="toggleActionMenu(user.id, $event)"
                      class="action-button text-gray-500 hover:text-primary transition-colors duration-200 p-1 rounded-md hover:bg-gray-100"
                      :data-user-id="user.id"
                    >
                      <MoreHorizontal class="h-5 w-5" :class="{ 'text-primary': openActionMenu === user.id }" />
                    </button>
                  </div>
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

    <!-- Action Dropdowns - Using Teleport to render outside the table -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="openActionMenu !== null && dropdownPosition" 
          class="action-dropdown fixed bg-white rounded-md shadow-xl ring-1 ring-black ring-opacity-5 z-[100] w-48"
          :style="dropdownPosition"
        >
          <div class="py-1 divide-y divide-gray-100">
            <NuxtLink
              :to="`/dashboard/users-mgt/${getSelectedUser?.id}`"
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-all duration-200 group cursor-pointer"
              @click.stop
            >
              <Eye class="h-4 w-4 mr-3 text-gray-400 group-hover:text-primary" />
              View User
            </NuxtLink>
            
            <button 
              @click.stop="openConfirmationModal('block', getSelectedUser)"
              class="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-all duration-200 group cursor-pointer"
            >
              <Ban class="h-4 w-4 mr-3 text-gray-400 group-hover:text-primary" />
              {{ getSelectedUser?.blockStatus ? 'Unblock User' : 'Block User' }}
            </button>
            
            <button 
              @click.stop="openConfirmationModal('flag', getSelectedUser)"
              class="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-all duration-200 group cursor-pointer"
            >
              <Flag class="h-4 w-4 mr-3 text-gray-400 group-hover:text-primary" />
              {{ getSelectedUser?.flagStatus ? 'Unflag User' : 'Flag User' }}
            </button>
            
            <button 
              @click.stop="openGenerateAccountModal(getSelectedUser)"
              class="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-all duration-200 group cursor-pointer"
            >
              <CreditCard class="h-4 w-4 mr-3 text-gray-400 group-hover:text-primary" />
              Generate Account Number
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

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

    <!-- Confirmation Modal for Block/Flag -->
    <TransitionRoot appear :show="!!confirmationModal.show" as="template">
      <Dialog as="div" @close="closeConfirmationModal" class="relative z-50">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" />
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
              <DialogPanel class="w-full max-w-md bg-white p-6 rounded-xl shadow-xl">
                <div class="text-center">
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full" 
                    :class="{
                      'bg-red-100': confirmationModal.type === 'block',
                      'bg-yellow-100': confirmationModal.type === 'flag'
                    }">
                    <component :is="getConfirmationIcon" class="h-6 w-6" 
                      :class="{
                        'text-red-600': confirmationModal.type === 'block',
                        'text-yellow-600': confirmationModal.type === 'flag'
                      }" />
                  </div>
                  
                  <h3 class="mt-4 text-lg font-medium text-gray-900">{{ confirmationModal.title }}</h3>
                  <p class="mt-2 text-sm text-gray-500">{{ confirmationModal.message }}</p>
                  
                  <div class="mt-6 flex justify-center gap-3">
                    <button
                      @click="closeConfirmationModal"
                      class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      @click="confirmAction"
                      class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                      :class="{
                        'bg-red-600 hover:bg-red-700 focus:ring-red-500': confirmationModal.type === 'block',
                        'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500': confirmationModal.type === 'flag'
                      }"
                    >
                      <Loader2 v-if="confirmationModal.loading" class="animate-spin mr-2 h-4 w-4" />
                      {{ confirmationModal.confirmText }}
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Generate Account Number Confirmation Modal -->
    <TransitionRoot appear :show="isGenerateAccountModal" as="template">
      <Dialog as="div" @close="isGenerateAccountModal = false" class="relative z-50">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md bg-white p-6 rounded-xl shadow-xl">
                <div class="text-center">
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CreditCard class="h-6 w-6 text-green-600" />
                  </div>
                  
                  <h3 class="mt-4 text-lg font-medium text-gray-900">Confirm Account Number Generation</h3>
                  <p class="mt-2 text-sm text-gray-500">
                    Are you sure you want to generate an account number for {{ selectedUser?.firstName }} {{ selectedUser?.lastName }}?
                  </p>
                  
                  <div class="mt-6 flex justify-center gap-3">
                    <button
                      @click="isGenerateAccountModal = false"
                      class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      @click="proceedToGenerateAccountNumber"
                      class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-[1.02]"
                      :disabled="generating"
                    >
                      <Loader2 v-if="generating" class="animate-spin mr-2 h-4 w-4" />
                      {{ generating ? 'Processing...' : 'Proceed' }}
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- OTP Verification Modal -->
    <TransitionRoot appear :show="showOtpModal" as="template">
      <Dialog as="div" @close="closeOtpModal" class="relative z-50">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md bg-white p-6 rounded-xl shadow-xl">
                <div class="text-center">
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Mail class="h-6 w-6 text-primary" />
                  </div>
                  
                  <h3 class="mt-4 text-lg font-medium text-gray-900">Verify Your Email</h3>
                  <p class="mt-2 text-sm text-gray-500">
                    We have sent a verification code to {{ selectedUser?.email }}
                  </p>
                  
                  <div class="mt-6">
                    <div class="flex justify-center gap-2 mb-4">
                      <input
                        v-for="(digit, index) in 6"
                        :key="index"
                        ref="otpInputs"
                        v-model="otpDigits[index]"
                        type="text"
                        maxlength="1"
                        class="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:border-primary focus:ring-primary"
                        @input="handleOtpInput(index, $event)"
                        @keydown="handleKeyDown(index, $event)"
                        @paste="handlePaste($event)"
                      />
                    </div>
                    
                    <div class="text-sm text-gray-500 mb-6">
                      <div class="flex justify-center items-center gap-2">
                        <span>Code expires in</span>
                        <span class="font-medium text-primary">{{ formatTime(timer) }}</span>
                      </div>
                      <button 
                        @click="resendOtp"
                        :disabled="timer > 0 || submitting"
                        class="mt-2 text-primary hover:text-primary/80 transition-colors duration-200 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Resend Code
                      </button>
                    </div>
                    
                    <div class="flex justify-center gap-3">
                      <button
                        @click="closeOtpModal"
                        class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                        :disabled="submitting"
                      >
                        Cancel
                      </button>
                      <button
                        @click="submitOtp"
                        class="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02]"
                        :disabled="!isOtpComplete || submitting"
                      >
                        <Loader2 v-if="submitting" class="animate-spin mr-2 h-4 w-4" />
                        {{ submitting ? 'Verifying...' : 'Verify' }}
                      </button>
                    </div>
                  </div>
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
        v-if="toast.show" 
        class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce-in z-50"
        :class="{
          'bg-green-50 border border-green-200 text-green-800': toast.type === 'success',
          'bg-red-50 border border-red-200 text-red-800': toast.type === 'error',
          'bg-blue-50 border border-blue-200 text-blue-800': toast.type === 'info'
        }"
      >
        <component :is="getToastIcon" class="h-5 w-5" 
          :class="{
            'text-green-500': toast.type === 'success',
            'text-red-500': toast.type === 'error',
            'text-blue-500': toast.type === 'info'
          }" />
        <span>{{ toast.message }}</span>
        <button @click="closeToast" class="ml-2 hover:opacity-70 transition-opacity duration-200">
          <X class="h-4 w-4" />
        </button>
      </div>
    </Transition>

    <!-- Account Number Generated Modal -->
    <TransitionRoot appear :show="accountNumberModal.show" as="template">
      <Dialog as="div" @close="accountNumberModal.show = false" class="relative z-50">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md bg-white p-6 rounded-xl shadow-xl">
                <div class="text-center">
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle class="h-6 w-6 text-green-600" />
                  </div>
                  
                  <h3 class="mt-4 text-lg font-medium text-gray-900">Account Number Generated</h3>
                  <p class="mt-2 text-sm text-gray-500">
                    Account number has been successfully generated for {{ accountNumberModal.userName }}.
                  </p>
                  
                  <div class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p class="text-sm font-medium text-gray-700">Account Number:</p>
                    <div class="flex items-center justify-center mt-1 gap-2">
                      <p class="text-xl font-bold tracking-wider text-primary">{{ accountNumberModal.accountNumber }}</p>
                      <button 
                        @click="copyAccountNumber" 
                        class="text-gray-500 hover:text-primary transition-colors duration-200"
                        title="Copy to clipboard"
                      >
                        <component :is="accountNumberModal.copied ? CheckCircle : Copy" class="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div class="mt-6">
                    <button
                      @click="accountNumberModal.show = false"
                      class="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 w-full"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { useGetUsers } from '@/composables/modules/users/useGetUsers'
import { usePermissions } from '@/composables/core/usePermissions'
import { useCSVDownload } from '@/composables/useCSVDownload'
import { useCreateUserWithoutWallet } from "@/composables/modules/users/useCreateUserWithoutWallet"
import { useCreateUser } from "@/composables/modules/users/useCreateUser"
import { useBlockUser } from '@/composables/modules/users/useBlockUser'
import { useUnblockUser } from '@/composables/modules/users/useUnblockUser'
import { useFlagUserAccount } from '@/composables/modules/users/useFlagUserAccount'
import { useUnflagUserAccount } from '@/composables/modules/users/useUnflagUserAccount'
import { useGenerateAccountNumber } from '@/composables/modules/users/useGenerateAccountNumber'
import { useSubmitAccountNumberRequest } from '@/composables/modules/users/useSubmitAccountNumberRequest'
import { useCustomToast } from "@/composables/core/useCustomToast"
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
  ChevronDown,
  MoreHorizontal,
  Wallet,
  Loader2,
  CheckCircle,
  X,
  Mail,
  Phone,
  Copy,
  AlertTriangle,
  Info
} from "lucide-vue-next"

const { canView, canCreate } = usePermissions()
const { isDownloading, progress, downloadPaginatedCSV } = useCSVDownload()
const { createUserWithoutWallet, loading: creating } = useCreateUserWithoutWallet()
const { createUser: createUserWithWallet, loading: creatingWithWallet } = useCreateUser()
const { loading, metadata, users } = useGetUsers()
const { showToast: showCustomToast } = useCustomToast()

// Block/Unblock functionality
const { blockUser, loading: blocking } = useBlockUser()
const { unblockUser, loading: unblocking } = useUnblockUser()

// Flag/Unflag functionality
const { flagUserAccount, loading: flagging } = useFlagUserAccount()
const { unflagUserAccount, loading: unflagging } = useUnflagUserAccount()

// Account number generation
const { generateAccountNumber, loading: generating } = useGenerateAccountNumber()
const { submitAccountNumberRequest, loading: submittingAccountRequest, setPayload } = useSubmitAccountNumberRequest()

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

// Action dropdown state
const openActionMenu = ref<string | null>(null)
const dropdownPosition = ref<any>(null)

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

// Confirmation modal state
const confirmationModal = ref({
  show: false,
  type: '', // 'block', 'flag'
  title: '',
  message: '',
  confirmText: '',
  loading: false,
  user: null as any
})

// Toast notification state
const toast = ref({
  show: false,
  message: '',
  type: 'success', // 'success', 'error', 'info'
  timeout: null as any
})

// Account number modal state
const accountNumberModal = ref({
  show: false,
  userName: '',
  accountNumber: '',
  copied: false
})

// Generate account number modal
const isGenerateAccountModal = ref(false)
const selectedUser = ref<any>(null)

// OTP verification modal
const showOtpModal = ref(false)
const otpDigits = ref(['', '', '', '', '', ''])
const otpInputs = ref<HTMLInputElement[]>([])
const timer = ref(240) // 4 minutes in seconds
const timerInterval = ref<any>(null)
const submitting = ref(false)

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

// Get the selected user
const getSelectedUser = computed(() => {
  if (!openActionMenu.value) return null
  return users.value.find(user => user.id === openActionMenu.value)
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

// Check if OTP is complete
const isOtpComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '')
})

// Get confirmation modal icon based on type
const getConfirmationIcon = computed(() => {
  switch (confirmationModal.value.type) {
    case 'block':
      return Ban
    case 'flag':
      return Flag
    default:
      return AlertTriangle
  }
})

// Get toast icon based on type
const getToastIcon = computed(() => {
  switch (toast.value.type) {
    case 'success':
      return CheckCircle
    case 'error':
      return AlertTriangle
    case 'info':
      return Info
    default:
      return Info
  }
})

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

// Toggle action menu dropdown
const toggleActionMenu = (userId: string, event: MouseEvent) => {
  event.stopPropagation()
  
  // Close any open dropdown first
  if (openActionMenu.value !== null && openActionMenu.value !== userId) {
    openActionMenu.value = null
    dropdownPosition.value = null
    
    // Small delay to prevent flickering when opening a new dropdown
    setTimeout(() => {
      openActionMenu.value = userId
      updateDropdownPosition(userId)
    }, 50)
  } else if (openActionMenu.value === userId) {
    openActionMenu.value = null
    dropdownPosition.value = null
  } else {
    openActionMenu.value = userId
    updateDropdownPosition(userId)
  }
}

// Update dropdown position based on button position
const updateDropdownPosition = (userId: string) => {
  // Find the button element
  const buttonElement = document.querySelector(`[data-user-id="${userId}"]`) as HTMLElement
  if (!buttonElement) return

  // Get button position
  const rect = buttonElement.getBoundingClientRect()

  // Calculate position for dropdown - position it to the right of the button
  const top = rect.top + window.scrollY
  const right = window.innerWidth - rect.right - 10 // Position from right edge

  // Set position - using right alignment to prevent overflow
  dropdownPosition.value = {
    top: `${top}px`,
    right: `${right}px`
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
    showToast('User created successfully!', 'success')
    
  } catch (error) {
    console.error('Error creating user:', error)
    showToast('Failed to create user. Please try again.', 'error')
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
    showToast('User created successfully with wallet!', 'success')
    
  } catch (error) {
    console.error('Error creating user with wallet:', error)
    showToast('Failed to create user with wallet. Please try again.', 'error')
  } finally {
    isSubmittingWithWallet.value = false
  }
}

// Open confirmation modal for actions
const openConfirmationModal = (type: string, user: any) => {
  openActionMenu.value = null // Close the dropdown
  dropdownPosition.value = null
  
  let title = ''
  let message = ''
  let confirmText = ''
  
  if (type === 'block') {
    const isBlocked = user.blockStatus
    title = isBlocked ? 'Unblock User' : 'Block User'
    message = isBlocked 
      ? `Are you sure you want to unblock ${user.firstName} ${user.lastName}?` 
      : `Are you sure you want to block ${user.firstName} ${user.lastName}? This will prevent them from accessing their account.`
    confirmText = isBlocked ? 'Unblock' : 'Block'
  } else if (type === 'flag') {
    const isFlagged = user.flagStatus
    title = isFlagged ? 'Unflag User' : 'Flag User'
    message = isFlagged 
      ? `Are you sure you want to unflag ${user.firstName} ${user.lastName}?` 
      : `Are you sure you want to flag ${user.firstName} ${user.lastName}? This will mark their account for review.`
    confirmText = isFlagged ? 'Unflag' : 'Flag'
  }
  
  confirmationModal.value = {
    show: true,
    type,
    title,
    message,
    confirmText,
    loading: false,
    user
  }
}

// Close confirmation modal
const closeConfirmationModal = () => {
  confirmationModal.value.show = false
  // Reset after animation completes
  setTimeout(() => {
    confirmationModal.value = {
      show: false,
      type: '',
      title: '',
      message: '',
      confirmText: '',
      loading: false,
      user: null
    }
  }, 300)
}

// Confirm action from modal
const confirmAction = async () => {
  confirmationModal.value.loading = true
  
  try {
    const { type, user } = confirmationModal.value
    
    if (type === 'block') {
      // Toggle block status
      if (user.blockStatus) {
        await unblockUser(user.id)
      } else {
        await blockUser(user.id)
      }
      
      // Update user in the list
      const userIndex = users.value.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        users.value[userIndex].blockStatus = !user.blockStatus
      }
      
      showToast(
        user.blockStatus 
          ? `${user.firstName} ${user.lastName} has been unblocked` 
          : `${user.firstName} ${user.lastName} has been blocked`,
        'success'
      )
    } else if (type === 'flag') {
      // Toggle flag status
      if (user.flagStatus) {
        await unflagUserAccount(user.id)
      } else {
        await flagUserAccount(user.id)
      }
      
      // Update user in the list
      const userIndex = users.value.findIndex(u => u.id === user.id)
      if (userIndex !== -1) {
        users.value[userIndex].flagStatus = !user.flagStatus
      }
      
      showToast(
        user.flagStatus 
          ? `${user.firstName} ${user.lastName} has been unflagged` 
          : `${user.firstName} ${user.lastName} has been flagged`,
        'success'
      )
    }
    
    closeConfirmationModal()
  } catch (error) {
    console.error('Error performing action:', error)
    showToast('Failed to perform action. Please try again.', 'error')
  } finally {
    confirmationModal.value.loading = false
  }
}

// Open generate account number modal
const openGenerateAccountModal = (user: any) => {
  selectedUser.value = user
  openActionMenu.value = null
  dropdownPosition.value = null
  isGenerateAccountModal.value = true
}

// Proceed to generate account number
const proceedToGenerateAccountNumber = async () => {
  try {
    const response = await generateAccountNumber(selectedUser.value.id)
    
    if (response && response === 'success') {
      isGenerateAccountModal.value = false
      showOtpModal.value = true
      startTimer()
    }
  } catch (error) {
    console.error('Error generating account number:', error)
    showToast('Failed to generate account number. Please try again.', 'error')
  }
}

// OTP handling methods
const handleOtpInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value
  
  // Only allow numbers
  if (!/^\d*$/.test(value)) {
    otpDigits.value[index] = ''
    return
  }
  
  // Auto-focus next input
  if (value && index < 5) {
    nextTick(() => {
      otpInputs.value[index + 1]?.focus()
    })
  }
}

const handleKeyDown = (index: number, event: KeyboardEvent) => {
  // Handle backspace
  if (event.key === 'Backspace') {
    if (!otpDigits.value[index] && index > 0) {
      otpDigits.value[index - 1] = ''
      nextTick(() => {
        otpInputs.value[index - 1]?.focus()
      })
    }
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text')
  
  if (!pastedData) return
  
  // Extract only numbers
  const numbers = pastedData.replace(/\D/g, '')
  
  // Fill in the OTP inputs
  for (let i = 0; i < Math.min(numbers.length, 6); i++) {
    otpDigits.value[i] = numbers[i]
  }
  
  // Focus the next empty input or the last one
  const nextEmptyIndex = otpDigits.value.findIndex(digit => !digit)
  if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
    nextTick(() => {
      otpInputs.value[nextEmptyIndex]?.focus()
    })
  } else {
    nextTick(() => {
      otpInputs.value[5]?.focus()
    })
  }
}

const startTimer = () => {
  timer.value = 240 // Reset to 4 minutes
  
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  
  timerInterval.value = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      clearInterval(timerInterval.value)
    }
  }, 1000)
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
}

const resendOtp = async () => {
  try {
    await proceedToGenerateAccountNumber()
    showToast('A new OTP has been sent to your email', 'success')
  } catch (error) {
    console.error('Error resending OTP:', error)
    showToast('Failed to resend OTP. Please try again.', 'error')
  }
}

const submitOtp = async () => {
  submitting.value = true
  
  try {
    const otpCode = otpDigits.value.join('')
    console.log(selectedUser.value, 'selected user here')
    
    // Set the payload for the account number request
    setPayload({ otp: otpCode, userId: selectedUser?.value?.id })
    
    // Submit the account number request
    await submitAccountNumberRequest()
    
    // Close the OTP modal
    closeOtpModal()
    
    // Show success message
    showToast('Account number generated successfully!', 'success')
    
    // Show the account number modal
    accountNumberModal.value = {
      show: true,
      userName: `${selectedUser.value.firstName} ${selectedUser.value.lastName}`,
      accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(), // This would come from the API in a real app
      copied: false
    }
  } catch (error) {
    console.error('Error submitting OTP:', error)
    showToast('Invalid OTP. Please try again.', 'error')
  } finally {
    submitting.value = false
  }
}

const closeOtpModal = () => {
  showOtpModal.value = false
  clearOtp()
  
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
}

const clearOtp = () => {
  otpDigits.value = ['', '', '', '', '', '']
}

// Copy account number to clipboard
const copyAccountNumber = () => {
  navigator.clipboard.writeText(accountNumberModal.value.accountNumber)
    .then(() => {
      accountNumberModal.value.copied = true
      setTimeout(() => {
        accountNumberModal.value.copied = false
      }, 2000)
    })
    .catch(err => {
      console.error('Failed to copy account number:', err)
      showToast('Failed to copy to clipboard', 'error')
    })
}

// Show toast notification
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  // Clear any existing timeout
  if (toast.value.timeout) {
    clearTimeout(toast.value.timeout)
  }
  
  toast.value = {
    show: true,
    message,
    type,
    timeout: setTimeout(() => {
      closeToast()
    }, 5000)
  }
}

// Close toast notification
const closeToast = () => {
  toast.value.show = false
  if (toast.value.timeout) {
    clearTimeout(toast.value.timeout)
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

// Add global click event listener for closing dropdowns
onMounted(() => {
  // Trigger animation after initial render
  setTimeout(() => {
    animateRows.value = true
  }, 300)
  
  // Store references to OTP input elements
  nextTick(() => {
    otpInputs.value = Array.from(document.querySelectorAll('input[type="text"][maxlength="1"]')) as HTMLInputElement[]
  })
  
  // Add data attributes to action buttons for positioning
  nextTick(() => {
    const actionButtons = document.querySelectorAll('.action-button')
    actionButtons.forEach((button, index) => {
      const userId = paginatedUsers.value[index]?.id
      if (userId) {
        button.setAttribute('data-user-id', userId)
      }
    })
  })
  
  // Add global click event listener
  document.addEventListener('click', (event) => {
    // Check if click is outside any dropdown
    if (openActionMenu.value !== null) {
      const dropdownElement = document.querySelector('.action-dropdown')
      const actionButtons = document.querySelectorAll('.action-button')
      let clickedInsideDropdown = false
      
      // Check if clicked inside dropdown or on action button
      if (dropdownElement && dropdownElement.contains(event.target as Node)) {
        clickedInsideDropdown = true
      }
      
      actionButtons.forEach(button => {
        if (button.contains(event.target as Node)) {
          clickedInsideDropdown = true
        }
      })
      
      // Close dropdown if clicked outside
      if (!clickedInsideDropdown) {
        openActionMenu.value = null
        dropdownPosition.value = null
      }
    }
  })
})

// Remove event listener when component is destroyed
onBeforeUnmount(() => {
  document.removeEventListener('click', () => {
    // Cleanup
  })
  
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

// Watch for changes in pagination to update button data attributes
watch([currentPage, paginatedUsers], () => {
  nextTick(() => {
    const actionButtons = document.querySelectorAll('.action-button')
    actionButtons.forEach((button, index) => {
      const userId = paginatedUsers.value[index]?.id
      if (userId) {
        button.setAttribute('data-user-id', userId)
      }
    })
  })
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

/* Ensure dropdown items are clickable */
.action-dropdown {
  pointer-events: auto;
  cursor: default;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.action-dropdown button, 
.action-dropdown a {
  cursor: pointer !important;
  width: 100%;
  font-weight: 500;
}
</style>
