<template>
  <section class="">
    <div class=" bg-white border-[0.5px] rounded">
<!--      <h1 class="text-lg font-semibold mb-4 px-6">-->
<!--        Role & Permissions ({{ role?.name }})-->
<!--      </h1>-->
      <table class="min-w-full border-t-[0.5px] divide-y divide-gray-300">
        <thead>
        <tr>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">#</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Module</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Create</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Update</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Delete</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">View</th>
        </tr>
        </thead>
        <tbody class="bg-white">
        <tr v-for="(actions, module, index) in actionsArray" :key="module" class="even:bg-gray-50">
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{{ index + 1 }}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ module }}</td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <input
                type="checkbox"
                :checked="actions.includes('create')"
                @change="toggleAction(module, 'create')"
                class="cursor-pointer"
            />
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <input
                type="checkbox"
                :checked="actions.includes('update')"
                @change="toggleAction(module, 'update')"
                class="cursor-pointer"
            />
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <input
                type="checkbox"
                :checked="actions.includes('delete')"
                @change="toggleAction(module, 'delete')"
                class="cursor-pointer"
            />
          </td>
          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <input
                type="checkbox"
                :checked="actions.includes('view')"
                @change="toggleAction(module, 'view')"
                class="cursor-pointer"
            />
          </td>
        </tr>
        </tbody>
      </table>
      <div class="flex justify-end my-4 pr-6 space-x-4 border-t border-gray-100 pt-4">
        <button
            @click="savePermissions"
            type="button"
            class="bg-[#2F6D67] text-white px-6 text-sm py-2 rounded-lg hover:bg-green-600"
        >
          Save
        </button>
        <button
            @click="$emit('close')"
            class="ml-2 px-6 py-2 border text-sm rounded-lg hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";

const props = defineProps({
  role: Object,
});

const router = useRouter()

const emit = defineEmits(["close", "save"]);

const actionsArray = reactive<Record<string, string[]>>({});

watch(
    () => props.role,
    (newRole) => {
      if (!newRole) return;
      Object.keys(newRole.permissions).forEach((module) => {
        actionsArray[module] = [...newRole.permissions[module]];
      });
    },
    { immediate: true }
);

function toggleAction(module: string, action: string) {
  const actions = actionsArray[module];
  if (!actions) return;

  const index = actions.indexOf(action);
  if (index > -1) {
    actions.splice(index, 1); // Remove action if already present
  } else {
    actions.push(action); // Add action if not present
  }
}

function savePermissions() {
  const updatedPermissions: Record<string, string[]> = {};
  Object.keys(actionsArray).forEach((module) => {
    updatedPermissions[module] = [...actionsArray[module]];
  });
  emit("save", updatedPermissions);
}
</script>
