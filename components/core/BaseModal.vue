<template>
<transition name="modal">
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-b-xl shadow-md w-full max-w-md space-y-10">
<!--      <button-->
<!--          @click="closeModal"-->
<!--          class="absolute top-3 right-3 z-50 text-gray-600 hover:text-gray-800 focus:outline-none">-->
<!--        <svg-->
<!--            xmlns="http://www.w3.org/2000/svg"-->
<!--            width="24"-->
<!--            height="24"-->
<!--            fill="none"-->
<!--            viewBox="0 0 24 24">-->
<!--          <path-->
<!--              d="M6 18L18 6M6 6l12 12"-->
<!--              stroke="currentColor"-->
<!--              stroke-width="2"-->
<!--              stroke-linecap="round"-->
<!--              stroke-linejoin="round" />-->
<!--        </svg>-->
<!--      </button>-->
      <div class="flex justify-start">
        <button @click="closeModal" class="text-sm text-gray-600">&larr; Back</button>
      </div>
      <slot></slot>
    </div>
  </div>
</transition>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>();
const emit = defineEmits(['update:show']);

const closeModal = () => {
    emit('update:show', false);
};
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

