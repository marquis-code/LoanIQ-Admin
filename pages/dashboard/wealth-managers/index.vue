<template>
    <div class="wealth-managers-dashboard">
      <!-- Header Section -->
      <div class="relative overflow-hidden bg-gradient-to-r from-teal-600 to-teal-800 mb-6 rounded-xl">
        <div class="px-6 py-8 md:px-8 md:py-12">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div class="mb-6 md:mb-0">
              <h1 class="text-2xl md:text-3xl font-bold text-white">
                Wealth Managers
              </h1>
              <p class="mt-2 text-teal-100">
                Manage your team of wealth management professionals
              </p>
            </div>
            <button
              @click="openCreateModal"
              class="flex items-center justify-center gap-2 bg-white text-teal-700 px-4 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <UserPlus class="h-5 w-5" />
              <span>Add Wealth Manager</span>
            </button>
          </div>
        </div>
        <!-- Decorative elements -->
        <div class="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-teal-500 opacity-20"></div>
        <div class="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-teal-500 opacity-20"></div>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div 
          v-for="(stat, index) in stats" 
          :key="stat.title"
          class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-md"
          :class="{'animate-fade-in': isLoaded}"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">{{ stat.title }}</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900">{{ stat.value }}</p>
            </div>
            <div :class="`rounded-full p-2 ${stat.bgColor}`">
              <component :is="stat.icon" class="h-5 w-5" :class="stat.iconColor" />
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2">
            <div class="flex items-center" :class="stat.trend > 0 ? 'text-green-600' : 'text-red-600'">
              <component :is="stat.trend > 0 ? TrendingUp : TrendingDown" class="h-4 w-4" />
              <span class="ml-1 text-sm">{{ Math.abs(stat.trend) }}%</span>
            </div>
            <span class="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
      </div>
  
      <!-- Search and Filter Section -->
      <div class="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search wealth managers..."
              class="pl-10 w-full py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative">
              <select
                v-model="filterStatus"
                class="appearance-none pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="onboarding">Onboarding</option>
              </select>
              <ChevronDown class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div class="relative">
              <select
                v-model="sortBy"
                class="appearance-none pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white transition-all duration-300"
              >
                <option value="name">Sort by Name</option>
                <option value="clients">Sort by Clients</option>
                <option value="aum">Sort by AUM</option>
                <option value="performance">Sort by Performance</option>
              </select>
              <ChevronDown class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
  
      <!-- Table Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mb-4"></div>
          <p class="text-gray-500 font-medium">Loading wealth managers...</p>
        </div>
  
        <!-- Empty State -->
        <div v-else-if="filteredManagers.length === 0" class="flex flex-col items-center justify-center py-20">
          <div class="rounded-full bg-gray-100 p-6 mb-4">
            <Users class="h-12 w-12 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-1">No wealth managers found</h3>
          <p class="text-gray-500 mb-6">
            {{ searchQuery ? "Try adjusting your search or filters" : "Get started by adding your first wealth manager" }}
          </p>
          <button
            v-if="!searchQuery && filterStatus === 'all'"
            @click="openCreateModal"
            class="flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <UserPlus class="h-5 w-5" />
            <span>Add Wealth Manager</span>
          </button>
        </div>
  
        <!-- Table Content -->
        <div v-else>
          <!-- Desktop Table -->
          <div class="hidden md:block">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wealth Manager
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clients
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AUM
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="(manager, index) in paginatedManagers" 
                  :key="manager.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                  :class="{'animate-fade-in': isLoaded}"
                  :style="{ animationDelay: `${index * 50}ms` }"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <img
                          :src="manager.avatar || '/placeholder.svg?height=40&width=40'"
                          :alt="`${manager.firstName} ${manager.lastName}`"
                          class="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="font-medium text-gray-900">{{ manager.firstName }} {{ manager.lastName }}</div>
                        <div class="text-sm text-gray-500">{{ manager.title }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ manager.email }}</div>
                    <div class="text-sm text-gray-500">{{ manager.phone }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ manager.clientCount }}</div>
                    <div class="text-sm text-gray-500">{{ manager.clientChange > 0 ? '+' : '' }}{{ manager.clientChange }} this month</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatCurrency(manager.aum) }}</div>
                    <div class="text-sm" :class="manager.aumChange > 0 ? 'text-green-600' : 'text-red-600'">
                      {{ manager.aumChange > 0 ? '+' : '' }}{{ manager.aumChange }}%
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          class="h-2.5 rounded-full transition-all duration-1000" 
                          :class="getPerformanceColor(manager.performance)"
                          :style="{ width: `${manager.performance}%` }"
                        ></div>
                      </div>
                      <span class="ml-2 text-sm text-gray-900">{{ manager.performance }}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getStatusClass(manager.status)"
                    >
                      {{ manager.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                      <button
                        @click="openEditModal(manager)"
                        class="text-gray-500 hover:text-teal-600 transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit class="h-5 w-5" />
                      </button>
                      <button
                        @click="openViewModal(manager)"
                        class="text-gray-500 hover:text-teal-600 transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye class="h-5 w-5" />
                      </button>
                      <button
                        @click="confirmDelete(manager)"
                        class="text-gray-500 hover:text-red-600 transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash2 class="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Mobile Cards -->
          <div class="block md:hidden">
            <div 
              v-for="(manager, index) in paginatedManagers" 
              :key="manager.id"
              class="border-b border-gray-200 p-4"
              :class="{'animate-fade-in': isLoaded}"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <img
                    :src="manager.avatar || '/placeholder.svg?height=40&width=40'"
                    :alt="`${manager.firstName} ${manager.lastName}`"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                  <div class="ml-3">
                    <div class="font-medium text-gray-900">{{ manager.firstName }} {{ manager.lastName }}</div>
                    <div class="text-sm text-gray-500">{{ manager.title }}</div>
                  </div>
                </div>
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(manager.status)"
                >
                  {{ manager.status }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <div class="text-xs text-gray-500">Clients</div>
                  <div class="text-sm font-medium">{{ manager.clientCount }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">AUM</div>
                  <div class="text-sm font-medium">{{ formatCurrency(manager.aum) }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Performance</div>
                  <div class="text-sm font-medium">{{ manager.performance }}%</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500">Contact</div>
                  <div class="text-sm font-medium truncate">{{ manager.email }}</div>
                </div>
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  @click="openEditModal(manager)"
                  class="text-gray-500 hover:text-teal-600 transition-colors duration-200"
                  title="Edit"
                >
                  <Edit class="h-5 w-5" />
                </button>
                <button
                  @click="openViewModal(manager)"
                  class="text-gray-500 hover:text-teal-600 transition-colors duration-200"
                  title="View Details"
                >
                  <Eye class="h-5 w-5" />
                </button>
                <button
                  @click="confirmDelete(manager)"
                  class="text-gray-500 hover:text-red-600 transition-colors duration-200"
                  title="Delete"
                >
                  <Trash2 class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
  
          <!-- Pagination -->
          <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing <span class="font-medium">{{ paginationStart }}</span> to
                  <span class="font-medium">{{ paginationEnd }}</span> of
                  <span class="font-medium">{{ filteredManagers.length }}</span> results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    @click="currentPage = Math.max(1, currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span class="sr-only">Previous</span>
                    <ChevronLeft class="h-5 w-5" />
                  </button>
                  <button
                    v-for="page in displayedPages"
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      currentPage === page
                        ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button
                    @click="currentPage = Math.min(totalPages, currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span class="sr-only">Next</span>
                    <ChevronRight class="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
            <div class="flex sm:hidden justify-between w-full">
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span class="text-sm text-gray-500">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Create/Edit Modal -->
      <TransitionRoot appear :show="showManagerModal" as="template">
        <Dialog as="div" @close="closeManagerModal" class="relative z-50">
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/30" />
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
                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    {{ editingManager ? 'Edit Wealth Manager' : 'Add New Wealth Manager' }}
                  </DialogTitle>
                  <div class="mt-4">
                    <form @submit.prevent="saveManager" class="space-y-4">
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                          <input
                            id="firstName"
                            v-model="managerForm.firstName"
                            type="text"
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm transition-all duration-300 px-3 py-3 border border-gray-200 outline-none"
                          />
                        </div>
                        <div>
                          <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                          <input
                            id="lastName"
                            v-model="managerForm.lastName"
                            type="text"
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm transition-all duration-300 px-3 py-3 border border-gray-200 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label for="title" class="block text-sm font-medium text-gray-700">Job Title</label>
                        <input
                          id="title"
                          v-model="managerForm.title"
                          type="text"
                          required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm transition-all duration-300 px-3 py-3 border border-gray-200 outline-none"
                        />
                      </div>
                      <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          id="email"
                          v-model="managerForm.email"
                          type="email"
                          required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm transition-all duration-300 px-3 py-3 border border-gray-200 outline-none"
                        />
                      </div>
                      <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          id="phone"
                          v-model="managerForm.phone"
                          type="tel"
                          required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm transition-all duration-300 px-3 py-3 border border-gray-200 outline-none"
                        />
                      </div>
                      <div>
                        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          id="status"
                          v-model="managerForm.status"
                          required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm transition-all duration-300 px-3 py-3 border border-gray-200 outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="onboarding">Onboarding</option>
                        </select>
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label for="clientCount" class="block text-sm font-medium text-gray-700">Client Count</label>
                          <input
                            id="clientCount"
                            v-model="managerForm.clientCount"
                            type="number"
                            min="0"
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm transition-all duration-300 px-3 py-3 border border-gray-200 outline-none"
                          />
                        </div>
                        <div>
                          <label for="aum" class="block text-sm font-medium text-gray-700">AUM ($)</label>
                          <input
                            id="aum"
                            v-model="managerForm.aum"
                            type="number"
                            min="0"
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm transition-all duration-300 px-3 py-3 border border-gray-200 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label for="performance" class="block text-sm font-medium text-gray-700">
                          Performance (%)
                        </label>
                        <input
                          id="performance"
                          v-model="managerForm.performance"
                          type="number"
                          step="0.01"
                          required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm transition-all duration-300 px-3 py-3 border border-gray-200 outline-none"
                        />
                      </div>
  
                      <div class="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          @click="closeManagerModal"
                          class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          class="inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
                          :class="{ 'opacity-75 cursor-not-allowed': isSaving }"
                          :disabled="isSaving"
                        >
                          <span v-if="isSaving" class="flex items-center">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </span>
                          <span v-else>
                            {{ editingManager ? 'Update' : 'Create' }}
                          </span>
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
  
      <!-- View Details Modal -->
      <TransitionRoot appear :show="showViewModal" as="template">
        <Dialog as="div" @close="closeViewModal" class="relative z-50">
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/30" />
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
                <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between">
                    <span>Wealth Manager Details</span>
                    <button
                      @click="closeViewModal"
                      class="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                    >
                      <span class="sr-only">Close</span>
                      <X class="h-5 w-5" />
                    </button>
                  </DialogTitle>
                  <div class="mt-4">
                    <div v-if="selectedManager" class="space-y-6">
                      <div class="flex items-center space-x-4">
                        <div class="h-16 w-16 flex-shrink-0">
                          <img
                            :src="selectedManager.avatar || '/placeholder.svg?height=64&width=64'"
                            :alt="`${selectedManager.firstName} ${selectedManager.lastName}`"
                            class="h-16 w-16 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 class="text-xl font-medium text-gray-900">
                            {{ selectedManager.firstName }} {{ selectedManager.lastName }}
                          </h3>
                          <p class="text-sm text-gray-500">{{ selectedManager.title }}</p>
                          <div class="mt-1 flex items-center">
                            <span
                              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              :class="getStatusClass(selectedManager.status)"
                            >
                              {{ selectedManager.status }}
                            </span>
                          </div>
                        </div>
                      </div>
  
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Contact Information</h4>
                          <div class="mt-2 space-y-2">
                            <div class="flex items-center">
                              <Mail class="h-4 w-4 text-gray-400 mr-2" />
                              <span class="text-sm text-gray-900">{{ selectedManager.email }}</span>
                            </div>
                            <div class="flex items-center">
                              <Phone class="h-4 w-4 text-gray-400 mr-2" />
                              <span class="text-sm text-gray-900">{{ selectedManager.phone }}</span>
                            </div>
                          </div>
                        </div>
  
                        <div>
                          <h4 class="text-sm font-medium text-gray-500">Performance Metrics</h4>
                          <div class="mt-2 space-y-2">
                            <div class="flex items-center justify-between">
                              <span class="text-sm text-gray-500">Clients</span>
                              <span class="text-sm font-medium text-gray-900">{{ selectedManager.clientCount }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                              <span class="text-sm text-gray-500">AUM</span>
                              <span class="text-sm font-medium text-gray-900">{{ formatCurrency(selectedManager.aum) }}</span>
                            </div>
                            <div class="flex items-center justify-between">
                              <span class="text-sm text-gray-500">Performance</span>
                              <div class="flex items-center">
                                <span class="text-sm font-medium" :class="getPerformanceTextColor(selectedManager.performance)">
                                  {{ selectedManager.performance }}%
                                </span>
                                <ArrowUp v-if="selectedManager.performance > 0" class="ml-1 h-3 w-3 text-green-500" />
                                <ArrowDown v-else-if="selectedManager.performance < 0" class="ml-1 h-3 w-3 text-red-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
  
                      <div>
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Performance History</h4>
                        <div class="h-48 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                          <!-- Placeholder for chart -->
                          <div class="text-center text-gray-400">
                            <BarChart3 class="mx-auto h-8 w-8 mb-2" />
                            <p class="text-sm">Performance chart would be displayed here</p>
                          </div>
                        </div>
                      </div>
  
                      <div>
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Client Distribution</h4>
                        <div class="grid grid-cols-3 gap-4">
                          <div class="bg-gray-50 rounded-lg p-4 text-center">
                            <p class="text-sm text-gray-500">High Net Worth</p>
                            <p class="text-xl font-semibold text-gray-900 mt-1">{{ Math.round(selectedManager.clientCount * 0.3) }}</p>
                          </div>
                          <div class="bg-gray-50 rounded-lg p-4 text-center">
                            <p class="text-sm text-gray-500">Affluent</p>
                            <p class="text-xl font-semibold text-gray-900 mt-1">{{ Math.round(selectedManager.clientCount * 0.5) }}</p>
                          </div>
                          <div class="bg-gray-50 rounded-lg p-4 text-center">
                            <p class="text-sm text-gray-500">Mass Market</p>
                            <p class="text-xl font-semibold text-gray-900 mt-1">{{ Math.round(selectedManager.clientCount * 0.2) }}</p>
                          </div>
                        </div>
                      </div>
  
                      <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                          @click="openEditModal(selectedManager)"
                          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300"
                        >
                          <Edit class="h-4 w-4 mr-2" />
                          Edit
                        </button>
                        <button
                          @click="closeViewModal"
                          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300"
                        >
                          Close
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
  
      <!-- Delete Confirmation Modal -->
      <TransitionRoot appear :show="showDeleteModal" as="template">
        <Dialog as="div" @close="closeDeleteModal" class="relative z-50">
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/30" />
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
                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <div class="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-red-100 mb-4">
                    <AlertTriangle class="h-6 w-6 text-red-600" />
                  </div>
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-center text-gray-900">
                    Confirm Deletion
                  </DialogTitle>
                  <div class="mt-3">
                    <p class="text-sm text-center text-gray-500">
                      Are you sure you want to delete
                      <span class="font-medium text-gray-900">
                        {{ selectedManager ? `${selectedManager.firstName} ${selectedManager.lastName}` : '' }}
                      </span>?
                      This action cannot be undone.
                    </p>
                  </div>
  
                  <div class="mt-6 flex justify-center space-x-3">
                    <button
                      type="button"
                      @click="closeDeleteModal"
                      class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      @click="deleteManager"
                      class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300"
                      :class="{ 'opacity-75 cursor-not-allowed': isDeleting }"
                      :disabled="isDeleting"
                    >
                      <span v-if="isDeleting" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </span>
                      <span v-else>Delete</span>
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
  
      <!-- Toast Notification -->
      <Transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showToast"
          class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
        >
          <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
            <div
              class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
            >
              <div class="p-4">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <CheckCircle v-if="toastType === 'success'" class="h-6 w-6 text-green-400" />
                    <AlertCircle v-else class="h-6 w-6 text-red-400" />
                  </div>
                  <div class="ml-3 w-0 flex-1 pt-0.5">
                    <p class="text-sm font-medium text-gray-900">
                      {{ toastMessage }}
                    </p>
                  </div>
                  <div class="ml-4 flex-shrink-0 flex">
                    <button
                      @click="closeToast"
                      class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      <span class="sr-only">Close</span>
                      <X class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
  } from '@headlessui/vue'
  import {
    UserPlus,
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    Trash2,
    Users,
    Wallet,
    TrendingUp,
    TrendingDown,
    ArrowUp,
    ArrowDown,
    Mail,
    Phone,
    BarChart3,
    AlertTriangle,
    CheckCircle,
    AlertCircle,
    X,
    Briefcase,
    Award,
    DollarSign
  } from 'lucide-vue-next'
  
  // Types
  interface WealthManager {
    id: number
    firstName: string
    lastName: string
    title: string
    email: string
    phone: string
    status: 'active' | 'inactive' | 'onboarding'
    clientCount: number
    clientChange: number
    aum: number
    aumChange: number
    performance: number
    avatar?: string
  }
  
  interface ManagerFormData {
    id?: number
    firstName: string
    lastName: string
    title: string
    email: string
    phone: string
    status: 'active' | 'inactive' | 'onboarding'
    clientCount: number
    clientChange?: number
    aum: number
    aumChange?: number
    performance: number
    avatar?: string
  }

  definePageMeta({
      layout: 'admin-dashboard'
  })
  
  // State
  const managers = ref<WealthManager[]>([])
  const isLoading = ref(true)
  const isLoaded = ref(false)
  const searchQuery = ref('')
  const filterStatus = ref('all')
  const sortBy = ref('name')
  const currentPage = ref(1)
  const itemsPerPage = 10
  const showManagerModal = ref(false)
  const showViewModal = ref(false)
  const showDeleteModal = ref(false)
  const isSaving = ref(false)
  const isDeleting = ref(false)
  const selectedManager = ref<WealthManager | null>(null)
  const editingManager = ref<WealthManager | null>(null)
  const showToast = ref(false)
  const toastMessage = ref('')
  const toastType = ref<'success' | 'error'>('success')
  
  // Stats data
  const stats = [
    {
      title: 'Total Wealth Managers',
      value: computed(() => managers.value.length),
      icon: Users,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: 12
    },
    {
      title: 'Active Clients',
      value: computed(() => managers.value.reduce((sum, manager) => sum + manager.clientCount, 0)),
      icon: Briefcase,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: 8
    },
    {
      title: 'Total AUM',
      value: computed(() => formatCurrency(managers.value.reduce((sum, manager) => sum + manager.aum, 0))),
      icon: DollarSign,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      trend: 15
    },
    {
      title: 'Avg. Performance',
      value: computed(() => {
        const avg = managers.value.reduce((sum, manager) => sum + manager.performance, 0) / (managers.value.length || 1);
        return `${avg.toFixed(1)}%`;
      }),
      icon: Award,
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      trend: 5
    }
  ]
  
  // Form initial state
  const managerForm = ref<ManagerFormData>({
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    status: 'active',
    clientCount: 0,
    aum: 0,
    performance: 0
  })
  
  // Computed properties
  const filteredManagers = computed(() => {
    let result = [...managers.value]
    
    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(manager => 
        manager.firstName.toLowerCase().includes(query) ||
        manager.lastName.toLowerCase().includes(query) ||
        manager.email.toLowerCase().includes(query) ||
        manager.title.toLowerCase().includes(query)
      )
    }
    
    // Filter by status
    if (filterStatus.value !== 'all') {
      result = result.filter(manager => manager.status === filterStatus.value)
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy.value) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        case 'clients':
          return b.clientCount - a.clientCount
        case 'aum':
          return b.aum - a.aum
        case 'performance':
          return b.performance - a.performance
        default:
          return 0
      }
    })
    
    return result
  })
  
  const paginatedManagers = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredManagers.value.slice(startIndex, endIndex)
  })
  
  const totalPages = computed(() => {
    return Math.ceil(filteredManagers.value.length / itemsPerPage)
  })
  
  const paginationStart = computed(() => {
    return filteredManagers.value.length === 0
      ? 0
      : (currentPage.value - 1) * itemsPerPage + 1
  })
  
  const paginationEnd = computed(() => {
    return Math.min(currentPage.value * itemsPerPage, filteredManagers.value.length)
  })
  
  const displayedPages = computed(() => {
    const totalPagesCount = totalPages.value
    const current = currentPage.value
    const delta = 1 // Number of pages to show before and after current page
    
    if (totalPagesCount <= 5) {
      return Array.from({ length: totalPagesCount }, (_, i) => i + 1)
    }
    
    const pages = []
    
    // Always include first page
    pages.push(1)
    
    // Calculate range around current page
    const rangeStart = Math.max(2, current - delta)
    const rangeEnd = Math.min(totalPagesCount - 1, current + delta)
    
    // Add ellipsis if needed before range
    if (rangeStart > 2) {
      pages.push(-1) // Use -1 as a marker for ellipsis
    } else if (rangeStart === 2) {
      pages.push(2)
    }
    
    // Add pages in range
    for (let i = Math.max(2, rangeStart); i <= Math.min(totalPagesCount - 1, rangeEnd); i++) {
      pages.push(i)
    }
    
    // Add ellipsis if needed after range
    if (rangeEnd < totalPagesCount - 1) {
      pages.push(-2) // Use -2 as a marker for ellipsis
    } else if (rangeEnd === totalPagesCount - 1) {
      pages.push(totalPagesCount - 1)
    }
    
    // Always include last page
    if (totalPagesCount > 1) {
      pages.push(totalPagesCount)
    }
    
    return pages.filter((value, index, self) => self.indexOf(value) === index)
  })
  
  // Methods
  const fetchManagers = async () => {
    isLoading.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock data
      managers.value = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        firstName: ['John', 'Sarah', 'Michael', 'Emma', 'David'][Math.floor(Math.random() * 5)],
        lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)],
        title: ['Senior Wealth Manager', 'Wealth Advisor', 'Financial Consultant', 'Investment Strategist', 'Portfolio Manager'][Math.floor(Math.random() * 5)],
        email: `example${i + 1}@fintech.com`,
        phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`.substring(0, 14),
        status: ['active', 'inactive', 'onboarding'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'onboarding',
        clientCount: Math.floor(10 + Math.random() * 90),
        clientChange: Math.floor(Math.random() * 10) * (Math.random() > 0.3 ? 1 : -1),
        aum: Math.floor(1000000 + Math.random() * 9000000),
        aumChange: Math.floor(Math.random() * 15) * (Math.random() > 0.3 ? 1 : -1),
        performance: parseFloat((Math.random() * 20 - 5).toFixed(2)),
      }))
      
      isLoaded.value = true
    } catch (error) {
      showToastMessage('Failed to load wealth managers', 'error')
    } finally {
      isLoading.value = false
    }
  }
  
  const openCreateModal = () => {
    editingManager.value = null
    managerForm.value = {
      firstName: '',
      lastName: '',
      title: 'Wealth Advisor',
      email: '',
      phone: '',
      status: 'active',
      clientCount: 0,
      aum: 0,
      performance: 0
    }
    showManagerModal.value = true
  }
  
  const openEditModal = (manager: WealthManager) => {
    editingManager.value = manager
    managerForm.value = { ...manager }
    showManagerModal.value = true
    showViewModal.value = false
  }
  
  const openViewModal = (manager: WealthManager) => {
    selectedManager.value = manager
    showViewModal.value = true
  }
  
  const closeManagerModal = () => {
    showManagerModal.value = false
  }
  
  const closeViewModal = () => {
    showViewModal.value = false
    selectedManager.value = null
  }
  
  const confirmDelete = (manager: WealthManager) => {
    selectedManager.value = manager
    showDeleteModal.value = true
  }
  
  const closeDeleteModal = () => {
    showDeleteModal.value = false
    selectedManager.value = null
  }
  
  const saveManager = async () => {
    isSaving.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingManager.value) {
        // Update existing manager
        const index = managers.value.findIndex(m => m.id === editingManager.value?.id)
        if (index !== -1) {
          // Preserve existing values not in the form
          const updatedManager = {
            ...managers.value[index],
            ...managerForm.value
          }
          managers.value[index] = updatedManager
          showToastMessage(`${updatedManager.firstName} ${updatedManager.lastName} updated successfully`, 'success')
        }
      } else {
        // Create new manager
        const newManager: WealthManager = {
          ...managerForm.value as WealthManager,
          id: Math.max(0, ...managers.value.map(m => m.id)) + 1,
          clientChange: 0,
          aumChange: 0
        }
        managers.value.unshift(newManager)
        showToastMessage(`${newManager.firstName} ${newManager.lastName} added successfully`, 'success')
      }
      
      closeManagerModal()
    } catch (error) {
      showToastMessage(editingManager.value ? 'Failed to update manager' : 'Failed to create manager', 'error')
    } finally {
      isSaving.value = false
    }
  }
  
  const deleteManager = async () => {
    if (!selectedManager.value) return
    
    isDeleting.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const index = managers.value.findIndex(m => m.id === selectedManager.value?.id)
      if (index !== -1) {
        const deletedManager = managers.value[index]
        managers.value.splice(index, 1)
        showToastMessage(`${deletedManager.firstName} ${deletedManager.lastName} deleted successfully`, 'success')
      }
      
      closeDeleteModal()
    } catch (error) {
      showToastMessage('Failed to delete manager', 'error')
    } finally {
      isDeleting.value = false
    }
  }
  
  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      closeToast()
    }, 5000)
  }
  
  const closeToast = () => {
    showToast.value = false
  }
  
  // Helper functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount)
  }
  
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'onboarding':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getPerformanceColor = (performance: number): string => {
    if (performance > 10) return 'bg-green-500'
    if (performance > 5) return 'bg-green-400'
    if (performance > 0) return 'bg-green-300'
    if (performance > -5) return 'bg-red-300'
    if (performance > -10) return 'bg-red-400'
    return 'bg-red-500'
  }
  
  const getPerformanceTextColor = (performance: number): string => {
    if (performance >= 0) return 'text-green-600'
    return 'text-red-600'
  }
  
  // Reset pagination when filters change
  watch([searchQuery, filterStatus, sortBy], () => {
    currentPage.value = 1
  })
  
  // Lifecycle hooks
  onMounted(() => {
    fetchManagers()
  })
  </script>
  
  <style scoped>
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
    opacity: 0;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .wealth-managers-dashboard {
    @apply min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8;
  }
  
  /* Responsive table styles */
  @media (max-width: 768px) {
    .wealth-managers-dashboard {
      @apply p-3;
    }
  }
  
  /* Hover animations */
  .hover\:scale-105 {
    transition: transform 0.2s ease-in-out;
  }
  
  .hover\:scale-105:hover {
    transform: scale(1.05);
  }
  
  .active\:scale-95:active {
    transform: scale(0.95);
  }
  </style>