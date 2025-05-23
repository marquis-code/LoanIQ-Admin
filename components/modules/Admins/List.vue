<template>
  <div class="px-4 sm:px-6 lg:px-8 mt-6">
    <section v-if="canView('admin-management')">
      <!-- Search bar -->
      <div class="">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="search"
            v-model="searchQuery"
            class="block w-full p-2 py-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-t-lg bg-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search admins by name or email..."
          />
        </div>
      </div>

      <div v-if="filteredAdmins.length && !loading" class="">
        <div class="flow-root">
          <div class="-my-2 overflow-x-auto">
            <div class="inline-block min-w-full w-full py-2 align-middle border-[0.5px] rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" class="py-3.5 pl-10 pr-3 text-left text-sm font-semibold text-gray-900">Name
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Blocked</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Deleted</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="(admin, index) in filteredAdmins" :key="index">
                    <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div class="flex items-center pl-4">
                        <div class="h-11 w-11 shrink-0">
                          <img v-if="!admin.avatar" class="h-11 w-11 rounded-full"
                            src="@/assets/icons/avatar.svg"
                            alt="">
                          <img v-else class="h-11 w-11 rounded-full"
                            :src="admin.avatar"
                            alt="">
                        </div>
                        <div class="ml-4">
                          <div class="font-medium text-gray-900">{{ `${admin?.firstName} ${admin?.lastName}` || 'Nil' }}</div>
                          <div class="mt-1 text-gray-500">{{ admin?.email || 'Nil' }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div class="text-gray-900">{{ admin.roleId ?? 'Nil' }}</div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <span
                        :class="{'bg-red-100 text-red-700' : admin?.block, 'bg-green-100 text-green-700' : !admin?.block }"
                        class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium">{{ admin?.block ? 'Suspended' : 'Active' }}</span>
                    </td>
                    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <span
                        class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ admin?.deleted }}</span>
                    </td>
                    <td
                      class="py-4 px-5 relative whitespace-nowrap text-sm text-[#667185]"
                    >
                      <button
                        @click="toggleDropdown(index)"
                        class="inline-flex items-center text-sm font-medium text-[#667185] hover:text-black"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.99609 10H10.0036"
                            stroke="#292929"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M15 10H15.0075"
                            stroke="#1D2739"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M5 10H5.00748"
                            stroke="#1D2739"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </button>
                      <div
                        v-if="activeDropdown === index"
                        class="absolute -top-2 right-10 z-50 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg"
                      >
                        <ul
                          class="py-1 text-sm text-gray-700 divide divide-y-[0.5px]"
                        >
                          <li v-if="canView('admin-manegement')">
                            <a
                              @click="selectOption('view', admin)"
                              href="#"
                              class="block flex items-center gap-x-2 px-4 py-3 hover:bg-gray-100 text-start"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#4a4a4a"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path
                                  d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                ></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                              View
                            </a>
                          </li>
                          <li>
                            <a
                              @click="selectOption('block-status-update', admin)"
                              href="#"
                              class="block flex items-center gap-x-2 px-4 py-3 hover:bg-gray-100 text-start"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#4a4a4a"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                              {{admin.block ? 'Un-Block' : 'Block'}}
                            </a>
                          </li>
                          <li v-if="canDelete('admin-manegement')">
                            <a
                              @click="selectOption('delete', admin)"
                              href="#"
                              class="block flex items-center gap-x-2 px-4 py-3 hover:bg-gray-100 text-start"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#4a4a4a"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                              Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty state for no search results -->
      <div v-else-if="searchQuery && !filteredAdmins.length && !loading"
        class="flex border-[0.5px] mt-5 flex-col items-center justify-center h-64 bg-white rounded-lg">
        <div class="flex items-center justify-center p-6 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
          No results found for "{{ searchQuery }}"
        </p>
        <button 
          @click="clearSearch" 
          class="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Clear search
        </button>
      </div>
      
      <!-- Empty state for no admins -->
      <div v-else-if="!admins.length && !loading && !searchQuery"
        class="flex border-[0.5px] mt-5 flex-col items-center justify-center h-64 bg-white rounded-lg">
        <div class="flex items-center justify-center p-6 mb-4">
          <img :src="dynamicIcons('illustration')" />
        </div>
        <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
          No user Available
        </p>
      </div>
      
      <CoreLoader v-else class="mt-6" />
    </section>
    <div v-if="activeDropdown !== null" @click="closeDropdown" class="fixed inset-0 z-40 bg-black opacity-25"></div>
    <ModalsConfirm 
      @close="isDeleteModalOpen = false" 
      @continue="confirmDeleteAction(selectedadmin)"
      :loading="deleting" 
      title="Confirm Action" 
      :description="`Are you sure you want to delete ${selectedadmin.firstName ?? 'Nil'} ${selectedadmin.lastName ?? 'Nil' } account`" 
      :show="isDeleteModalOpen" 
    />

    <ModalsConfirm 
      @close="isBlockingModalOpen = false" 
      @continue="confirmBlockingAction(selectedadmin)"
      :loading="blocking" 
      title="Confirm Action" 
      :description="`Are you sure you want to ${!admins.block ? 'Un-Block' : 'Block'} ${selectedadmin.firstName ?? 'Nil'} ${selectedadmin.lastName ?? 'Nil' } account`" 
      :show="isBlockingModalOpen" 
    />
  </div>
