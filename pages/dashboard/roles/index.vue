<template>
<main class="">
    <ModulesRolesList :loading="loading" :roles="roles" @selected="handleSelected" />
    <CoreDrawer title="Role deatsils" :show="openDrawer" @close="closeDrawer">
        <template #content>
            <ModulesRolesDetails :role="selectedRole" />
        </template>
    </CoreDrawer>
</main>
</template>

<script setup lang="ts">
import { useFetchRoles } from '@/composables/modules/roles/useFetchRoles'
const { loading,
  roles } = useFetchRoles()
  definePageMeta({
          layout: 'admin-dashboard',
           middleware: 'auth'
      })

  const openDrawer = ref(false)
  const selectedRole = ref({})

  const handleSelected = (data: any) => {
    selectedRole.value = data
    openDrawer.value = true
  }

  const closeDrawer = () => {
    openDrawer.value = false
  }
</script>
