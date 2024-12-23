<template>
    <main class="">
      <ModulesAdminsList :loading="loading" :admins="admins" @selected="handleSelected" />
      <div class="px-7">
      <CorePagination
          v-if="!loading && admins.length > 0"
          :total="metadata.total"
          :page="metadata.page"
          :perPage="metadata.pageSize"
          :pages="metadata.pages"
          @page-changed="handlePageChange"
        />
      </div>
        <CoreDrawer :showFooter="false" title="Admin Details" description="Below are admin details" :show="openDrawer" @close="closeDrawer">
            <template #content>
                <ModulesAdminsDetails :admin="selectedAdmin" />
            </template>
        </CoreDrawer>
    </main>
    </template>
    
    <script setup lang="ts">
    import { useGetAdmins } from '@/composables/modules/admins/useGetAdmins'
    const { loading, metadata,
      admins} = useGetAdmins()
      definePageMeta({
          layout: 'admin-dashboard',
          middleware: 'auth',
      })
    
      const openDrawer = ref(false)
      const selectedAdmin = ref({})
    
      const handleSelected = (data: any) => {
        selectedAdmin.value = data
        openDrawer.value = true
      }
    
      const closeDrawer = () => {
        openDrawer.value = false
      }

      const handlePageChange = (page: number) => {
  metadata.value.page = page
}
    </script>
    