<template>
    <main class="">
      <ModulesUsersList v-if="users.length && !loading" :loading="loading" :users="users" @selected="handleSelected" />
      <div v-else-if="!users.length && !loading"
           class="flex border-[0.5px] mt-5 flex-col items-center justify-center h-64 bg-white rounded-lg">
        <div class="flex items-center justify-center p-6 mb-4">
          <img :src="dynamicIcons('illustration')" />
        </div>
        <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
          No Investment Product Available
        </p>
      </div>
      <CoreLoader v-else class="mt-6" />
        <CoreDrawer :showFooter="false" title="User Details" description="Below are investment details" :show="openDrawer" @close="closeDrawer">
            <template #content>
                <ModulesUsersDetails :user="selectedUser" />
            </template>
        </CoreDrawer>
    </main>
    </template>
    
    <script setup lang="ts">
    import { useGetUsers } from '@/composables/modules/users/useGetUsers'
    import {dynamicIcons} from "~/utils/assets";
    const { loading,
     users} = useGetUsers()
      definePageMeta({
          layout: 'admin-dashboard',
          middleware: 'auth'
      })
    
      const openDrawer = ref(false)
      const selectedUser = ref({})
    
      const handleSelected = (data: any) => {
        console.log(data, 'selected user')
        selectedUser.value = data
        openDrawer.value = true
      }
    
      const closeDrawer = () => {
        console.log('here')
        openDrawer.value = false
      }
    </script>
    