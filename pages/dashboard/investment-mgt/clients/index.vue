<template>
  <main>
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Investments</h1>
        <!-- <button class="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-md">Add New</button> -->
      </div>
  
      <div class="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="metric in metrics"
          :key="metric.id"
          class="rounded-lg border bg-white p-6 shadow-sm"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ metric.title }}</p>
              <p class="mt-2 text-2xl font-semibold" v-text="metric.getValue()"></p>
            </div>
            <div
              class="rounded-full p-2"
              :class="metric.bgColor"
            >
              <component
                :is="metric.icon"
                class="h-5 w-5"
                :class="metric.iconColor"
              />
            </div>
          </div>
          <div class="mt-4 flex items-center gap-2">
            <div
              class="flex items-center"
              :class="metric.trend > 0 ? 'text-green-600' : 'text-red-600'"
            >
              <component
                :is="metric.trend > 0 ? TrendingUp : TrendingDown"
                class="h-4 w-4"
              />
              <span class="ml-1 text-sm">
                {{ Math.abs(metric.trend) }}%
              </span>
            </div>
            <span class="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
      </div>
  
      <div class="flex gap-4 justify-between mb-6 w-full">
<div class="flex items-center space-x-3">
  <button @click="openAddInvestmentModal = true" class="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <span class="text-lg">+</span> Book Investment
        </button>
        <button @click="showCalculator = true" class="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <path d="M3 6h18"></path>
            <path d="M7 12h10"></path>
            <path d="M10 18h4"></path>
          </svg>
          Investment Calculator
        </button>
