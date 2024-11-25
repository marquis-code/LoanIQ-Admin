<template>
  <div class="">
    <p class="font-medium text-xl text-center">Create permission</p>
      <form @submit.prevent="handleCreateRole" class="">
        <div class="px-4 py-4">
          <div class="space-y-4">

            <!-- Last Name Field -->
            <div class="">
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
import { useCreatePermission } from '@/composables/modules/permissions/useCreatePermission'
const { createPermission, loading, payload } = useCreatePermission()

const emit = defineEmits(['success'])
const handleCreatePermission = async () => {
  await createPermission()
  emit('success')
}

</script>
