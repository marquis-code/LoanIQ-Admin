<template>
    <div class="mt-5">
        <p class="font-medium text-xl text-center">Edit role</p>
        <form @submit.prevent="handleEditRole" class="mt-4">
          <div class="px-4 py-4">
            <div class="space-y-4">
              <!-- First Name Field -->
              <div>
                <label for="name" class="input-label text-sm">Name</label>
                <div class="mt-1">
                  <input
                    type="text"
                    v-model="payload.name"
                    name="name"
                    id="name"
                    class="input-field"
                  />
                </div>
              </div>
  
              <!-- Description Field -->
              <div>
                <label for="description" class="input-label text-sm">Description</label>
                <div class="mt-1">
                  <textarea
                    rows="6"
                    cols="6"
                    v-model="payload.description"
                    name="description"
                    id="description"
                    class="input-field"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
  
          <div class="flex justify-center items-center p-6">
            <button
              type="submit"
              :disabled="loading"
              class="bg-[#2F6D67] text-white rounded-md text-center w-full py-3.5 font-semibold flex justify-center items-center"
            >
              {{ loading ? "processing..." : "Submit" }}
            </button>
          </div>
        </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive, watch } from "vue";
  import { useEditRole } from "@/composables/modules/roles/useEditRole";
  
  const { editRole, loading } = useEditRole();
  
  const props = defineProps({
    role: {
      type: Object,
      required: true,
      default: () => ({ name: "", description: "" })
    }
  });
  
  // Initialize payload with pre-existing data from props
  const payload = reactive({
    name: props.role.name,
    description: props.role.description
  });

  const emit = defineEmits(['success'])
  
  // Handle form submission
  const handleEditRole = async () => {
    await editRole(props.role.id, payload);
    emit('success')
  };
  
  </script>
  