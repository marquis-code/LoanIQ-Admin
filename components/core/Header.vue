<template>
        <div class="flex items-center bg-gray-100 rounded-lg p-4 shadow-sm">
      <div class="flex-1">
        <img v-if="user.avatar" :src="user.avatar" alt="Profile" class="w-10 h-10" />
        <img v-else src="@/assets/icons/avatar.svg" alt="Profile" class="w-10 h-10" />
      </div>
      <div class="ml-4">
        <h2 class="font-semibold text-sm">{{ user?.firstName }} {{user?.lastName}}</h2>
        <p class="text-gray-500 text-sm">{{ user?.email ?? 'Nil' }}</p>
      </div>
    </div>
</template>

<script setup lang="tsx">
const prop = defineProps({
    user: {
        type: Object,
        default: () => {}
    }
})
</script>