<template>
    <div class="space-y-10 divide-y divide-gray-900/10">
      <div class="grid grid-cols-1 gap-x-8 gap-y-8">
        <form @submit.prevent="handleCreateAdmin" class="">
          <div class="">
            <div class="space-y-4">
  
              <!-- Last Name Field -->
              <div class="">
                <label for="first-name" class="input-label text-sm">First Name</label>
                <div class="mt-1">
                  <input
                    type="text"
                    v-model="payload.firstName"
                    name="first-name"
                    id="first-name"
                    class="input-field"
                  />
                </div>
              </div>

              <div class="">
                <label for="last-name" class="input-label text-sm">Last Name</label>
                <div class="mt-1">
                  <input
                    type="text"
                    v-model="payload.lastName"
                    name="last-name"
                    id="last-name"
                    class="input-field"
                  />
                </div>
              </div>

              <div class="">
                <label for="email" class="input-label text-sm">Email</label>
                <div class="mt-1">
                  <input
                    type="email"
                    v-model="payload.email"
                    name="email"
                    id="email"
                    class="input-field"
                  />
                </div>
              </div>




              <div class="w-full">
                <label for="canTopUp" class="input-label text-sm">Role</label>
                <div v-if="!fetchingRoles" class="mt-1">
                 <select class="input-field" v-model="payload.roleId">
                  <option value="">Please select role</option>
                  <option v-for="item in rolesList" :key="item.id" :value="item.slug">{{ item.name }}</option>
                 </select>
        
                </div>
              </div>
      
            </div>
          </div>

          <div class="flex justify-center items-center pt-10">
            <button
             type="submit"
             :disabled="loading"
             class="bg-[#2F6D67] text-white rounded-md disabled:cursor-not-allowed disabled:opacity-25 text-center w-full py-3.5 font-semibold flex justify-center items-center"
        >
          {{ loading ? "processing..." : "Submit" }}

        </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useFetchRoles } from '@/composables/modules/roles/useFetchRoles'
  import { useCreateAdmin } from '@/composables/modules/admins/useCreateAdmin'
  const { loading: fetchingRoles, roles: rolesList } = useFetchRoles()
  const { createAdmin, loading, payload } = useCreateAdmin()

  const emit = defineEmits(['close'])

  const handleCreateAdmin = async () => {
    await createAdmin().then(() => {
      emit('close')
    })
  }

  </script>
  