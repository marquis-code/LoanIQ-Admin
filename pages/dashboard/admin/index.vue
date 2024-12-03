<template>
    <main class="">
      <ModulesAdminsList :loading="loading" :admins="admins" @selected="handleSelected" />
        <CoreDrawer :showFooter="false" title="Admin Details" description="Below are admin details" :show="openDrawer" @close="closeDrawer">
            <template #content>
                <ModulesAdminsDetails :admin="selectedAdmin" />
            </template>
        </CoreDrawer>
    </main>
    </template>
    
    <script setup lang="ts">
    import { useGetAdmins } from '@/composables/modules/admins/useGetAdmins'
    const { loading,
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
        console.log('here')
        openDrawer.value = false
      }
    </script>
    