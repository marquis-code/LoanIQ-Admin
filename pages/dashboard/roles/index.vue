<template>
<main class="">
    <AdminDashboardInvestmentList :loading="loading" :roles="roles" @selected="handleSelected" />
    <CoreDrawer :show="openDrawer" @close="closeDrawer">
        <template #content>
            <AdminDashboardCustomersProfile :agent="selectedAgent" />
        </template>
    </CoreDrawer>
</main>
</template>

<script setup lang="ts">
import { useFetchRoles } from '@/composables/modules/roles/useFetchRoles'
const { loading,
  roles } = useFetchRoles()
  definePageMeta({
      layout: 'admin-dashboard'
  })

  const openDrawer = ref(false)
  const selectedAgent = ref({})

  const handleSelected = (data: any) => {
    selectedAgent.value = data
    openDrawer.value = true
  }

  const closeDrawer = () => {
    console.log('here')
    openDrawer.value = false
  }
</script>
