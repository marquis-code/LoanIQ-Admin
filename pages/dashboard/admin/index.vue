<template>
    <main class="">
      <ModulesAdminsList :loading="loading" :admins="admins" @selected="handleSelected" />
        <CoreDrawer :showFooter="false" title="User Details" description="Below are investment details" :show="openDrawer" @close="closeDrawer">
            <template #content>
                <ModulesAdminsDetails :user="selectedAdmin" />
            </template>
        </CoreDrawer>
    </main>
    </template>
    
    <script setup lang="ts">
    import { useGetAdmins } from '@/composables/modules/admins/useGetAdmins'
    const { loading,
      admins} = useGetAdmins()
      definePageMeta({
          layout: 'admin-dashboard'
      })
    
      const openDrawer = ref(false)
      const selectedAdmin = ref({})
    
      const handleSelected = (data: any) => {
        console.log(data, 'selected user')
        selectedAdmin.value = data
        openDrawer.value = true
      }
    
      const closeDrawer = () => {
        console.log('here')
        openDrawer.value = false
      }
    </script>
    