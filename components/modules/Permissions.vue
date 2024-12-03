<template>
  <section>
    <div v-if="modules.length && !loadingModules" class="bg-white border-[0.5px] rounded">
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
                    :checked="hasPermission(module.slug, 'create')"
                    @change="toggleAction(module.slug, 'create')"
                  />
                  <div class="w-10 h-6 rounded-full bg-gray-300 peer-checked:bg-[#2F6D67]"></div>
                  <div class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full bg-[#F2F4F7] peer-checked:right-0 peer-checked:left-auto"></div>
                </span>
              </label>
            </td>

            <!-- Edit Permission -->
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              <label :for="`edit-${module.slug}`" class="inline-flex items-center space-x-4 cursor-pointer">
                <span class="relative">
                  <input
                    :id="`edit-${module.slug}`"
                    type="checkbox"
                    class="hidden peer"
                    :checked="hasPermission(module.slug, 'edit')"
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
                    :checked="hasPermission(module.slug, 'delete')"
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
                    :checked="hasPermission(module.slug, 'view')"
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
          {{ loading ? 'processing..' : 'Save' }}
        </button>
        <button
          @click="$emit('close')"
          class="ml-2 px-6 py-2 border text-sm rounded-lg hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
    <div 
      v-else-if="!modules.length && !loadingModules"
      class="flex border-[0.5px] mt-5 flex-col items-center justify-center h-64 bg-white rounded-lg"
    >
      <div class="flex items-center justify-center p-6 mb-4">
        <img :src="dynamicIcons('illustration')" alt="No modules" />
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
import { useAssignPermissionToRole } from '@/composables/modules/permissions/useAssignPermissionToRole';
import { useFetchModules } from '@/composables/modules/app/useFetchAppModule';

interface Module {
  slug: string;
  name: string;
}

interface Permission {
  moduleId: string;
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  slug: string;
  permission: Permission[];
}

interface ActionsArray {
  [key: string]: {
    create: boolean;
    edit: boolean;
    delete: boolean;
    view: boolean;
  };
}

const props = defineProps<{
  role: Role;
  roleObj?: Record<string, any>;
  rolesList?: Array<any>;
}>();

const { modules, loading: loadingModules } = useFetchModules();
const { assignPermissionToRole, setPayload, loading } = useAssignPermissionToRole();
const emit = defineEmits(["close", "save"]);

const actionsArray = reactive<ActionsArray>({});

// Initialize permissions when modules are loaded
watch(
  () => modules.value,
  (newModules) => {
    if (!newModules) return;
    
    newModules.forEach((module: Module) => {
      actionsArray[module.slug] = {
        create: false,
        edit: false,
        delete: false,
        view: false,
      };
    });

    // If role exists, update permissions
    if (props.role?.permission) {
      initializePermissions(props.role.permission);
    }
  },
  { immediate: true }
);

// Watch role changes
watch(
  () => props.role,
  (newRole) => {
    if (!newRole?.permission) return;
    initializePermissions(newRole.permission);
  },
  { immediate: true }
);

function initializePermissions(permissions: Permission[]) {
  // Reset existing permissions
  Object.keys(actionsArray).forEach((moduleSlug) => {
    actionsArray[moduleSlug] = {
      create: false,
      edit: false,
      delete: false,
      view: false,
    };
  });

  // Set new permissions
  permissions.forEach((perm) => {
    if (actionsArray[perm.moduleId]) {
      perm.permissions.forEach((action) => {
        if (action in actionsArray[perm.moduleId]) {
          actionsArray[perm.moduleId][action as keyof typeof actionsArray[string]] = true;
        }
      });
    }
  });
}

function hasPermission(moduleSlug: string, action: string): boolean {
  return actionsArray[moduleSlug]?.[action as keyof typeof actionsArray[string]] || false;
}

function toggleAction(moduleSlug: string, action: string) {
  if (moduleSlug in actionsArray) {
    actionsArray[moduleSlug][action as keyof typeof actionsArray[string]] = 
      !actionsArray[moduleSlug][action as keyof typeof actionsArray[string]];
  }
}

async function savePermissions() {
  if (!Array.isArray(modules.value)) {
    return;
  }

  const updatedPermissions = Object.entries(actionsArray)
    .map(([moduleId, actions]) => ({
      moduleId,
      permissions: Object.entries(actions)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([action]) => action)
    }))
    .filter(module => module.permissions.length > 0);

  setPayload(updatedPermissions);
  await assignPermissionToRole();
  emit("save", updatedPermissions);
}

// Utility function for dynamic icons (implement according to your needs)
function dynamicIcons(type: string): string {
  // Implement your icon logic here
  return `/icons/${type}.svg`;
}
</script>