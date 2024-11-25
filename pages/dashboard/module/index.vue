<template>
    <main class="">
        <ModulesAppList :loading="loading" :modules="modules" @selected="handleSelected" />
        <CoreDrawer :show="openDrawer" @close="closeDrawer">
            <template #content>
                <ModulesAppDetails :module="selectedModule" />
            </template>
        </CoreDrawer>
    </main>
    </template>
    
    <script setup lang="ts">
    import { useFetchModules } from '@/composables/modules/app/useFetchAppModule'
    const { loading,
      modules } = useFetchModules()
      definePageMeta({
          layout: 'admin-dashboard'
      })
    
      const openDrawer = ref(false)
      const selectedModule = ref({})
    
      const handleSelected = (data: any) => {
        selectedModule.value = data
        openDrawer.value = true
      }
    
      const closeDrawer = () => {
        console.log('here')
        openDrawer.value = false
      }
    </script>
    