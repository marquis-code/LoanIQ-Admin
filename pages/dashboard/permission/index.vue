<template>
<main class="">
    <ModulesPermissionsList :loading="loading" :permissions="permissions" @selected="handleSelected" />
    <CoreDrawer :show="openDrawer" @close="closeDrawer">
        <template #content>
            <ModulesPermissionsDetails :permission="selectedPermission" />
        </template>
    </CoreDrawer>
</main>
</template>

<script setup lang="ts">
import { useFetchPermissions } from '@/composables/modules/permissions/useFetchPermissions'
const { loading,
  permissions } = useFetchPermissions()
  definePageMeta({
          layout: 'admin-dashboard',
           middleware: 'auth'
      })

  const openDrawer = ref(false)
  const selectedPermission = ref({})

  const handleSelected = (data: any) => {
    selectedPermission.value = data
    openDrawer.value = true
  }

  const closeDrawer = () => {
    console.log('here')
    openDrawer.value = false
  }
</script>
