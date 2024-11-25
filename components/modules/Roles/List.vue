<template>
    <div class="px-4 sm:px-6 lg:px-8">
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-base font-semibold text-gray-900">Roles</h1>
      <p class="mt-2 text-sm text-gray-700">A list of all the roles.</p>
    </div>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <button @click="createRoleModal = true" class="block rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">Add role</button>
    </div>
  </div>
  <div v-if="roles.length && !loading" class="mt-8 flow-root">
    <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle">
        <table class="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">Name</th>
              <th scope="col" class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell">Slug</th>
              <th scope="col" class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell">Description</th>
              <!-- <th scope="col" class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                <span class="sr-only">Edit</span>
              </th> -->
              <th scope="col" class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(role, index) in roles" :key="role.id">
              <td class="whitespace-nowrap border-b border-gray-200 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">{{ role.name || 'Nil' }}</td>
              <td class="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500 sm:table-cell">{{ role.slug || 'Nil' }}</td>
              <td class=" whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ role.description || 'Nil' }}</td>
              <td
                  class="whitespace-nowrap relative border-b border-gray-200 px-3 py-4 text-sm text-gray-500 lg:table-cell"
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
                         @click="selectOption('view', role)"
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
                         @click="selectOption('edit', role)"
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
                          Edit
                        </a>
                      </li>
                      <li>
                        <a
                          @click="selectOption('delete', role)"
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
  <div v-else-if="!roles.length && !loading"
      class="flex border-[0.5px] mt-5 flex-col items-center justify-center h-64 bg-white rounded-lg">
      <div class="flex items-center justify-center p-6 mb-4">
        <img :src="dynamicIcons('illustration')" />
      </div>
      <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
        No roles Available
      </p>
    </div>
    <CoreLoader v-else class="mt-6" />
    <div v-if="activeDropdown !== null" @click="closeDropdown" class="fixed inset-0 z-40 bg-black opacity-25"></div>
    <ModalsConfirm
      @close="isDeleteModalOpen = false"
      @continue="processDelete"
      :loading="loading"
      title="Confirm Delete"
      :description="`Are you sure you want to delete ${
        selectedRole.name ?? 'Nil'
      }`"
      :show="isDeleteModalOpen"
    />
    <CoreBaseModal @success="editRoleModal = false" @update:show="editRoleModal = false" :show="editRoleModal">
      <ModulesRolesEdit :role="selectedRole" />
    </CoreBaseModal>
    <CoreBaseModal  @success="closeCreateModal" @update:show="createRoleModal = false" :show="createRoleModal">
      <ModulesRolesCreate />
    </CoreBaseModal>
</div>
</template>

<script setup lang="ts">
import { useDeleteRole } from '@/composables/modules/roles/useDeleteRole'
const { deleteRole, loading } = useDeleteRole()
const props = defineProps({
  roles: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const editRoleModal = ref(false)
const createRoleModal = ref(false)


const closeCreateModal = () => {
  createRoleModal.value = false
}

const processDelete = async () => {
  await deleteRole(selectedRole.value.id)
  isDeleteModalOpen.value = false
}

const selectedRole = ref({});

const isDeleteModalOpen = ref(false);

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
  console.log(item, 'item')
    selectedRole.value = item
    if(option === 'view'){
      emit('selected', item)
    }

    if(option === 'edit'){
      editRoleModal.value = true
    }

    if(option === 'delete'){
      isDeleteModalOpen.value  =  true
    }
  };

</script>