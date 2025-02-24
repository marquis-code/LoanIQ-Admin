<template>
    <main>
      <dl class="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 mb-10 border sm:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="(value, key) in analyticsData" 
          :key="key" 
          class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
        >
          <dt class="text-sm/10 font-medium text-gray-500">{{ formatKey(key) }}</dt>
          <dd class="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">{{ value }}</dd>
        </div>
      </dl>
    </main>
  </template>
  
  <script setup lang="ts">
  import { useFetchAnalytics } from '@/composables/modules/finance-mgt/useFetchAnalytics'
  const { analyticsData, loading } = useFetchAnalytics()
  
  const formatKey = (key: string): string => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  </script>
  