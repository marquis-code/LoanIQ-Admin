<template>
    <!-- <div class="grid grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-6 p-3">
        <div v-for="(value, key) in admin" :key="key" class="sm:col-span-3">
          <p class="uppercase text-sm">{{ key }}</p>
          <p class="text-sm">
            {{ value }}
          </p>
        </div>
  </div> -->
  <div class="border-t border-gray-100">
    <dl class="divide-y divide-gray-100">
      <div  v-for="(value, key) in admin" :key="key" class="bg-gray-50 odd:bg-white even:bg-slate-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
        <dt class="text-sm/6 font-medium text-gray-900">{{ key }}</dt>
        <!-- <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ value }}</dd> -->
        <dd v-if="key !== 'permissions'" class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ value }}</dd>
        <dd v-else class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
          <div class="pb-3" v-for="item in value">
            <p class="font-medium">{{ item?.moduleId }}</p>
          <div class=" grid grid-cols-4 gap-3">
            <p class="bg-black text-xs inline-block py-1.5 text-center text-white rounded-lg" v-for="itm in item?.permissions">
              {{ itm }}
            </p>
          </div>
          </div>
        </dd>
      </div>
    </dl>
  </div>

</template>

<script setup lang="ts">
const props = defineProps({
  admin: {
     type: Object
  }
})
</script>