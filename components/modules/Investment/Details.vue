<template>
  <div class="border-t border-gray-100">
    <dl class="divide-y divide-gray-100">
      <div v-for="(value, key) in investment" :key="key" class="bg-gray-50 odd:bg-white even:bg-slate-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
        <dt class="text-sm/6 font-medium text-gray-900">{{ key }}</dt>

        <!-- Updated condition for key !== 'benefits' and key !== 'interestPaymentSchedule' -->
        <dd v-if="key !== 'benefits' && key !== 'interestPaymentSchedule' && key !== 'automatedFrequency'" class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ value }}</dd>

        <dd v-if="key === 'benefits'" class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
          <div class="grid grid-cols-3 gap-3">
            <p class="border bg-black flex justify-center items-center text-xs rounded-full text-white px-3 py-1.5" v-for="item in value">{{ item }}</p>
          </div>
        </dd>

        <dd v-if="key === 'interestPaymentSchedule'" class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
          <div class="grid grid-cols-3 gap-3">
            <p class="border bg-black flex justify-center items-center text-xs rounded-full text-white px-3 py-1.5" v-for="item in value">{{ item }}</p>
          </div>
        </dd>

        <dd v-if="key === 'automatedFrequency'" class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
          <div class="grid grid-cols-3 gap-3">
            <p class="border bg-black flex justify-center items-center text-xs rounded-full text-white px-3 py-1.5" v-for="item in value">{{ item }}</p>
          </div>
        </dd>
      </div>
    </dl>
  </div>
</template>


<script setup lang="ts">
const props = defineProps({
  investment: {
     type: Object
  }
})
</script>