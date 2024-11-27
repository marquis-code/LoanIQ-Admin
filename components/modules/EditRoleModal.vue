<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white rounded p-6 w-96 shadow-lg">
      <h2 class="text-lg font-semibold mb-4">Edit Role</h2>
      <label class="block mb-2">
        Role Name
        <input
            v-model="roleName"
            type="text"
            class="w-full border px-2 py-1 rounded"
            placeholder="Edit role name"
        />
      </label>
      <div class="flex justify-end mt-4">
        <button
            @click="$emit('close')"
            class="px-4 py-2 border rounded mr-2 hover:bg-gray-100"
        >
          Close
        </button>
        <button
            @click="updateRole"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Update
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  role: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "update-role"]);

const roleName = ref("");

watch(
    () => props.role,
    (newRole) => {
      roleName.value = newRole?.name || "";
    },
    { immediate: true }
);

function updateRole() {
  if (!roleName.value.trim()) {
    alert("Role name is required");
    return;
  }
  emit("update-role", { ...props.role, name: roleName.value });
  emit("close");
}
</script>
