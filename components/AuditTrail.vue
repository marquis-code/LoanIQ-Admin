<template>
    <div class="w-full p-4 sm:p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Audit Trail</h1>
      
      <!-- Search and Filter -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <div class="relative flex-grow">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search audits..." 
            class="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          />
          <span class="absolute right-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        
        <div class="flex gap-2">
          <select 
            v-model="filterAction" 
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          >
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
          </select>
          
          <button 
            @click="clearFilters" 
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
          >
            Clear
          </button>
        </div>
      </div>
      
      <!-- Desktop Table -->
      <div class="hidden md:block overflow-hidden rounded-lg border-[0.5px] border-gray-100 shadow-sm animate-fade-in">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">Admin Name</th>
              <th class="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">Action</th>
              <th class="px-6 py-4 font-medium text-gray-700">Description</th>
              <th class="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">Date & Time</th>
              <th class="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">View</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(audit, index) in filteredAudits" 
              :key="audit.id"
              class="border-b-[0.5px] border-gray-100 hover:bg-gray-50 transition-colors duration-300"
              :class="{'animate-slide-in': true}"
              :style="{ animationDelay: `${index * 0.05}s` }"
            >
              <td class="px-6 py-4 font-medium">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                    {{ getInitials(audit.adminName) }}
                  </div>
                  {{ audit.adminName }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': audit.action === 'CREATE',
                    'bg-blue-100 text-blue-800': audit.action === 'UPDATE',
                    'bg-red-100 text-red-800': audit.action === 'DELETE',
                    'bg-purple-100 text-purple-800': audit.action === 'LOGIN',
                    'bg-gray-100 text-gray-800': audit.action === 'LOGOUT'
                  }"
                >
                  {{ audit.action }}
                </span>
              </td>
              <td class="px-6 py-4 max-w-md">
                {{ audit.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ formatDateTime(audit.datetime) }}
              </td>
              <td class="px-6 py-4">
                <button 
                  @click="viewAuditDetails(audit)"
                  class="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Mobile Cards -->
      <div class="md:hidden space-y-4">
        <div 
          v-for="(audit, index) in filteredAudits" 
          :key="audit.id"
          class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 animate-fade-in"
          :class="{'animate-slide-in': true}"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                {{ getInitials(audit.adminName) }}
              </div>
              <div>
                <h3 class="font-medium">{{ audit.adminName }}</h3>
                <span 
                  class="px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': audit.action === 'CREATE',
                    'bg-blue-100 text-blue-800': audit.action === 'UPDATE',
                    'bg-red-100 text-red-800': audit.action === 'DELETE',
                    'bg-purple-100 text-purple-800': audit.action === 'LOGIN',
                    'bg-gray-100 text-gray-800': audit.action === 'LOGOUT'
                  }"
                >
                  {{ audit.action }}
                </span>
              </div>
            </div>
            <button 
              @click="viewAuditDetails(audit)"
              class="text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          
          <p class="text-sm text-gray-600 mb-2">{{ audit.description }}</p>
          <p class="text-xs text-gray-500">{{ formatDateTime(audit.datetime) }}</p>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="flex justify-between items-center mt-6">
        <p class="text-sm text-gray-500">
          Showing <span class="font-medium">{{ Math.min(1, filteredAudits.length) }}</span> to 
          <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredAudits.length) }}</span> of 
          <span class="font-medium">{{ filteredAudits.length }}</span> audits
        </p>
        
        <div class="flex gap-2">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors duration-300"
          >
            Previous
          </button>
          <button 
            @click="nextPage" 
            :disabled="currentPage * itemsPerPage >= filteredAudits.length"
            class="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors duration-300"
          >
            Next
          </button>
        </div>
      </div>
      
      <!-- Details Modal -->
      <Teleport to="body">
        <div 
          v-if="selectedAudit" 
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          @click.self="selectedAudit = null"
        >
          <div 
            class="bg-white rounded-lg shadow-xl w-full max-w-lg animate-modal-in"
            @click.stop
          >
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-800">Audit Details</h2>
                <button 
                  @click="selectedAudit = null" 
                  class="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
                    {{ getInitials(selectedAudit.adminName) }}
                  </div>
                  <div>
                    <h3 class="font-medium">{{ selectedAudit.adminName }}</h3>
                    <span 
                      class="px-2 py-0.5 rounded-full text-xs font-medium"
                      :class="{
                        'bg-green-100 text-green-800': selectedAudit.action === 'CREATE',
                        'bg-blue-100 text-blue-800': selectedAudit.action === 'UPDATE',
                        'bg-red-100 text-red-800': selectedAudit.action === 'DELETE',
                        'bg-purple-100 text-purple-800': selectedAudit.action === 'LOGIN',
                        'bg-gray-100 text-gray-800': selectedAudit.action === 'LOGOUT'
                      }"
                    >
                      {{ selectedAudit.action }}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Description</label>
                  <p class="text-gray-800">{{ selectedAudit.description }}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Date & Time</label>
                  <p class="text-gray-800">{{ formatDetailDateTime(selectedAudit.datetime) }}</p>
                </div>
                
                <div v-if="selectedAudit.details">
                  <label class="block text-sm font-medium text-gray-600 mb-1">Additional Details</label>
                  <pre class="bg-gray-50 p-3 rounded text-sm text-gray-800 overflow-auto max-h-48">{{ JSON.stringify(selectedAudit.details, null, 2) }}</pre>
                </div>
              </div>
            </div>
            
            <div class="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
              <button 
                @click="selectedAudit = null" 
                class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  
  interface AuditDetail {
    field?: string;
    oldValue?: any;
    newValue?: any;
    [key: string]: any;
  }
  
  interface Audit {
    id: string;
    adminName: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
    description: string;
    datetime: string;
    details?: AuditDetail;
  }
  
  // State
  const auditLogs = ref<Audit[]>([]);
  const searchQuery = ref('');
  const filterAction = ref('');
  const selectedAudit = ref<Audit | null>(null);
  const currentPage = ref(1);
  const itemsPerPage = 10;
  
  // Generate dummy data
  const generateDummyData = () => {
    const actions: Audit['action'][] = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'];
    const adminNames = ['John Smith', 'Emily Johnson', 'Michael Brown', 'Sarah Wilson', 'David Thompson'];
    
    const dummyLogs: Audit[] = [];
    
    // Generate 50 logs with different dates (newest first)
    for (let i = 0; i < 50; i++) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const adminName = adminNames[Math.floor(Math.random() * adminNames.length)];
      
      let description = '';
      let details: AuditDetail | undefined;
      
      switch (action) {
        case 'CREATE':
          description = `Created a new user account for ${['Alice Smith', 'Bob Johnson', 'Carol White', 'Dave Miller'][Math.floor(Math.random() * 4)]}`;
          details = {
            entityType: 'User',
            entityId: `user-${Math.floor(Math.random() * 10000)}`
          };
          break;
        case 'UPDATE':
          description = `Updated product information for ${['Laptop Pro', 'Smartphone X', 'Wireless Headphones', 'Smart Watch'][Math.floor(Math.random() * 4)]}`;
          details = {
            entityType: 'Product',
            entityId: `prod-${Math.floor(Math.random() * 10000)}`,
            field: 'price',
            oldValue: `$${Math.floor(Math.random() * 100) + 100}`,
            newValue: `$${Math.floor(Math.random() * 100) + 100}`
          };
          break;
        case 'DELETE':
          description = `Removed ${['expired promotion', 'inactive account', 'duplicate entry', 'old record'][Math.floor(Math.random() * 4)]}`;
          details = {
            entityType: ['Promotion', 'Account', 'Entry', 'Record'][Math.floor(Math.random() * 4)],
            entityId: `id-${Math.floor(Math.random() * 10000)}`
          };
          break;
        case 'LOGIN':
          description = `Admin login from ${['192.168.1.', '10.0.0.', '172.16.0.'][Math.floor(Math.random() * 3)]}${Math.floor(Math.random() * 255)}`;
          details = {
            browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
            device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
            location: ['New York', 'London', 'Tokyo', 'Sydney'][Math.floor(Math.random() * 4)]
          };
          break;
        case 'LOGOUT':
          description = 'Admin logged out';
          break;
      }
      
      // Generate date within the last month
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
      
      dummyLogs.push({
        id: `audit-${i}`,
        adminName,
        action,
        description,
        datetime: date.toISOString(),
        details
      });
    }
    
    auditLogs.value = dummyLogs;
  };
  
  // Computed
  const filteredAudits = computed(() => {
    let result = [...auditLogs.value];
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(audit => 
        audit.adminName.toLowerCase().includes(query) ||
        audit.description.toLowerCase().includes(query)
      );
    }
    
    if (filterAction.value) {
      result = result.filter(audit => audit.action === filterAction.value);
    }
    
    return result;
  });
  
  // Methods
  const clearFilters = () => {
    searchQuery.value = '';
    filterAction.value = '';
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatDetailDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  const viewAuditDetails = (audit: Audit) => {
    selectedAudit.value = audit;
  };
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
  
  const nextPage = () => {
    if (currentPage.value * itemsPerPage < filteredAudits.value.length) {
      currentPage.value++;
    }
  };
  
  // Lifecycle
  onMounted(() => {
    generateDummyData();
  });
  </script>
  
  <style scoped>
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .animate-slide-in {
    animation: slideIn 0.5s ease-out forwards;
    opacity: 0;
    transform: translateY(20px);
  }
  
  .animate-modal-in {
    animation: modalIn 0.3s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  </style>