</template>

<script setup lang="ts">
import { usePermissions } from '@/composables/core/usePermissions'
const { canView, canCreate, canDelete } = usePermissions()
import { useBlockAdmin } from '@/composables/modules/admins/useBlockAdmin'
const { blockAdmin, loading: blocking, } = useBlockAdmin()

import { useDeleteAdmin } from '@/composables/modules/admins/useDeleteAdmin'
const { deleteAdmin, loading: deleting, } = useDeleteAdmin()

import { dynamicIcons } from "@/utils/assets";
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  admins: {
    type: Array,
    default: () => [],
  },
});

// Search functionality
const searchQuery = ref('');
const filteredAdmins = computed(() => {
  if (!searchQuery.value) {
    return props.admins;
  }
  
  const query = searchQuery.value.toLowerCase();
  return props.admins.filter((admin: any) => {
    const fullName = `${admin.firstName || ''} ${admin.lastName || ''}`.toLowerCase();
    const email = (admin.email || '').toLowerCase();
    
    return fullName.includes(query) || email.includes(query);
  });
});

const clearSearch = () => {
  searchQuery.value = '';
};

const confirmDeleteAction = async (item: any) => {
  await deleteAdmin(item.id).then((res: any) => {
    console.log(res, 'res here')
    isDeleteModalOpen.value = false
  })
};

const confirmBlockingAction = async (item: any) => {
  await blockAdmin(item.id).then((res: any) => {
    console.log(res, 'res here')
    isBlockingModalOpen.value = false
  })
};

const selectedadmin = ref({});

const isDeleteModalOpen = ref(false);
const isBlockingModalOpen = ref(false);

const openDropdown = ref<number | null>(null);
const emit = defineEmits(["selected"]);

const activeDropdown = ref<number | null>(null);

const toggleDropdown = (index: number) => {
  if (activeDropdown.value === index) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = index;
  }
};

const closeDropdown = () => {
  activeDropdown.value = null;
};

// Close dropdown when clicking outside the specific row
const handleClickOutside = (event: MouseEvent) => {
  const dropdownId = `drop-options-${openDropdown.value}`;
  const dropdownButton = document.getElementById(dropdownId);
  if (dropdownButton && !dropdownButton.contains(event.target as Node)) {
    openDropdown.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const selectOption = (option: string, item?: any) => {
  selectedadmin.value = item;
  if (option === 'view') {
    emit('selected', item);
  }

  if (option === 'delete') {
    isDeleteModalOpen.value = true;
  }

  if (option === 'block-status-update') {
    isBlockingModalOpen.value = true;
  }
};
</script>