<template>
<section>
  <!-- {{ modules }} -->
    <!-- {{ rolesList[0] }} -->
  <div  class="rounded-lg border-[0.5px] border-gray-100">
 <div class="flex justify-between items-center px-6">
   <h1 class="text-lg font-semibold ">Role Management</h1>
   <button v-if="canCreate('roles-and-permission')" @click="showAddEditModal = true" class="bg-[#2F6D67] text-white text-sm px-6 py-2 rounded-lg ">Add Role</button>
 </div>
 <section v-if="canView('roles-and-permission')">
  <section  v-if="rolesList.length && !loading" class="">
      <table class="min-w-full divide-y divide-gray-100 border-t">
        <thead>
        <tr>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
          <!-- <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Members</th> -->
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
        </tr>
        </thead>
        <tbody class="bg-white">
        <tr v-for="role in rolesList" :key="role.name" class="even:bg-gray-50">
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ role?.name }}</td>
          <!-- <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ role?.members ?? '0' }}</td> -->
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <button
                 v-if="canEdit('roles-and-permission') || canView('roles-and-permission') || canCreate('roles-and-permission')"
                @click="openPermissionsModal(role)"
                type="button"
                class="px-2 text-sm px-3 py-2.5 rounded-lg outline-none bg-[#2F6D67] text-white"
            >
              Permissions
            </button>
            <button
               v-if="canEdit('roles-and-permission')"
                @click="openEditModal(role)"
                type="button"
                class="ml-2 text-green-500 border py-2.5 border-green-500 px-2 py-2 rounded-lg hover:bg-green-500 hover:text-white"
            >
              Edit
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </section>
    <div v-else-if="!rolesList.length && !loading"
           class="flex border-[0.5px] mt-5 flex-col items-center justify-center h-64 bg-white rounded-lg">
        <div class="flex items-center justify-center p-6 mb-4">
          <img :src="dynamicIcons('illustration')" />
        </div>
        <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
          No Roles Available
        </p>
      </div>
      <CoreLoader v-else class="mt-6" />
 </section>
  </div>
  <CoreDrawer v-if="canView('roles-and-permission')" :title="`Role & Permissions (${selectedRole?.name})`" :description="`Below are the permissions attached to the ${selectedRole?.name} role`"  :showFooter="false" :show="!!selectedRole" @close="selectedRole = null">
    <template #content>
      <ModulesPermissions
          @close="closePermissionsModal"
          :role="selectedRole"
          @save="updatePermissions"
          :rolesList="rolesList"
      />
    </template>
  </CoreDrawer>

 
  <ModulesAddRoleModal
      v-if="showAddEditModal"
      :role="selectedRole"
      @close="closeAddEditModal"
      @save="saveRole"
  />
</section>
</template>

<script setup lang="ts">
  import { usePermissions } from '@/composables/core/usePermissions'
  const { canView, canCreate, canEdit } = usePermissions()
import { useFetchRoles } from '@/composables/modules/roles/useFetchRoles'
import { useFetchModules } from '@/composables/modules/app/useFetchAppModule'
const { loading, roles: rolesList } = useFetchRoles()
const {  loading: loadingModules, modules } = useFetchModules()
import { ref } from "vue";

interface Role {
  name: string;
  members: number;
  permissions: Record<string, string[]>;
}

const router = useRouter()

// Modals and state
const showPermissionsModal = ref(false);
const showAddEditModal = ref(false);
const selectedRole = ref<Role | null>(null);

const emit = defineEmits(['role'])

// Methods
function openPermissionsModal(role: Role) {
  emit('role', role)
  selectedRole.value = role;
  showPermissionsModal.value = true;
}

function closePermissionsModal() {
  showPermissionsModal.value = false;
  selectedRole.value = null;
  
}

function updatePermissions(updatedPermissions: Record<string, string[]>) {
  if (selectedRole.value) {
    selectedRole.value.permissions = updatedPermissions;
  }
  closePermissionsModal();
}

function openEditModal(role: Role | null) {
  selectedRole.value = role;
  // showAddEditModal.value = true;
}

function closeAddEditModal() {
  showAddEditModal.value = false;
  selectedRole.value = null;
}

function saveRole(newRole: Role) {
  if (selectedRole.value) {
    // Update existing role
    const index = roles.value.findIndex((r) => r.name === selectedRole.value.name);
    if (index !== -1) roles.value[index] = newRole;
  } else {
    // Add new role
    roles.value.push(newRole);
  }
  closeAddEditModal();
}
</script>
