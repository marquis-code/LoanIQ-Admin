<!-- error.vue -->
<template>
    <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-red-600 mb-2">{{ error.statusCode }}</h1>
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">{{ error.statusMessage || 'Something went wrong' }}</h2>
          <p class="text-gray-600 mb-6">
            {{ error.message || 'Sorry, we could not process your request.' }}
          </p>
          <div class="flex justify-center">
            <button
              @click="handleError"
              class="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go back to dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    error: Object
  });
  
  const handleError = () => {
    clearError({ redirect: '/' });
  };
  </script>