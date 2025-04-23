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
          <option v-for="action in uniqueActions" :key="action" :value="action">
            {{ formatActionName(action) }}
          </option>
        </select>
        
        <button 
          @click="clearFilters" 
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
        >
          Clear
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center items-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else>
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
              v-for="(audit, index) in paginatedAudits" 
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
                  :class="getActionClass(audit.action)"
                >
                  {{ formatActionName(audit.action) }}
                </span>
              </td>
              <td class="px-6 py-4 max-w-md">
                {{ getFormattedDescription(audit) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ formatDateTime(audit.createdAt) }}
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
          v-for="(audit, index) in paginatedAudits" 
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
                  :class="getActionClass(audit.action)"
                >
                  {{ formatActionName(audit.action) }}
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
          
          <p class="text-sm text-gray-600 mb-2">{{ getFormattedDescription(audit) }}</p>
          <p class="text-xs text-gray-500">{{ formatDateTime(audit.createdAt) }}</p>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredAudits.length === 0" class="flex flex-col items-center justify-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-500">No audit logs found</h3>
        <p class="text-gray-400">Try adjusting your filters or search criteria</p>
      </div>
      
      <!-- Pagination -->
      <div v-if="filteredAudits.length > 0" class="flex justify-between items-center mt-6">
        <p class="text-sm text-gray-500">
          Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to 
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
                    :class="getActionClass(selectedAudit.action)"
                  >
                    {{ formatActionName(selectedAudit.action) }}
                  </span>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Action</label>
                <p class="text-gray-800">{{ getActionDescription(selectedAudit.action) }}</p>
              </div>
              
              <div v-if="selectedAuditDescription">
                <label class="block text-sm font-medium text-gray-600 mb-1">Details</label>
                <div class="bg-gray-50 p-3 rounded text-sm text-gray-800 overflow-auto max-h-64">
                  <div v-for="(value, key) in selectedAuditDescription" :key="key" class="mb-2">
                    <span class="font-medium">{{ formatFieldName(key) }}:</span> {{ value }}
                  </div>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Date & Time</label>
                <p class="text-gray-800">{{ formatDetailDateTime(selectedAudit.createdAt) }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Admin ID</label>
                <p class="text-gray-800 text-sm font-mono">{{ selectedAudit.userId }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Audit ID</label>
                <p class="text-gray-800 text-sm font-mono">{{ selectedAudit.id }}</p>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useFetchAuditLogs } from '@/composables/modules/audit/useFetchAuditLogs';

// Fetch audit logs from the backend
const { auditLogs: auditLogsList, loading } = useFetchAuditLogs();

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  adminName: string;
}

// State
const searchQuery = ref('');
const filterAction = ref('');
const selectedAudit = ref<AuditLog | null>(null);
const selectedAuditDescription = ref<Record<string, any> | null>(null);
const currentPage = ref(1);
const itemsPerPage = 10;

// Action to display name mapping
const actionDisplayMap: Record<string, string> = {
  'create-referral-code': 'Create',
  'update-referral-code': 'Update',
  'deactivate-referral-code': 'Deactivate',
  'delete-referral-code': 'Delete',
  'login': 'Login',
  'logout': 'Logout'
};

// Action descriptions for the details modal
const actionDescriptionMap: Record<string, string> = {
  'create-referral-code': 'Created a new referral code',
  'update-referral-code': 'Updated an existing referral code',
  'deactivate-referral-code': 'Deactivated a referral code',
  'delete-referral-code': 'Deleted a referral code',
  'login': 'Admin logged in to the system',
  'logout': 'Admin logged out of the system'
};

// Computed
const filteredAudits = computed(() => {
  if (!auditLogsList.value) return [];
  
  let result = [...auditLogsList.value];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(audit => 
      audit.adminName.toLowerCase().includes(query) ||
      audit.action.toLowerCase().includes(query) ||
      audit.description.toLowerCase().includes(query)
    );
  }
  
  if (filterAction.value) {
    result = result.filter(audit => audit.action === filterAction.value);
  }
  
  // Sort by date (newest first)
  return result.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

const paginatedAudits = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredAudits.value.slice(start, end);
});

const uniqueActions = computed(() => {
  if (!auditLogsList.value) return [];
  const actions = new Set(auditLogsList.value.map(log => log.action));
  return Array.from(actions);
});

// Watch for filter changes to reset pagination
watch([searchQuery, filterAction], () => {
  currentPage.value = 1;
});

// Methods
const clearFilters = () => {
  searchQuery.value = '';
  filterAction.value = '';
  currentPage.value = 1;
};

const getInitials = (name: string) => {
  if (!name) return 'NA';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const formatActionName = (action: string) => {
  return actionDisplayMap[action] || action.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const getActionDescription = (action: string) => {
  return actionDescriptionMap[action] || formatActionName(action);
};

const getActionClass = (action: string) => {
  const classMap: Record<string, string> = {
    'create-referral-code': 'bg-green-100 text-green-800',
    'update-referral-code': 'bg-blue-100 text-blue-800',
    'deactivate-referral-code': 'bg-yellow-100 text-yellow-800',
    'delete-referral-code': 'bg-red-100 text-red-800',
    'login': 'bg-purple-100 text-purple-800',
    'logout': 'bg-gray-100 text-gray-800'
  };
  
  return classMap[action] || 'bg-gray-100 text-gray-800';
};

const formatFieldName = (key: string) => {
  return key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase());
};

const getFormattedDescription = (audit: AuditLog) => {
  try {
    const parsedDescription = JSON.parse(audit.description);
    
    if (audit.action === 'deactivate-referral-code') {
      return `Deactivated referral code: ${parsedDescription.code} (${parsedDescription.name})`;
    }
    
    if (audit.action === 'create-referral-code') {
      return `Created referral code: ${parsedDescription.code} for ${parsedDescription.email}`;
    }
    
    if (audit.action === 'update-referral-code') {
      return `Updated referral code: ${parsedDescription.code}`;
    }
    
    if (audit.action === 'delete-referral-code') {
      return `Deleted referral code: ${parsedDescription.code}`;
    }
    
    // Generic fallback
    if (parsedDescription.code) {
      return `${formatActionName(audit.action)} referral code: ${parsedDescription.code}`;
    }
    
    return `${formatActionName(audit.action)} performed`;
  } catch (e) {
    // If parsing fails, return the action name
    return formatActionName(audit.action);
  }
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

const viewAuditDetails = (audit: AuditLog) => {
  selectedAudit.value = audit;
  
  try {
    // Parse the JSON description for display in the modal
    selectedAuditDescription.value = JSON.parse(audit.description);
  } catch (e) {
    selectedAuditDescription.value = null;
  }
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