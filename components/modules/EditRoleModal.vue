<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop with blur effect -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>
    
    <!-- Modal container with responsive sizing -->
    <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
      <div 
        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full max-w-md mx-auto"
      >
        <!-- Header with close button -->
        <div class="flex items-center justify-between border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-gray-900">Edit Role</h2>
          <button 
            @click="$emit('close')" 
            class="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
            :disabled="loading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- Modal body -->
        <div class="px-6 py-5">
          <div class="space-y-4">
            <div>
              <label for="role-name" class="block text-sm font-medium text-gray-700 mb-1">
                Role Name
              </label>
              <div class="relative rounded-md shadow-sm">
                <input
                  id="role-name"
                  v-model="roleName"
                  type="text"
                  class="block w-full rounded-md border-gray-300 border py-2 px-3 focus:border-green-500 focus:ring-green-500 focus:outline-none text-gray-900 placeholder:text-gray-400 sm:text-sm"
                  placeholder="Enter role name"
                  :disabled="loading"
                />
              </div>
              <!-- <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p> -->
            </div>
          </div>
        </div>
        
        <!-- Footer with actions -->
        <div class="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse sm:px-6 gap-2">
          <button
            @click="updateRole"
            class="inline-flex w-full justify-center rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            <span v-if="loading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </span>
            <span v-else>Update Role</span>
          </button>
          <button
            @click="$emit('close')"
            class="inline-flex w-full justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:w-auto transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useEditRole } from '@/composables/modules/roles/useEditRole';

const props = defineProps({
  role: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "save"]);

const roleName = ref("");
const error = ref("");
const { editRole, loading } = useEditRole();

watch(
  () => props.role,
  (newRole) => {
    roleName.value = newRole?.name || "";
    error.value = "";
  },
  { immediate: true }
);

async function updateRole() {
  if (!roleName.value.trim()) {
    error.value = "Role name is required";
    return;
  }
  
  // try {
    // Create updated role object
    const updatedRole = { 
      ...props.role, 
      name: roleName.value 
    };
    
    // Call the API directly from the modal
    const updatePayload = {
      name: roleName.value 
    }
    await editRole(props.role.id, updatePayload).then((response) => {
       if(response.status === 200 || response.statusText === 'OK'){
        emit("close");
        window.location.reload()
       }
    })
  
    // Emit save event to refresh the roles list in parent component
    // emit("save", updatedRole);
    
    // Close the modal

  // } catch (err) {
  //   // Handle error
  //   error.value = err.message || "Failed to update role. Please try again.";
  // }
}
</script>