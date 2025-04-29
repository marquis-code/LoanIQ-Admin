<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Main Layout -->
    <div class="flex flex-col min-h-screen">
      <!-- Header -->
      <header class="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="container mx-auto px-4 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white">
              <IconLink class="w-5 h-5" />
            </div>
            <h1 class="text-xl font-bold text-gray-800 dark:text-white">Referral Dashboard</h1>
          </div>
          
          <div class="flex items-center gap-3">
            <button 
              @click="isFilterOpen = !isFilterOpen"
              class="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <IconFilter class="w-4 h-4" />
              <span class="hidden sm:inline">Filter</span>
            </button>
            
            <button 
              @click="refreshReferralCodes" 
              :disabled="fetchReferralCodesLoading"
              class="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <IconRefreshCw class="w-4 h-4" :class="{ 'animate-spin': fetchReferralCodesLoading }" />
              <span class="hidden sm:inline">Refresh</span>
            </button>
            
            <button 
              @click="openCreateModal"
              class="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <IconPlus class="w-4 h-4" />
              <span class="hidden sm:inline">New Code</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 container mx-auto px-4 py-6">
        <!-- Stats Cards -->
        <div class="gap-4 mb-6">
          <transition-group 
            name="fade-up" 
            tag="div" 
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
            appear
          >
            <div 
              v-for="(stat, index) in statsData" 
              :key="stat.title"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-md"
              :style="{ transitionDelay: `${index * 100}ms` }"
            >
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.title }}</p>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stat.value }}</h3>
                </div>
                <div :class="`p-2 rounded-lg ${stat.bgColor}`">
                  <component :is="stat.icon" class="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- Filter Panel (conditionally shown) -->
        <transition name="fade">
          <div v-if="isFilterOpen" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-6 border border-gray-100 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filter Referral Codes</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select 
                  v-model="filters.status" 
                  class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform</label>
                <select 
                  v-model="filters.platform" 
                  class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">All Platforms</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                <div class="relative">
                  <input 
                    v-model="filters.search" 
                    type="text" 
                    placeholder="Search by name, email or code"
                    class="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  <IconSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Referral Codes Table -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Your Referral Codes</h2>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ filteredReferralCodes.length }} codes</span>
          </div>
          
          <!-- Table Container with Responsive Design -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700/50 text-left">
                <tr>
                  <th class="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                  <th class="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th class="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th class="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th class="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Users</th>
                  <th class="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Created</th>
                  <th class="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                <template v-if="filteredReferralCodes.length > 0">
                  <tr 
                    v-for="referral in filteredReferralCodes" 
                    :key="referral.id"
                    :class="{'bg-primary/5': selectedReferralCode === referral.id}"
                    class="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer"
                    @click="selectReferralCode(referral.id)"
                  >
                    <td class="px-5 py-4 text-sm font-medium">
                      <div class="flex items-center gap-2">
                        <span class="font-mono">{{ referral.code }}</span>
                        <button 
                          @click.stop="copyToClipboard(referral.code)"
                          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <IconCopy class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td class="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">{{ referral.name }}</td>
                    <td class="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{{ referral.email }}</td>
                    <td class="px-5 py-4 text-sm">
                      <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        referral.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`">
                        {{ referral.status }}
                      </span>
                    </td>
                    <td class="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      <div class="flex items-center gap-1.5">
                        <IconUsers class="w-4 h-4" />
                        <span>{{ referral.userCount }}</span>
                      </div>
                    </td>
                    <td class="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">{{ formatDate(referral.createdAt) }}</td>
                    <td class="px-5 py-4 text-sm">
                      <div class="flex items-center gap-2">
                        <button 
                          v-if="referral.status === 'active'"
                          @click.stop="deactivateCode(referral.id)"
                          :disabled="deactivateLoading && deactivatingId === referral.id"
                          class="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                          <IconPower v-if="!(deactivateLoading && deactivatingId === referral.id)" class="w-3 h-3 mr-1" />
                          <IconLoader v-else class="w-3 h-3 mr-1 animate-spin" />
                          <span>Deactivate</span>
                        </button>
                        <button 
                          v-else
                          @click.stop="activateCode(referral.id)"
                          :disabled="deactivateLoading && deactivatingId === referral.id"
                          class="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        >
                          <IconPower v-if="!(deactivateLoading && deactivatingId === referral.id)" class="w-3 h-3 mr-1" />
                          <IconLoader v-else class="w-3 h-3 mr-1 animate-spin" />
                          <span>Activate</span>
                        </button>
                        <button 
                          @click.stop="openEditModal(referral)"
                          class="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <IconEdit class="w-3 h-3 mr-1" />
                          <span>Edit</span>
                        </button>
                        <button 
                          @click.stop="openUserDrawer(referral.id)"
                          class="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <IconUsers class="w-3 h-3 mr-1" />
                          <span>Users</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr v-else-if="!fetchReferralCodesLoading">
                  <td colspan="7" class="px-5 py-8 text-center">
                    <div class="flex flex-col items-center justify-center">
                      <div class="bg-gray-100 dark:bg-gray-700 rounded-full p-3 mb-3">
                        <IconLink class="w-6 h-6 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p class="text-gray-500 dark:text-gray-400 mb-1">No referral codes found</p>
                      <p class="text-sm text-gray-400 dark:text-gray-500 mb-4">Create your first referral code to get started</p>
                      <button 
                        @click="openCreateModal"
                        class="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                      >
                        Create Referral Code
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-else>
                  <td colspan="7" class="px-5 py-8">
                    <div class="flex justify-center">
                      <IconLoader class="w-8 h-8 text-primary animate-spin" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <!-- Create/Edit Referral Code Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" role="dialog">
          <div class="flex min-h-screen items-center justify-center p-4 text-center">
            <!-- Backdrop -->
            <div 
              class="fixed inset-0 bg-black/50 transition-opacity" 
              @click="closeModal"
            ></div>

            <!-- Modal Panel -->
            <div 
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              :class="{ 'animate-in zoom-in-95': isModalOpen }"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ editingReferral ? 'Edit Referral Code' : 'Create New Referral Code' }}
                </h3>
                <button 
                  @click="closeModal" 
                  class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <IconX class="w-5 h-5" />
                </button>
              </div>

              <form @submit.prevent="handleSubmitReferral">
                <div class="space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input 
                      id="name" 
                      v-model="formData.name" 
                      class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter a name for this code"
                    />
                  </div>
                  
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input 
                      id="email" 
                      v-model="formData.email" 
                      type="email"
                      class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Your email address"
                    />
                  </div>
                  
                  <div>
                    <label for="platform" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform</label>
                    <select 
                      id="platform" 
                      v-model="formData.code" 
                      class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="facebook">Facebook</option>
                      <option value="twitter">Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="email">Email</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div v-if="errorMessage" class="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg text-sm">
                    {{ errorMessage }}
                  </div>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                  <button 
                    type="button"
                    @click="closeModal"
                    class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    :disabled="createLoading || !isFormValid"
                    class="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    <span v-if="createLoading" class="flex items-center">
                      <IconLoader class="w-4 h-4 mr-2 animate-spin" />
                      {{ editingReferral ? 'Updating...' : 'Creating...' }}
                    </span>
                    <span v-else>
                      {{ editingReferral ? 'Update Code' : 'Create Code' }}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Use Referral Code Modal -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="isUseModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" role="dialog">
          <div class="flex min-h-screen items-center justify-center p-4 text-center">
            <!-- Backdrop -->
            <div 
              class="fixed inset-0 bg-black/50 transition-opacity" 
              @click="closeUseModal"
            ></div>

            <!-- Modal Panel -->
            <div 
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              :class="{ 'animate-in zoom-in-95': isUseModalOpen }"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Use Referral Code
                </h3>
                <button 
                  @click="closeUseModal" 
                  class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <IconX class="w-5 h-5" />
                </button>
              </div>

              <form @submit.prevent="handleUseReferral">
                <div class="space-y-4">
                  <div>
                    <label for="referralCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Referral Code</label>
                    <input 
                      id="referralCode" 
                      v-model="referralCode" 
                      class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter referral code"
                    />
                  </div>
                  
                  <div>
                    <label for="userName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                    <input 
                      id="userName" 
                      v-model="userName" 
                      class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                  <button 
                    type="button"
                    @click="closeUseModal"
                    class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    :disabled="updateLoading || !referralCode || !userName"
                    class="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    <span v-if="updateLoading" class="flex items-center">
                      <IconLoader class="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </span>
                    <span v-else>
                      Use Code
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Users Side Drawer -->
    <Teleport to="body">
      <transition name="slide-right">
        <div v-if="isDrawerOpen" class="fixed inset-0 z-50 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <!-- Backdrop -->
            <div 
              class="absolute inset-0 bg-black/50 transition-opacity" 
              @click="closeDrawer"
            ></div>
            
            <!-- Drawer Panel -->
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <div 
                class="pointer-events-auto w-screen max-w-md transform transition-all duration-500 ease-in-out"
                :class="{ 'translate-x-0': isDrawerOpen, 'translate-x-full': !isDrawerOpen }"
              >
                <div class="flex h-full flex-col overflow-y-auto bg-white dark:bg-gray-800 shadow-xl">
                  <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                        <IconUsers class="w-4 h-4" />
                      </div>
                      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                        Users for Code: {{ selectedCodeInfo?.code }}
                      </h2>
                    </div>
                    <button 
                      @click="closeDrawer" 
                      class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <IconX class="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div class="flex-1 overflow-y-auto p-6">
                    <!-- Code Info Card -->
                    <div class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 mb-6">
                      <div class="flex items-center justify-between mb-3">
                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Code Details</h3>
                        <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedCodeInfo?.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`">
                          {{ selectedCodeInfo?.status }}
                        </span>
                      </div>
                      
                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-500 dark:text-gray-400">Code:</span>
                          <span class="text-sm font-medium text-gray-900 dark:text-white font-mono">{{ selectedCodeInfo?.code }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedCodeInfo?.name }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedCodeInfo?.email }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-gray-500 dark:text-gray-400">Created:</span>
                          <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(selectedCodeInfo?.createdAt) }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Users List -->
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Users ({{ users.length }})</h3>
                    
                    <div v-if="fetchReferralCodeUsersLoading" class="flex justify-center py-12">
                      <IconLoader class="w-8 h-8 text-primary animate-spin" />
                    </div>
                    
                    <div v-else-if="users.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
                      <div class="bg-gray-100 dark:bg-gray-700 rounded-full p-3 mb-3">
                        <IconUsers class="w-6 h-6 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p class="text-gray-500 dark:text-gray-400 mb-1">No users yet</p>
                      <p class="text-sm text-gray-400 dark:text-gray-500">Share this code to start getting users</p>
                    </div>
                    
                    <div v-else class="space-y-3">
                      <div 
                        v-for="user in users" 
                        :key="user.id"
                        class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 transition-all duration-200 hover:shadow-sm"
                      >
                        <div class="flex items-center justify-between mb-2">
                          <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                              <span class="text-sm font-medium">{{ user.name.charAt(0).toUpperCase() }}</span>
                            </div>
                            <div>
                              <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</h4>
                              <p class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</p>
                            </div>
                          </div>
                          <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(user.createdAt) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Success Notification -->
    <Teleport to="body">
      <transition name="fade">
        <div 
          v-if="showNotification" 
          class="fixed bottom-4 right-4 z-50 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 p-4 transform transition-all duration-300"
          :class="{ 'translate-y-0 opacity-100': showNotification, 'translate-y-10 opacity-0': !showNotification }"
        >
          <div class="flex items-start gap-3">
            <div :class="`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              notificationType === 'success' 
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            }`">
              <IconCheck v-if="notificationType === 'success'" class="w-4 h-4" />
              <IconAlertCircle v-else class="w-4 h-4" />
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                {{ notificationType === 'success' ? 'Success' : 'Error' }}
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ notificationMessage }}
              </p>
            </div>
            <button 
              @click="hideNotification" 
              class="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <IconX class="w-5 h-5" />
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
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

// Import icons from lucide-vue-next
import { 
  Link as IconLink,
  RefreshCw as IconRefreshCw,
  Plus as IconPlus,
  Search as IconSearch,
  Users as IconUsers,
  Copy as IconCopy,
  Edit as IconEdit,
  Power as IconPower,
  Loader as IconLoader,
  X as IconX,
  Check as IconCheck,
  AlertCircle as IconAlertCircle,
  Filter as IconFilter
} from 'lucide-vue-next';

// Destructuring from composables
const { createReferralCode, response: createResponse, loading: createLoading } = useCreateReferralCode();
const { updateReferralCode, response: updateResponse, loading: updateLoading } = useUpdateReferralCode();
const { fetchReferralCodes, referralCodes, loading: fetchReferralCodesLoading } = useFetchReferralCodes();
const { fetchReferralCodeUsers, users, loading: fetchReferralCodeUsersLoading } = useFetchReferralCodeUsers();
const { deactivateReferralCode, response: deactivateResponse, loading: deactivateLoading } = useDeactivateReferralCode();

// UI state
const isModalOpen = ref(false);
const isUseModalOpen = ref(false);
const isDrawerOpen = ref(false);
const isFilterOpen = ref(false);
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref('success');
const notificationTimeout = ref<number | null>(null);
const errorMessage = ref('');
const selectedReferralCode = ref('');
const deactivatingId = ref('');
const editingReferral = ref(null);

// Form state
const formData = ref({
  name: '',
  email: '',
  code: 'facebook'
});

const referralCode = ref('');
const userName = ref('');

// Filter state
const filters = ref({
  status: '',
  platform: '',
  search: ''
});

// Computed properties
const isFormValid = computed(() => {
  return formData.value.name && formData.value.email && formData.value.code;
});

const selectedCodeInfo = computed(() => {
  return referralCodes.value.find(code => code.id === selectedReferralCode.value);
});

const filteredReferralCodes = computed(() => {
  let filtered = [...referralCodes.value];
  
  // Filter by status
  if (filters.value.status) {
    filtered = filtered.filter(code => code.status === filters.value.status);
  }
  
  // Filter by platform
  if (filters.value.platform) {
    filtered = filtered.filter(code => code.code === filters.value.platform);
  }
  
  // Filter by search term
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    filtered = filtered.filter(code => 
      code.name.toLowerCase().includes(searchTerm) || 
      code.email.toLowerCase().includes(searchTerm) || 
      code.code.toLowerCase().includes(searchTerm)
    );
  }
  
  return filtered;
});

const statsData = computed(() => {
  const totalCodes = referralCodes.value.length;
  const activeCodes = referralCodes.value.filter(code => code.status === 'active').length;
  const totalUsers = referralCodes.value.reduce((sum, code) => sum + code.userCount, 0);
  
  const conversionRate = totalCodes > 0 
    ? ((totalUsers / totalCodes) * 100).toFixed(1) + '%'
    : '0.0%';
  
  return [
    { 
      title: 'Total Codes', 
      value: totalCodes,
      icon: IconLink,
      bgColor: 'bg-primary'
    },
    { 
      title: 'Active Codes', 
      value: activeCodes,
      icon: IconPower,
      bgColor: 'bg-green-500'
    },
    { 
      title: 'Total Users', 
      value: totalUsers,
      icon: IconUsers,
      bgColor: 'bg-amber-500'
    },
    { 
      title: 'Conversion Rate', 
      value: conversionRate,
      icon: IconRefreshCw,
      bgColor: 'bg-purple-500'
    }
  ];
});

// Methods
const openCreateModal = () => {
  formData.value = {
    name: '',
    email: '',
    code: 'facebook'
  };
  editingReferral.value = null;
  errorMessage.value = '';
  isModalOpen.value = true;
};

const openEditModal = (referral) => {
  formData.value = {
    name: referral.name,
    email: referral.email,
    code: referral.code
  };
  editingReferral.value = referral;
  errorMessage.value = '';
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const openUseModal = () => {
  referralCode.value = '';
  userName.value = '';
  isUseModalOpen.value = true;
};

const closeUseModal = () => {
  isUseModalOpen.value = false;
};

const openUserDrawer = async (id) => {
  selectedReferralCode.value = id;
  isDrawerOpen.value = true;
  await fetchUsersForSelectedCode();
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const handleSubmitReferral = async () => {
  // console.log(formData.value, 'editing')
  try {
    errorMessage.value = '';
    const payload = {
      name: formData.value.name,
      email: formData.value.email,
      code: formData.value.code
    };
    
    if (editingReferral.value) {
      console.log(editingReferral.value, 'editing')
      const payloadObj = {
      // code: referralCode.value,
      name: formData.value.name
    };
    
    const result = await updateReferralCode(editingReferral.value.id, payloadObj);
      // Update existing code logic would go here
      // For now, we'll just show a notification
      if (result) {
        notify({
          message: 'Referral code updated successfully!',
          type: 'success'
        });
      }
    } else {
      const result = await createReferralCode(payload);
      
      if (result) {
        notify({
          message: 'Referral code created successfully!',
          type: 'success'
        });
      }
    }
    
    // Reset form, close modal and refresh codes list
    formData.value = { name: '', email: '', code: 'facebook' };
    closeModal();
    refreshReferralCodes();
  } catch (error) {
    errorMessage.value = error.message || 'Failed to process referral code';
    notify({
      message: errorMessage.value,
      type: 'error'
    });
  }
};

const handleUseReferral = async () => {
  console.log(referralCode.value, 'here')
  try {
    const payload = {
      // code: referralCode.value,
      name: userName.value
    };
    
    const result = await updateReferralCode(referralCode.id, payload);
    
    if (result) {
      notify({
        message: 'Referral code used successfully!',
        type: 'success'
      });
      referralCode.value = '';
      userName.value = '';
      closeUseModal();
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

const activateCode = async (id) => {
  deactivatingId.value = id;
  
  try {
    // This would typically call a different endpoint, but for now we'll reuse deactivate
    await deactivateReferralCode(id);
    
    notify({
      message: 'Referral code activated successfully!',
      type: 'success'
    });
    
    // Refresh the list
    await refreshReferralCodes();
  } catch (error) {
    notify({
      message: 'Failed to activate referral code',
      type: 'error'
    });
  } finally {
    deactivatingId.value = '';
  }
};

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
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

// Notification system
const notify = ({ message, type = 'success', timeout = 5000 }) => {
  notificationMessage.value = message;
  notificationType.value = type;
  showNotification.value = true;
  
  if (notificationTimeout.value) {
    clearTimeout(notificationTimeout.value);
  }
  
  notificationTimeout.value = setTimeout(() => {
    hideNotification();
  }, timeout);
};

const hideNotification = () => {
  showNotification.value = false;
  if (notificationTimeout.value) {
    clearTimeout(notificationTimeout.value);
    notificationTimeout.value = null;
  }
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
:root {
  --primary: #6366f1;
  --primary-foreground: white;
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* Utility classes */
.animate-in {
  animation-duration: 150ms;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: both;
}

.zoom-in-95 {
  animation-name: zoom-in-95;
}

@keyframes zoom-in-95 {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Theme colors */
.bg-primary {
  background-color: black
}

.text-primary {
  color: var(--primary, #6366f1);
}

.border-primary {
  border-color: var(--primary, #6366f1);
}

.ring-primary {
  --tw-ring-color: var(--primary, #6366f1);
}
</style>