<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white rounded p-6 w-96 shadow-lg">
      <h2 class="text-lg font-semibold mb-4">Add Role</h2>
      <label class="block mb-2">
        Role Name
        <input
            v-model="name"
            type="text"
            class="w-full border px-2 py-1 rounded"
            placeholder="Enter role name"
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
            @click="addRole"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const name = ref("");

function addRole() {
  if (!name.value.trim()) {
    alert("Role name is required");
    return;
  }
  $emit("add-role", { name: name.value, members: 0, permissions: {} });
  $emit("close");
}
</script>
