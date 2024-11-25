<template>
    <main class="">
      <ModulesUsersList :loading="loading" :users="users" @selected="handleSelected" />
        <CoreDrawer :showFooter="false" title="User Details" description="Below are investment details" :show="openDrawer" @close="closeDrawer">
            <template #content>
                <ModulesUsersDetails :user="selectedUser" />
            </template>
        </CoreDrawer>
    </main>
    </template>
    
    <script setup lang="ts">
    import { useGetUsers } from '@/composables/modules/users/useGetUsers'
    const { loading,
     users} = useGetUsers()
      definePageMeta({
          layout: 'admin-dashboard'
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
    