<template>
    <main class="">
      <div  v-if="users?.length && !loading">
        <ModulesUsersList :loading="loading" :users="users" @selected="handleSelected" />
      <div class="px-7">
      <CorePagination
          v-if="!loading && users.length > 0"
          :total="metadata.total"
          :page="metadata.page"
          :perPage="metadata.pageSize"
          :pages="metadata.pages"
          @page-changed="handlePageChange"
        />
      </div>
      </div>
      <div v-else-if="!users?.length && !loading"
           class="flex mx-auto border-[0.5px] mt-5 mx-6 flex-col items-center justify-center h-64 bg-white rounded-lg">
        <div class="flex items-center justify-center p-6 mb-4">
          <img :src="dynamicIcons('illustration')" />
        </div>
        <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
          No Users Available
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
    import { usePermissions } from '@/composables/core/usePermissions'
    const { canView } = usePermissions()
    import {dynamicIcons} from "~/utils/assets";
    const { loading, metadata,
     users} = useGetUsers()
      definePageMeta({
          layout: 'admin-dashboard',
            middleware: ['auth'],
            // moduleId: 'user-management'
      })
    
      const openDrawer = ref(false)
      const selectedUser = ref({})
    
      const handleSelected = (data: any) => {
        selectedUser.value = data
        openDrawer.value = true
      }
    
      const closeDrawer = () => {
        openDrawer.value = false
      }

      const handlePageChange = (page: number) => {
  metadata.value.page = page
}
    </script>
    