<template>
  <div class="border-t border-gray-100">
    <dl class="divide-y divide-gray-100">
      <div  v-for="(value, key) in user" :key="key" class="bg-gray-50 odd:bg-white even:bg-slate-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
        <dt class="text-sm/6 font-medium text-gray-900">{{ key }}</dt>
        <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ value }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  user: {
     type: Object
  }
})
</script>