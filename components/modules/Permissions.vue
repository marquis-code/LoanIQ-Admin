<template>
  <section>
    {{ roleObj }}
    <div  v-if="modules.length && !loadingModules" class="bg-white border-[0.5px] rounded">
      <table class="min-w-full border-t-[0.5px] divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">#</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Module</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Create</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Edit</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Delete</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">View</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="(module, index) in modules" :key="module.slug" class="even:bg-gray-50">
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">{{ index + 1 }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ module.name }}</td>

            <!-- Create Permission -->
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <label :for="`create-${module.slug}`" class="inline-flex items-center space-x-4 cursor-pointer">
                <span class="relative">
                  <input
                    :id="`create-${module.slug}`"
                    type="checkbox"
                    class="hidden peer"
                    :checked="actionsArray[module.slug]?.create"
                    @change="toggleAction(module.slug, 'create')"
                  />
                  <div class="w-10 h-6 rounded-full bg-gray-300 peer-checked:bg-[#2F6D67]"></div>
                  <div class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full bg-[#F2F4F7] peer-checked:right-0 peer-checked:left-auto"></div>
                </span>
              </label>
            </td>

            <!-- Update Permission -->
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <label :for="`edit-${module.slug}`" class="inline-flex items-center space-x-4 cursor-pointer">
                <span class="relative">
                  <input
                    :id="`edit-${module.slug}`"
                    type="checkbox"
                    class="hidden peer"
                    :checked="actionsArray[module.slug]?.edit"
                    @change="toggleAction(module.slug, 'edit')"
                  />
                  <div class="w-10 h-6 rounded-full bg-gray-300 peer-checked:bg-[#2F6D67]"></div>
                  <div class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full bg-[#F2F4F7] peer-checked:right-0 peer-checked:left-auto"></div>
                </span>
              </label>
            </td>

            <!-- Delete Permission -->
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <label :for="`delete-${module.slug}`" class="inline-flex items-center space-x-4 cursor-pointer">
                <span class="relative">
                  <input
                    :id="`delete-${module.slug}`"
                    type="checkbox"
                    class="hidden peer"
                    :checked="actionsArray[module.slug]?.delete"
                    @change="toggleAction(module.slug, 'delete')"
                  />
                  <div class="w-10 h-6 rounded-full bg-gray-300 peer-checked:bg-[#2F6D67]"></div>
                  <div class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full bg-[#F2F4F7] peer-checked:right-0 peer-checked:left-auto"></div>
                </span>
              </label>
            </td>

            <!-- View Permission -->
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <label :for="`view-${module.slug}`" class="inline-flex items-center space-x-4 cursor-pointer">
                <span class="relative">
                  <input
                    :id="`view-${module.slug}`"
                    type="checkbox"
                    class="hidden peer"
                    :checked="actionsArray[module.slug]?.view"
                    @change="toggleAction(module.slug, 'view')"
                  />
                  <div class="w-10 h-6 rounded-full bg-gray-300 peer-checked:bg-[#2F6D67]"></div>
                  <div class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full bg-[#F2F4F7] peer-checked:right-0 peer-checked:left-auto"></div>
                </span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-end my-4 pr-6 space-x-4 border-t border-gray-100 pt-4">
        <button
          @click="savePermissions"
          type="button"
          :disabled="loading"
          class="bg-[#2F6D67] disabled:cursor-not-allowed disabled:opacity-25 text-white px-6 text-sm py-2 rounded-lg hover:bg-green-600"
        >
          {{  loading ? 'processing..' : 'Save' }}
        </button>
        <button
          @click="$emit('close')"
          class="ml-2 px-6 py-2 border text-sm rounded-lg hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
    <div v-else-if="!modules.length && !loadingModules"
           class="flex border-[0.5px] mt-5 flex-col items-center justify-center h-64 bg-white rounded-lg">
        <div class="flex items-center justify-center p-6 mb-4">
          <img :src="dynamicIcons('illustration')" />
        </div>
        <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
          No Modules Available
        </p>
      </div>
      <CoreLoader v-else class="mt-6" />
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import {  useAssignPermissionToRole } from '@/composables/modules/permissions/useAssignPermissionToRole'
import { useFetchModules } from '@/composables/modules/app/useFetchAppModule';

// Fetch modules using the composable
const { modules, loading: loadingModules } = useFetchModules();

const { assignPermissionToRole, setPayload, loading } = useAssignPermissionToRole()

const props = defineProps({
  role: Object,
  roleObj: Object
});

const route = useRoute()

const emit = defineEmits(["close", "save"]);

// Initialize actionsArray to store permissions for each module
const actionsArray = reactive<Record<string, Record<string, boolean>>>({});

// Ensure actionsArray has defaults for all modules
watch(
  () => modules.value,
  () => {
    modules.value?.forEach((module) => {
      if (!actionsArray[module.slug]) {
        actionsArray[module.slug] = {
          create: false,
          edit: false,
          delete: false,
          view: false,
        };
      }
    });
  },
  { immediate: true }
);

// Watch the role prop to update the permissions
watch(
  () => props.role,
  (newRole) => {
    if (!newRole || loadingModules.value) return;

    // Initialize actionsArray with role permissions
    Object.keys(newRole.permissions).forEach((moduleSlug) => {
      actionsArray[moduleSlug] = {
        create: newRole.permissions[moduleSlug].includes("create"),
        edit: newRole.permissions[moduleSlug].includes("edit"),
        delete: newRole.permissions[moduleSlug].includes("delete"),
        view: newRole.permissions[moduleSlug].includes("view"),
      };
    });
  },
  { immediate: true }
);

// Toggle a specific permission for a module
function toggleAction(moduleSlug: string, action: string) {
  const actions = actionsArray[moduleSlug];
  if (actions !== undefined) {
    actions[action] = !actions[action]; // Toggle the action's state
  }

  console.log(actions, 'Updated actions after toggle');
}

// Save the updated permissions in the required format
const  savePermissions = async () => {
  console.log(modules.value, 'modules here');
  // Ensure modules.value is accessed correctly (it's a ref, so use `.value`)
  if (Array.isArray(modules.value)) {
    const updatedPermissions = modules.value.map((module) => {
      // Get permissions for the current module that are checked
      const permissions = ["create", "edit", "delete", "view"].filter(
        (action) => actionsArray[module.slug]?.[action] // Only add checked permissions
      );

      // Return the desired structure
      return {
        moduleId: module.slug,
        permissions,
      };
    });

    console.log(updatedPermissions, 'Updated Permissions');

    setPayload(updatedPermissions)
    await assignPermissionToRole()
    emit("save", updatedPermissions);
  } else {
    console.error('Modules is not an array:', modules.value); // Log the error if modules.value is not an array
  }
}
</script>
