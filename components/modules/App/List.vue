<template>
  <div class="px-4 sm:px-6 lg:px-8 mt-6">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">
          Modules
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all the modules including their name, title,
          email and role.
        </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          @click="openCreateModuleModal = true"
          class="block rounded-md bg-[#2F6D67] px-3 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#2F6D67] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6D67]"
        >
          Create Modules
        </button>
      </div>
    </div>
    <div v-if="modules.length && !loading" class="">
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Blocked</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Deleted</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr  v-for="(admin, index) in modules"
                :key="index">
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center">
                      <div class="h-11 w-11 shrink-0">
                        <img v-if="!admin.avatar" class="h-11 w-11 rounded-full"
                          src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
                    <div class="text-gray-900">{{ admin.phone ?? 'Nil' }}</div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <span
                      class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ admin?.block }}</span>
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
                      <li>
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
                      <li>
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
    <div v-else-if="!modules.length && !loading"
      class="flex border-[0.5px] mt-5 flex-col items-center justify-center h-64 bg-white rounded-lg">
      <div class="flex items-center justify-center p-6 mb-4">
        <img :src="dynamicIcons('illustration')" />
      </div>
      <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
        No modules Available
      </p>
    </div>
    <CoreLoader v-else class="mt-6" />
    <div v-if="activeDropdown !== null" @click="closeDropdown" class="fixed inset-0 z-40 bg-black opacity-25"></div>
    <ModalsConfirm @close="isDeleteModalOpen = false" @continue="confirmDeleteAction(selectedModule)"
      :loading="deleting" title="Confirm Action" :description="`Are you sure you want to delete ${selectedModule.name ?? 'Nil'}`" :show="isDeleteModalOpen" />
      <CoreBaseModal @success="editModuleModal = false" @update:show="editModuleModal = false" :show="editModuleModal">
      <ModulesAppEdit :role="selectedModule" />
    </CoreBaseModal>
    <CoreBaseModal  @success="openCreateModuleModal = false" @update:show="openCreateModuleModal = false" :show="openCreateModuleModal">
      <ModulesAppCreate />
    </CoreBaseModal>
  </div>
</template>

<script setup lang="ts">
import { useDeleteModule } from '@/composables/modules/app/useDeleteModule'
const { deleteModule, loading: deleting, } = useDeleteModule()

import { dynamicIcons } from "@/utils/assets";
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  modules: {
    type: Array,
    default: () => [],
  },
});

const confirmDeleteAction = async (item: any) => {
    await deleteModule(item.id)
}


const selectedModule = ref({});

const isDeleteModalOpen = ref(false);
const openCreateModuleModal = ref(false)
const editModuleModal = ref(false)

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
  selectedModule.value = item
  if (option === 'view') {
    emit('selected', item)
  }

  if (option === 'delete') {
    isDeleteModalOpen.value = true
  }
};
</script>
