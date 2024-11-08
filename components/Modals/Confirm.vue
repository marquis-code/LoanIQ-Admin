<template>
    <transition name="modal">
      <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-b-xl shadow-md w-full max-w-md space-y-10">
          <!-- Back Button -->
          <div class="flex justify-start">
            <button @click="closeModal" class="text-sm text-gray-600">&larr; Back</button>
          </div>
  
          <!-- Confirm Transfer Title -->
          <div class="text-center">
            <h2 class="text-2xl font-bold mb-2">{{title}}</h2>
            <p class="text-sm mb-6">
             {{ description }}
            </p>
          </div>
  
          <!-- Confirm Button -->
          <div class="mt-6">
            <button :disabled="loading" class="bg-[#2F6D67] disabled:opacity-25 disabled:cursor-not-allowed text-white px-4 py-3.5 w-full rounded-md" @click="confirmTransfer">
              {{  loading ? "processing..." : 'Cotinue' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
    const emit = defineEmits(['close', 'continue']);

  function confirmTransfer() {
    // Logic to confirm the transfer
    emit('continue')
    console.log('Transfer confirmed');
  }

  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    }
  })

  
  function closeModal() {
    emit('close');
  }
  </script>
  
  <style scoped>
  /* Transition for modal */
  .modal-enter-active, .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  .modal-enter-from, .modal-leave-to {
    opacity: 0;
  }
  </style>
  