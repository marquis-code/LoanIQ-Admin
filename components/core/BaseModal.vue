<template>
<!-- <transition name="modal"> -->
  <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
  <div v-if="show" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded-b-xl shadow-md w-full max-w-md space-y-10">
      <div class="flex justify-start">
        <button @click="closeModal" class="text-sm text-gray-600">&larr; Back</button>
      </div>
      <slot></slot>
    </div>
  </div>
<!-- </transition> -->
</Transition>
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

.backdrop-blur-sm {
    backdrop-filter: blur(8px);
  }
</style>

