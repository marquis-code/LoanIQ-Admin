<template>
<form>
    <div class="grid grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-6 p-3">
        <div v-for="(value, key) in user" :key="key" class="sm:col-span-3">
          <p class="uppercase text-sm">{{ key }}</p>
          <p class="text-sm">
            {{ value }}
          </p>
        </div>
  </div>
</form>

</template>

<script setup lang="ts">
const props = defineProps({
  user: {
     type: Object
  }
})
</script>