<template>
   <!-- <transition name="modal"> -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <form @submit.prevent="handleCreateRole" class="bg-white p-6 rounded-b-xl shadow-md w-full max-w-md space-y-10">
      <h2 class="text-lg font-semibold mb-4">Add Role</h2>
      <label class="block mb-2 text-sm mb-2">
        Role Name
        <input
            v-model="payload.name"
            type="text"
            class="w-full border px-2 py-3 rounded outline-none"
            placeholder="Enter role name"
        />
      </label>

      <label class="block mb-2 text-sm mb-2">
        Description
        <textarea
            rows="6"
            cols="6"
            v-model="payload.description"
            class="w-full border px-2 py-3 rounded resize-none outline-none"
            placeholder="Enter role description"
        ></textarea>
      </label>
      <div class="flex justify-end mt-6">
        <button
            @click="$emit('close')"
            class="px-4 py-2 w-full border rounded mr-2 text-sm hover:bg-gray-100"
        >
          Close
        </button>
        <button type="submit" :disabled="loading || !isFormEmpty" class="bg-[#2F6D67] text-sm w-full disabled:opacity-25 disabled:cursor-not-allowed text-white px-4 py-3.5 w-full rounded-md" @click="confirmTransfer">
              {{  loading ? "processing..." : 'Add role' }}
            </button>
      </div>
    </form>
  </div>
   <!-- </transition> -->
</template>

<script setup lang="ts">
import { useCreateRole } from '@/composables/modules/roles/useCreateRole'
const { createRole, loading, payload, isFormEmpty } = useCreateRole()
import { ref } from "vue";

const name = ref("");
const emit = defineEmits(['close'])

// function addRole() {
//   if (!name.value.trim()) {
//     alert("Role name is required");
//     return;
//   }
//   $emit("add-role", { name: name.value, members: 0, permissions: {} });
//   $emit("close");
// }

const handleCreateRole = async () => {
  await createRole()
  emit('close')

}


</script>


<style scoped>
/* Transition for modal */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
