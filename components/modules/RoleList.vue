<template>
<section>
  <div  class="rounded-lg border-[0.5px] border-gray-100">
 <div class="flex justify-between items-center px-6">
   <h1 class="text-lg font-semibold ">Role Management</h1>
<!--   <button-->
<!--       @click="showAddEditModal = true"-->
<!--       class="bg-[#2F6D67] text-white text-sm px-6 py-2 rounded-lg "-->
<!--   >-->
<!--     Add Role-->
<!--   </button>-->
 </div>
    <section class="">
      <table class="min-w-full divide-y divide-gray-100 border-t">
        <thead>
        <tr>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Members</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
        </tr>
        </thead>
        <tbody class="bg-white">
        <tr v-for="role in roles" :key="role.name" class="even:bg-gray-50">
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ role.name }}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ role.members }}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <button
                @click="openPermissionsModal(role)"
                type="button"
                class="px-2 py-2 rounded-lg outline-none bg-[#2F6D67] text-white"
            >
              Permissions
            </button>
            <button
                @click="openEditModal(role)"
                type="button"
                class="ml-2 text-green-500 border border-green-500 px-2 py-2 rounded-lg hover:bg-green-500 hover:text-white"
            >
              Edit
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </section>
  </div>
  <!-- Permissions Modal -->
<!--  <ModulesPermissions-->
<!--      v-if="showPermissionsModal"-->
<!--      :role="selectedRole"-->
<!--      @close="closePermissionsModal"-->
<!--      @save="updatePermissions"-->
<!--  />-->
  <CoreDrawer :title="`Role & Permissions (${selectedRole?.name})`" :description="`Below are the permissions attached to the ${selectedRole?.name} role`"  :showFooter="false" :show="!!selectedRole" @close="selectedRole = null">
    <template #content>
      <ModulesPermissions
          v-if="showPermissionsModal"
          :role="selectedRole"
          @close="closePermissionsModal"
          @save="updatePermissions"
      />
    </template>
  </CoreDrawer>

  <!-- Add/Edit Modal -->
  <ModulesAddRoleModal
      v-if="showAddEditModal"
      :role="selectedRole"
      @close="closeAddEditModal"
      @save="saveRole"
  />
<!--  <ModulesAddRoleModal-->
<!--      v-if="showAddRoleModal"-->
<!--      @close="showAddRoleModal = false"-->
<!--      @add-role="addRole"-->
<!--  />-->
<!--  <ModulesEditRoleModal-->
<!--      v-if="showEditRoleModal"-->
<!--      :role="editingRole"-->
<!--      @close="showEditRoleModal = false"-->
<!--      @update-role="updateRole"-->
<!--  />-->
</section>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Role {
  name: string;
  members: number;
  permissions: Record<string, string[]>;
}

const roles = ref<Role[]>([
  {
    name: "Admin",
    members: 4,
    permissions: {
      Dashboard: ["create", "update", "delete", "view"],
      Items: ["create", "update", "delete", "view"],
      "Dining Tables": ["create", "update", "delete", "view"],
      POS: ["create", "update", "delete", "view"],
      Reports: ["view"],
      Settings: ["create", "update", "delete", "view"],
    },
  },
  {
    name: "Customer",
    members: 6890,
    permissions: {
      "Online Orders": ["create", "view"],
      Feedback: ["create", "view"],
      "Account Settings": ["update", "view"],
    },
  },
  {
    name: "Delivery Boy",
    members: 3,
    permissions: {
      "Delivery Orders": ["update", "view"],
      "Route Management": ["view"],
      Feedback: ["view"],
    },
  },
]);

// Modals and state
const showPermissionsModal = ref(false);
const showAddEditModal = ref(false);
const selectedRole = ref<Role | null>(null);

// Methods
function openPermissionsModal(role: Role) {
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
  showAddEditModal.value = true;
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
