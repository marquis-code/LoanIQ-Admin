<template>
    <div class="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
      <svg
        class="w-16 h-16 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="text-gray-600 text-lg font-medium">{{ message }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    message: string
  }>()
  </script>
  
  