</div>

        <!-- Updated Export dropdown button -->
        <div class="relative">
          <button 
            @click.stop="toggleExportDropdown"
            class="download-btn text-sm flex items-center border py-3 px-4 rounded-md justify-center gap-x-2 hover:bg-gray-50 transition-colors duration-300"
          >
            <span>Export Investments</span>
            <ChevronDown class="h-4 w-4" />
          </button>
          
          <!-- Export dropdown menu -->
          <div 
            v-if="showExportDropdown" 
            class="absolute right-0 mt-2 w-56 rounded-md z-50 shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            @click.stop
          >
            <div class="py-1" role="menu" aria-orientation="vertical">
              <button
                @click="downloadInvestments('active')"
                :disabled="isDownloading"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                role="menuitem"
              >
                <span v-if="downloadType === 'active' && isDownloading" class="text-teal-600">
                  Downloading... {{ progress }}%
                </span>
                <span v-else>Active Investments</span>
              </button>
              <button
                @click="downloadInvestments('completed')"
                :disabled="isDownloading"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                role="menuitem"
              >
                <span v-if="downloadType === 'completed' && isDownloading" class="text-teal-600">
                  Downloading... {{ progress }}%
                </span>
                <span v-else>Completed Investments</span>
              </button>
              <button
                @click="downloadInvestments('deactivated')"
                :disabled="isDownloading"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                role="menuitem"
              >
                <span v-if="downloadType === 'deactivated' && isDownloading" class="text-teal-600">
                  Downloading... {{ progress }}%
                </span>
                <span v-else>Deactivated Investments</span>
              </button>
              <div class="border-t border-gray-100 my-1"></div>
              <button
                @click="downloadInvestments('all')"
                :disabled="isDownloading"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-medium"
                role="menuitem"
              >
                <span v-if="downloadType === 'all' && isDownloading" class="text-teal-600">
                  Downloading... {{ progress }}%
                </span>
                <span v-else>All Investments</span>
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <div class="mb-6">
        <div class="border-b">
          <div class="flex">
            <button 
              v-for="tab in tabs" 
              :key="tab.value" 
              @click="handleTabChange(tab.value)"
              :class="[
                'px-4 py-2 border-b-2',
                activeTab === tab.value 
                  ? 'border-teal-700 bg-teal-700 text-white' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
  
        <div class="mt-6 z-0">
          <!-- Search bar -->
          <div class="mb-4 relativ w-1/2 z-0">
            <div class="relative z-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <input
                type="text"
                placeholder="Search investments..."
                class="pl-10 w-full py-3.5 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                v-model="searchQuery"
              />
            </div>
          </div>
  
          <!-- Loading Spinner -->
          <div v-if="isLoading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
          </div>
  
          <!-- Active Tab Content -->
          <div v-else-if="activeTab === 'active'" class="mt-4">
            <div v-if="paginatedInvestments.length > 0" class="overflow-x-auto">
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
                        <button
                          v-if="header.sortable"
                          @click="sortBy(header.key)"
                          class="text-gray-400 hover:text-gray-600"
                        >
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
                  <tr v-for="investment in paginatedInvestments" :key="investment.id">
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ investment.name }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ investment.productName }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ formatCurrency(investment.amount) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ investment.interestRate }}%
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ formatDate(investment.startDate) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ formatDate(investment.maturityDate) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span
                        :class="{
                          'bg-green-100 text-green-800': investment.status === 'active',
                          'bg-blue-100 text-blue-800': investment.status === 'completed',
                          'bg-red-100 text-red-800': investment.status === 'deactivated'
                        }"
                        class="rounded-full px-2 py-1 text-xs font-medium"
                      >
                        {{ investment.status }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-right">
                      <div class="flex justify-end gap-2">
                        <NuxtLink
                          :to="`/dashboard/investment-mgt/clients/${investment.id}`"
                          class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          title="View Details"
                        >
                          <Eye class="h-4 w-4" />
                        </NuxtLink>
                        <button
                          v-if="investment.status === 'active'"
                          @click="showTopUpModal(investment)"
                          class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          title="Top Up"
                        >
                          <PlusCircle class="h-4 w-4" />
                        </button>
                        <button
                          v-if="investment.status === 'active'"
                          @click="showLiquidationModal(investment)"
                          class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                          title="Liquidate"
                        >
                          <Ban class="h-4 w-4" />
                        </button>
                        <button
                          @click="downloadSingleInvestment(investment)"
                          class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          title="Download Report"
                        >
                          <Download class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Empty State -->
            <div v-else class="border rounded-lg flex flex-col items-center justify-center h-64 bg-white">
              <div class="p-6 mb-4 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="h-16 w-16 text-gray-300">
                  <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"></path>
                  <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"></path>
                  <line x1="12" y1="22" x2="12" y2="13"></line>
                  <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"></path>
                </svg>
              </div>
              <p class="text-gray-700 font-medium">
                {{ searchQuery ? "No matching investments found" : "No Active Investments Available" }}
              </p>
              <p v-if="searchQuery" class="text-gray-500 text-sm mt-2">
                Try adjusting your search criteria
              </p>
            </div>
            
            <!-- Pagination -->
            <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between">
              <div class="text-sm text-gray-500">
                Showing {{ paginationStart }} to {{ paginationEnd }} of {{ totalInvestments }} results
              </div>
              <div class="flex gap-1">
                <button
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="rounded px-2 py-1 text-sm disabled:opacity-50"
                  :class="currentPage === 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'"
                >
                  Previous
                </button>
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  class="rounded px-2 py-1 text-sm"
                  :class="currentPage === page ? 'bg-teal-700 text-white' : 'text-gray-700 hover:bg-gray-100'"
                >
                  {{ page }}
                </button>
                <button
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="rounded px-2 py-1 text-sm disabled:opacity-50"
                  :class="currentPage === totalPages ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
  
          <!-- Completed Tab Content -->
          <div v-else-if="activeTab === 'completed'" class="mt-4">
            <!-- Similar table structure as active tab with download button in actions -->
            <div v-if="paginatedInvestments.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <!-- Table headers same as active tab -->
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      v-for="header in tableHeaders"
                      :key="header.key"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      <div class="flex items-center gap-2">
                        {{ header.label }}
                        <button
                          v-if="header.sortable"
                          @click="sortBy(header.key)"
                          class="text-gray-400 hover:text-gray-600"
                        >
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
                  <tr v-for="investment in paginatedInvestments" :key="investment.id">
                    <!-- Same row structure as active tab -->
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ investment.name }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ investment.productName }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ formatCurrency(investment.amount) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ investment.interestRate }}%
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ formatDate(investment.startDate) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ formatDate(investment.maturityDate) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span
                        :class="{
                          'bg-green-100 text-green-800': investment.status === 'active',
                          'bg-blue-100 text-blue-800': investment.status === 'completed',
                          'bg-red-100 text-red-800': investment.status === 'deactivated'
                        }"
                        class="rounded-full px-2 py-1 text-xs font-medium"
                      >
                        {{ investment.status }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-right">
                      <div class="flex justify-end gap-2">
                        <NuxtLink
                          :to="`/dashboard/investment-mgt/clients/${investment.id}`"
                          class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          title="View Details"
                        >
                          <Eye class="h-4 w-4" />
                        </NuxtLink>
                        <button
                          @click="downloadSingleInvestment(investment)"
                          class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          title="Download Report"
                        >
                          <Download class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Empty State (same as active tab) -->
            <div v-else class="border rounded-lg flex flex-col items-center justify-center h-64 bg-white">
              <div class="p-6 mb-4 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="h-16 w-16 text-gray-300">
                  <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"></path>
                  <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"></path>
                  <line x1="12" y1="22" x2="12" y2="13"></line>
                  <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"></path>
                </svg>
              </div>
              <p class="text-gray-700 font-medium">
                {{ searchQuery ? "No matching investments found" : "No Completed Investments Available" }}
              </p>
              <p v-if="searchQuery" class="text-gray-500 text-sm mt-2">
                Try adjusting your search criteria
              </p>
            </div>
            
            <!-- Pagination (same as active tab) -->
            <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between">
              <div class="text-sm text-gray-500">
                Showing {{ paginationStart }} to {{ paginationEnd }} of {{ totalInvestments }} results
              </div>
              <div class="flex gap-1">
                <button
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="rounded px-2 py-1 text-sm disabled:opacity-50"
                  :class="currentPage === 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'"
                >
                  Previous
                </button>
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  class="rounded px-2 py-1 text-sm"
                  :class="currentPage === page ? 'bg-teal-700 text-white' : 'text-gray-700 hover:bg-gray-100'"
                >
                  {{ page }}
                </button>
                <button
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="rounded px-2 py-1 text-sm disabled:opacity-50"
                  :class="currentPage === totalPages ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
  
          <!-- Deactivated Tab Content -->
          <div v-else-if="activeTab === 'deactivated'" class="mt-4">
            <!-- Similar table structure as active tab with download button in actions -->
            <div v-if="paginatedInvestments.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <!-- Table headers same as active tab -->
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      v-for="header in tableHeaders"
                      :key="header.key"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      <div class="flex items-center gap-2">
                        {{ header.label }}
                        <button
                          v-if="header.sortable"
                          @click="sortBy(header.key)"
                          class="text-gray-400 hover:text-gray-600"
                        >
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
                  <tr v-for="investment in paginatedInvestments" :key="investment.id">
                    <!-- Same row structure as active tab -->
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ investment.name }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ investment.productName }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ formatCurrency(investment.amount) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ investment.interestRate }}%
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ formatDate(investment.startDate) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      {{ formatDate(investment.maturityDate) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span
                        :class="{
                          'bg-green-100 text-green-800': investment.status === 'active',
                          'bg-blue-100 text-blue-800': investment.status === 'completed',
                          'bg-red-100 text-red-800': investment.status === 'deactivated'
                        }"
                        class="rounded-full px-2 py-1 text-xs font-medium"
                      >
                        {{ investment.status }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-right">
                      <div class="flex justify-end gap-2">
                        <NuxtLink
                          :to="`/dashboard/investment-mgt/clients/${investment.id}`"
                          class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          title="View Details"
                        >
                          <Eye class="h-4 w-4" />
                        </NuxtLink>
                        <button
                          @click="downloadSingleInvestment(investment)"
                          class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          title="Download Report"
                        >
                          <Download class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Empty State (same as active tab) -->
            <div v-else class="border rounded-lg flex flex-col items-center justify-center h-64 bg-white">
              <div class="p-6 mb-4 animate-spin">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="h-16 w-16 text-gray-300">
                  <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"></path>
                  <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"></path>
                  <line x1="12" y1="22" x2="12" y2="13"></line>
                  <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"></path>
                </svg>
              </div>
              <p class="text-gray-700 font-medium">
                {{ searchQuery ? "No matching investments found" : "No Deactivated Investments Available" }}
              </p>
              <p v-if="searchQuery" class="text-gray-500 text-sm mt-2">
                Try adjusting your search criteria
              </p>
            </div>
            
            <!-- Pagination (same as active tab) -->
            <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between">
              <div class="text-sm text-gray-500">
                Showing {{ paginationStart }} to {{ paginationEnd }} of {{ totalInvestments }} results
              </div>
              <div class="flex gap-1">
                <button
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="rounded px-2 py-1 text-sm disabled:opacity-50"
                  :class="currentPage === 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'"
                >
                  Previous
                </button>
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  class="rounded px-2 py-1 text-sm"
                  :class="currentPage === page ? 'bg-teal-700 text-white' : 'text-gray-700 hover:bg-gray-100'"
                >
                  {{ page }}
                </button>
                <button
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="rounded px-2 py-1 text-sm disabled:opacity-50"
                  :class="currentPage === totalPages ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Overlay for dropdown -->
      <div
        v-if="showExportDropdown"
        @click="closeAllDropdowns"
        class="fixed inset-0 z-40"
        style="background: transparent"
      ></div>
    </div>
  
    <!-- Modals remain the same as in the original code -->
    <TransitionRoot appear :show="showCalculator" as="template">
        <Dialog
          as="div"
          @close="showCalculator = false"
          class="relative z-50"
        >
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25" />
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
                <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] rounded-xl mx-auto lg:w-[500px] max-w-[5200px]  bg-white p-6">
                  <DialogTitle class="text-lg font-medium">
                    Investment Calculator
                  </DialogTitle>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Investment Amount
                      </label>
                      <input
                        v-model="calculator.amount"
                        type="number"
                        class="mt-1 block w-full py-3 px-3 rounded-lg border-[0.5px] outline-none rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Annual Return Rate (%)
                      </label>
                      <input
                        v-model="calculator.returns"
                        type="number"
                        step="0.01"
                        class="mt-1 block w-full py-3 px-3 rounded-lg border-[0.5px] outline-none rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Investment Period (months)
                      </label>
                      <input
                        v-model="calculator.tenor"
                        type="number"
                        class="mt-1 block w-full py-3 px-3 rounded-lg border-[0.5px] outline-none rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
  
                    <div class="rounded-lg bg-gray-50 p-4">
                      <h4 class="text-sm font-medium text-gray-900">Results</h4>
                      <div class="mt-3 space-y-2">
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Total Returns:</span>
                          <span class="font-medium">{{ formatCurrency(calculatedReturns) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Maturity Amount:</span>
                          <span class="font-medium">{{ formatCurrency(calculatedMaturityAmount) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Monthly Returns:</span>
                          <span class="font-medium">{{ formatCurrency(calculatedMonthlyReturns) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
  
      <TransitionRoot appear :show="showBookingModal" as="template">
        <Dialog
          as="div"
          @close="showBookingModal = false"
          class="relative z-50"
        >
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25" />
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
                <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] rounded-xl mx-auto lg:w-[500px] max-w-[5200px]  bg-white p-6">
                  <DialogTitle class="text-lg font-medium">
                    Book New Investment
                  </DialogTitle>
                  <form @submit.prevent="handleBooking" class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Client Name
                      </label>
                      <input
                        v-model="bookingForm.client"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Investment Product
                      </label>
                      <select
                        v-model="bookingForm.productId"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      >
                        <option value="">Select a product</option>
                        <option
                          v-for="product in availableProducts"
                          :key="product.id"
                          :value="product.id"
                        >
                          {{ product.name }} ({{ product.returns }}% - {{ product.tenor }} months)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Investment Amount
                      </label>
                      <input
                        v-model="bookingForm.amount"
                        type="number"
                        required
                        :min="selectedProduct?.minAmount"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                      <p
                        v-if="selectedProduct"
                        class="mt-1 text-xs text-gray-500"
                      >
                        Minimum amount: {{ formatCurrency(selectedProduct.minAmount) }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                        v-model="bookingForm.startDate"
                        type="date"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
  
                    <div
                      v-if="selectedProduct"
                      class="rounded-lg bg-gray-50 p-4"
                    >
                      <h4 class="text-sm font-medium text-gray-900">Investment Summary</h4>
                      <div class="mt-3 space-y-2">
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Returns Rate:</span>
                          <span class="font-medium">{{ selectedProduct.returns }}%</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Tenor:</span>
                          <span class="font-medium">{{ selectedProduct.tenor }} months</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Maturity Date:</span>
                          <span class="font-medium">{{ calculateMaturityDate(bookingForm.startDate, selectedProduct.tenor) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Expected Returns:</span>
                          <span class="font-medium">{{ formatCurrency(calculateReturns(bookingForm.amount, selectedProduct.returns, selectedProduct.tenor)) }}</span>
                        </div>
                      </div>
                    </div>
  
                    <div class="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        @click="showBookingModal = false"
                        class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                      >
                        Book Investment
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
  
      <TransitionRoot appear :show="!!topUpInvestment" as="template">
        <Dialog
          as="div"
          @close="topUpInvestment = null"
          class="relative z-50"
        >
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25" />
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
                <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] rounded-xl mx-auto lg:w-[500px] max-w-[5200px]  bg-white p-6">
                  <DialogTitle class="text-lg font-medium">
                    Top Up Investment
                  </DialogTitle>
                  <form @submit.prevent="handleTopUp" class="mt-4 space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Current Amount
                      </label>
                      <p class="mt-1 text-lg font-medium">
                        {{ formatCurrency(topUpInvestment?.amount) }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Top Up Amount
                      </label>
                      <input
                        v-model="topUpForm.amount"
                        type="number"
                        required
                        class="mt-1 py-3 rounded-lg border-[0.5px] outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        @click="topUpInvestment = null"
                        class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                      >
                        Confirm Top Up
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>

    
      <TransitionRoot appear :show="!!liquidatingInvestment" as="template">
  <Dialog
    as="div"
    @close="liquidatingInvestment = null"
    class="relative z-50"
  >
    <TransitionChild
      enter="duration-300 ease-out"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="duration-200 ease-in"
      leave-from="opacity-100"
      leave-to="opacity-0"
    >
      <div class="fixed inset-0 bg-black/25" />
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
          <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] rounded-xl mx-auto lg:w-[500px] max-w-[5200px] bg-white p-6 shadow-lg">
            <DialogTitle class="text-lg font-medium">
              Liquidate Investment
            </DialogTitle>
            <div class="mt-4 space-y-4">
              <p class="text-sm text-gray-500">
                Are you sure you want to liquidate this investment? This action cannot be undone.
              </p>
              <div class="rounded-lg bg-gray-50 p-4">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Investment Amount:</span>
                    <span class="font-medium">{{ formatCurrency(liquidatingInvestment?.amount) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Early Liquidation Fee:</span>
                    <span class="font-medium text-red-600">{{ formatCurrency(liquidationFee) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500">Net Amount:</span>
                    <span class="font-medium">{{ formatCurrency(liquidationAmount) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Toggle Component -->
              <div class="mt-4 flex items-center">
                <button 
                  type="button" 
                  @click="acceptTerms = !acceptTerms"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  :class="acceptTerms ? 'bg-indigo-600' : 'bg-gray-200'"
                  role="switch"
                  :aria-checked="acceptTerms"
                >
                  <span 
                    aria-hidden="true" 
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="acceptTerms ? 'translate-x-5' : 'translate-x-0'"
                  ></span>
                </button>
                <span class="ml-3 text-sm text-gray-700">
                  Would you want the Liquidation fee should be removed from the investment interest ?
                </span>
              </div>
              
              <div class="mt-6 flex justify-end gap-3">
                <button
                  @click="liquidatingInvestment = null"
                  class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  @click="confirmLiquidation"
                  :disabled="processing"
                  class="rounded-md bg-red-600 disabled:cursor-not-allowed disabled:opacity-25 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                   {{ processing ? 'processing..' : 'Confirm Liquidation'}}
                </button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </div>
  </Dialog>
</TransitionRoot>
  
      <!-- <TransitionRoot appear :show="!!liquidatingInvestment" as="template">
        <Dialog
          as="div"
          @close="liquidatingInvestment = null"
          class="relative z-50"
        >
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25" />
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
                <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] rounded-xl mx-auto lg:w-[500px] max-w-[5200px]  bg-white p-6">
                  <DialogTitle class="text-lg font-medium">
                    Liquidate Investment
                  </DialogTitle>
                  <div class="mt-4 space-y-4">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to liquidate this investment? This action cannot be undone.
                    </p>
                    <div class="rounded-lg bg-gray-50 p-4">
                      <div class="space-y-2">
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Investment Amount:</span>
                          <span class="font-medium">{{ formatCurrency(liquidatingInvestment?.amount) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Early Liquidation Fee:</span>
                          <span class="font-medium text-red-600">{{ formatCurrency(liquidationFee) }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-sm text-gray-500">Net Amount:</span>
                          <span class="font-medium">{{ formatCurrency(liquidationAmount) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                      <button
                        @click="liquidatingInvestment = null"
                        class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        @click="confirmLiquidation"
                        class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Confirm Liquidation
                      </button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot> -->
  
      <TransitionRoot appear :show="!!openAddInvestmentModal" as="template">
        <Dialog
          as="div"
          @close="openAddInvestmentModal = false"
          class="relative z-50"
        >
        <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25" />
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
                <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] rounded-xl mx-auto lg:w-[500px] max-w-[5200px]  bg-white p-6">
                  <DialogTitle class="text-lg font-medium">
                    Book Investment
                  </DialogTitle>
                  <ModulesUserInvestmentCreate @cancel="openAddInvestmentModal = false" />
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
      </Dialog>
        </TransitionRoot>
  </main>
  </template>
  
  <script setup lang="ts">
  import { useCSVDownload } from '@/composables/useCSVDownload'
  import { useLiquidateInvestment } from "@/composables/modules/investments/useLiquidateInvestment"
  import { formatCurrency } from "@/utils/formatter"
  import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
  } from '@headlessui/vue'
  const { isDownloading, progress, downloadPaginatedCSV } = useCSVDownload()
  const { liquidateInvestment, setLiquidatePayload, loading: processing } = useLiquidateInvestment()
  import {
    Plus,
    ArrowUpDown,
    Calculator,
    Search,
    Eye,
    PlusCircle,
    Ban,
    TrendingUp,
    TrendingDown,
    Users,
    Wallet,
    ArrowUpRight,
    AlertTriangle,
    Download,
    ChevronDown
  } from 'lucide-vue-next'
  
  const openAddInvestmentModal = ref(false)
  
  // Table configuration
  const tableHeaders = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'productName', label: 'Product', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'interestRate', label: 'Interest Rate', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'maturityDate', label: 'Maturity Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
  ]
  
  // Tab configuration
  const tabs = [
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Deactivated', value: 'deactivated' }
  ];
  
  // Import composables for investments
  import { useActiveInvestments } from '@/composables/modules/investments/useActiveInvestments'
  import { useCompletedInvestments } from '@/composables/modules/investments/useCompletedInvestments'
  import { useDeactivatedInvestments } from '@/composables/modules/investments/useDeactivatedInvestments'
  
  // Initialize composables
  const { activeInvestments, loading: fetchingActiveInvestments } = useActiveInvestments()
  const { completedInvestments, loading: fetchingCompletedInvestments } = useCompletedInvestments()
  const { deactivatedInvestments, loading: fetchingDeactivatedInvestments } = useDeactivatedInvestments()
  
  // State
  const activeTab = ref('active');
  const searchQuery = ref('');
  const activeDropdown = ref<number | null>(null);
  const sortKey = ref('startDate')
  const sortOrder = ref('desc')
  const currentPage = ref(1)
  const itemsPerPage = 10
  const isLoading = ref(false)
  
  const showCalculator = ref(false)
  const showBookingModal = ref(false)
  const topUpInvestment = ref(null)
  const liquidatingInvestment = ref(null)
  
  // New state for export dropdown
  const showExportDropdown = ref(false)
  const downloadType = ref('')

  // Function to toggle export dropdown
  const toggleExportDropdown = (event) => {
    // Stop event propagation to prevent immediate closing
    event.stopPropagation()
    showExportDropdown.value = !showExportDropdown.value
    if (showExportDropdown.value) {
      activeDropdown.value = null
    }
  }

  // Function to close all dropdowns
  const closeAllDropdowns = () => {
    activeDropdown.value = null
    showExportDropdown.value = false
  }

  // Function to download investments by type
  const downloadInvestments = async (type: string) => {
    downloadType.value = type
    try {
      let endpoint = ''
      let filename = ''
      let title = ''
      
      switch (type) {
        case 'active':
          endpoint = '/investment/active-investments'
          filename = 'active_investments.csv'
          title = 'Active Investments'
          break
        case 'completed':
          endpoint = '/investment/completed-investments'
          filename = 'completed_investments.csv'
          title = 'Completed Investments'
          break
        case 'deactivated':
          endpoint = '/investment/deactivated-investments'
          filename = 'deactivated_investments.csv'
          title = 'Deactivated Investments'
          break
        // case 'all':
        //   endpoint = '/investment/all-investments'
        //   filename = 'all_investments.csv'
        //   title = 'All Investments'
        //   break
        default:
          endpoint = '/investment/active-investments'
          filename = 'investments.csv'
          title = 'Investments'
      }
      
      await downloadPaginatedCSV(
        endpoint,
        {
          title,
          filename,
          dataPath: `data.${type}Investments`,
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
        { sort: 'name', order: 'asc' }
      )
    } finally {
      showExportDropdown.value = false
      setTimeout(() => {
        downloadType.value = ''
      }, 1000)
    }
  }

  // Function to download a single investment report
  const downloadSingleInvestment = async (investment) => {
    try {
      await downloadPaginatedCSV(
        `/investment/${investment.id}/report`,
        {
          title: `${investment.name} Investment Report`,
          filename: `investment_${investment.id}_report.csv`,
          dataPath: 'data.investment',
          flattenObjects: true,
          nestedDelimiter: '_',
          includeHeaders: true
        }
      )
    } catch (error) {
      console.error('Error downloading investment report:', error)
    }
  }

  // Helper function to format header names
  const formatHeader = (header: string): string => {
    return header
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const metrics = [
    {
      id: 1,
      title: "Total Active Investments",
      // Use a method instead of a computed property to avoid string literal rendering
      getValue() {
        const total = activeInvestments.value.reduce((sum, inv) => sum + Number(inv.amount), 0)
        return formatCurrency(total)
      },
      icon: Wallet,
      trend: 15,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Active Clients",
      getValue() {
        return activeInvestments.value.length
      },
      icon: Users,
      trend: 8,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: 3,
      title: "Average Returns",
      getValue() {
        if (activeInvestments.value.length === 0) return "0.0%"
        const avg =
          activeInvestments.value.reduce((sum, inv) => sum + Number(inv.interestRate), 0) / activeInvestments.value.length
        return `${avg.toFixed(1)}%`
      },
      icon: ArrowUpRight,
      trend: 5,
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      id: 4,
      title: "Pending Liquidations",
      getValue() {
        return 0
      },
      icon: AlertTriangle,
      trend: 0,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ]
  
  // Handle tab change with loading state
  const handleTabChange = (tabValue) => {
    if (activeTab.value === tabValue) return;
    
    isLoading.value = true;
    activeTab.value = tabValue;
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      isLoading.value = false;
    }, 800);
    
    // Reset pagination
    currentPage.value = 1;
  }
  
  // Get investments based on active tab
  const currentInvestments = computed(() => {
    switch (activeTab.value) {
      case 'active':
        return activeInvestments.value
      case 'completed':
        return completedInvestments.value
      case 'deactivated':
        return deactivatedInvestments.value
      default:
        return []
    }
  })
  
  // Filtered investments based on search query
  const filteredInvestments = computed(() => {
    if (!searchQuery.value) return currentInvestments.value;
    
    const query = searchQuery.value.toLowerCase();
    return currentInvestments.value.filter(investment => 
      investment.name.toLowerCase().includes(query) ||
      investment.productName?.toLowerCase().includes(query) ||
      investment.amount.toString().includes(query) ||
      investment.interestRate.toString().includes(query) ||
      investment.status.toLowerCase().includes(query)
    );
  })
  
  // Sorted investments
  const sortedInvestments = computed(() => {
    return [...filteredInvestments.value].sort((a, b) => {
      let aValue = a[sortKey.value];
      let bValue = b[sortKey.value];
      
      // Handle dates
      if (sortKey.value === 'startDate' || sortKey.value === 'maturityDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // Handle strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  })
  
  // Paginated investments
  const paginatedInvestments = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedInvestments.value.slice(start, end);
  })
  
  const totalInvestments = computed(() => filteredInvestments.value.length)
  const totalPages = computed(() => Math.max(1, Math.ceil(totalInvestments.value / itemsPerPage)))
  
  const paginationStart = computed(() => 
    totalInvestments.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1
  )
  
  const paginationEnd = computed(() =>
    Math.min(currentPage.value * itemsPerPage, totalInvestments.value)
  )
  
  // Available Products
  const availableProducts = ref([
    {
      id: 1,
      name: 'Fixed Income Plus',
      returns: 15,
      tenor: 12,
      minAmount: 10000,
    },
    {
      id: 2,
      name: 'High Yield Fund',
      returns: 18,
      tenor: 24,
      minAmount: 25000,
    },
    // Add more products...
  ])
  
  // Selected product for booking form
  const selectedProduct = computed(() => {
    if (!bookingForm.value.productId) return null;
    return availableProducts.value.find(p => p.id.toString() === bookingForm.value.productId.toString()) || null;
  })
  
  // Calculator computed values
  const calculatedReturns = computed(() => {
    const amount = parseFloat(calculator.value.amount) || 0;
    const returns = parseFloat(calculator.value.returns) || 0;
    const tenor = parseFloat(calculator.value.tenor) || 0;
    return amount * (returns / 100) * (tenor / 12);
  })
  
  const calculatedMaturityAmount = computed(() => {
    const amount = parseFloat(calculator.value.amount) || 0;
    return amount + calculatedReturns.value;
  })
  
  const calculatedMonthlyReturns = computed(() => {
    const tenor = parseFloat(calculator.value.tenor) || 1;
    return calculatedReturns.value / tenor;
  })
  
  // Liquidation computed values
  const liquidationFee = computed(() => {
    if (!liquidatingInvestment.value) return 0;
    // Example: 2% early liquidation fee
    return liquidatingInvestment.value.amount * 0.02;
  })
  
  const liquidationAmount = computed(() => {
    if (!liquidatingInvestment.value) return 0;
    return liquidatingInvestment.value.amount - liquidationFee.value;
  })
  
  // Methods
  const sortBy = (key: string) => {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey.value = key;
      sortOrder.value = 'asc';
    }
  }
  
  const calculateMaturityDate = (startDate: string, tenor: number) => {
    if (!startDate) return '';
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + tenor);
    return date.toLocaleDateString();
  }
  
  const calculateReturns = (amount: number, returns: number, tenor: number) => {
    return amount * (returns / 100) * (tenor / 12);
  }
  
  const showTopUpModal = (investment: any) => {
    topUpInvestment.value = investment;
    topUpForm.value.amount = '';
  }
  
  const showLiquidationModal = (investment: any) => {
    liquidatingInvestment.value = investment;
  }
  
  const closeDropdown = () => {
    activeDropdown.value = null;
  }
  
  const handleBooking = () => {
    // Implementation would go here
    console.log('Booking investment:', bookingForm.value);
    showBookingModal.value = false;
    // Reset form
    bookingForm.value = {
      client: '',
      productId: '',
      amount: '',
      startDate: '',
    };
  }
  
  const handleTopUp = () => {
    // Implementation would go here
    console.log('Topping up investment:', {
      investment: topUpInvestment.value,
      amount: topUpForm.value.amount
    });
    topUpInvestment.value = null;
  }

  // Add this to your ref declarations
const acceptTerms = ref(false)
  
  const confirmLiquidation = async () => {
    // Implementation would go here
    console.log('Liquidating investment:', liquidatingInvestment.value);
    // liquidatingInvestment.value = null;
    const payload = {
      pre_liquidation_charge: acceptTerms.value ? 'Yes' : 'No'
    }
    setLiquidatePayload(payload)
    await liquidateInvestment(liquidatingInvestment.value.id)
    //Call endpoint to liquidate investment on admin
    // acceptTerms.value = false; // Reset toggle state
  }
  
  // Forms
  const calculator = ref({
    amount: '',
    returns: '',
    tenor: '',
  })
  
  const bookingForm = ref({
    client: '',
    productId: '',
    amount: '',
    startDate: '',
  })
  
  const topUpForm = ref({
    amount: '',
  })
  
  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }
  
  const formatCurrency = (amount: number): string => {
    if (amount === undefined || amount === null) return '₦0.00';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount).replace('NGN', '₦');
  }
  
  // Reset pagination when search changes
  watch(searchQuery, () => {
    currentPage.value = 1;
  })
  
  // Lifecycle hooks
  onMounted(() => {
  // Add click event listener to document to close dropdowns when clicking outside
    document.addEventListener("click", (event) => {
      // Close dropdowns when clicking outside
      closeAllDropdowns()
    })
  })
  
  onBeforeUnmount(() => {
    // Remove event listener when component is unmounted
    document.removeEventListener("click", closeAllDropdowns)
  })
  
  definePageMeta({
    layout: 'admin-dashboard',
    middleware: 'auth'
  })
  </script>

<style scoped>
/* Add this to ensure dropdown appears above other elements */
.relative {
  position: relative;
  z-index: 50;
}
</style>