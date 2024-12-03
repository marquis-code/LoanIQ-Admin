<template>
  <div class="p-4">
    <!-- Role List Component -->
     <!-- {{ rolesList }} -->
    <ModulesRoleList
        @edit-role="openEditModal"
        @role="handleSelectedRole"
        @permissions="openPermissionsModal"
    />

    <!-- Permissions Modal -->
    <ModulesPermissions
        v-if="showPermissionsModal && selectedRole"
        :role="selectedRole"
        :roleObj="selectedRoleObj"
        @close="closePermissionsModal"
        @save="updatePermissions"
    />

    <!-- Add/Edit Modal -->
    <ModulesAddRoleModal
        v-if="showAddEditModal"
        :role="selectedRole"
        @close="closeAddEditModal"
        @save="saveRole"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Role {
  name: string;
  members: number;
  permissions: Record<string, string[]>;
}

definePageMeta({
  layout: "admin-dashboard",
    middleware: 'auth',
});

const router = useRouter()


// Modals
const showPermissionsModal = ref(false);
const showAddEditModal = ref(false);
const selectedRole = ref<Role | null>(null);
const selectedRoleObj = ref({})

// Methods
function openPermissionsModal(role: Role) {
  selectedRole.value = role; // Set the selected role
  showPermissionsModal.value = true;
}

function closePermissionsModal() {
  showPermissionsModal.value = false;
  selectedRole.value = null; // Reset selectedRole to avoid issues
}

const handleSelectedRole = (item: any) => {
  localStorage.setItem('selected-role', item.slug)
  selectedRoleObj.value = item
  selectedRole.value = item
}

function updatePermissions(updatedPermissions: Record<string, string[]>) {
  if (selectedRole.value) {
    selectedRole.value.permissions = updatedPermissions;
  }
  // closePermissionsModal();
}

function openEditModal(role: Role | null) {
  selectedRole.value = role;
  showAddEditModal.value = true;
}

function closeAddEditModal() {
  showAddEditModal.value = false;
  selectedRole.value = null; // Reset selectedRole to avoid issues
}

function saveRole(newRole: Role) {
  if (selectedRole.value) {
    // Update existing role
    const index = roles.value.findIndex((r) => r.name === selectedRole.value?.name);
    if (index !== -1) roles.value[index] = newRole;
  } else {
    // Add new role
    roles.value.push(newRole);
  }
  closeAddEditModal();
}
</script>
