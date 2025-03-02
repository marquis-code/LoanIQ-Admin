<template>
    <main class="">
      <div class="sm:flex sm:items-center px-6">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">
          Admins
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all the admins including their name, title,
          email and role.
        </p>
      </div>
      <div v-if="canCreate('admin-management')" class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button  @click="openCreateAdminModal = true"
          class="block rounded-md bg-[#2F6D67] px-3 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#2F6D67] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6D67]"
        >
          Create Admin
        </button>
      </div>
    </div>
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

        <CoreBaseModal @success="openCreateAdminModal = false" @update:show="openCreateAdminModal = false" :show="openCreateAdminModal">
          <ModulesAdminsCreate @close="openCreateAdminModal = false" />
     </CoreBaseModal>
    </main>
    </template>
    
    <script setup lang="ts">
      import { usePermissions } from '@/composables/core/usePermissions'
      const { canView, canCreate, canDelete } = usePermissions()
    import { useGetAdmins } from '@/composables/modules/admins/useGetAdmins'
    const { loading, metadata,
      admins} = useGetAdmins()
      definePageMeta({
          layout: 'admin-dashboard',
          middleware: 'auth',
      })
    
      const openDrawer = ref(false)
      const selectedAdmin = ref({})
      const openCreateAdminModal = ref(false)
    
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
    