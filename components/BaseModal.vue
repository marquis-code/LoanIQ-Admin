<template>
        <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
    <div v-if="show"  class="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
        <div class="bg-white rounded-3xl shadow-lg p-5 max-w-lg w-full m-auto">
            <button @click="closeModal" class="float-right text-xl font-semibold">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_7596_1365" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="4" y="4" width="24"
                        height="24">
                        <rect x="4" y="4" width="24" height="24" fill="#C4C4C4" />
                    </mask>
                    <g mask="url(#mask0_7596_1365)">
                        <path
                            d="M10.4 22.3L9.69995 21.6L15.3 16L9.69995 10.4L10.4 9.70001L16 15.3L21.6 9.70001L22.3 10.4L16.7 16L22.3 21.6L21.6 22.3L16 16.7L10.4 22.3Z"
                            fill="#131316" />
                    </g>
                </svg>
            </button>
            <slot></slot>
        </div>
    </div>
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
@media (min-width: 768px) {
    .modal-content {
        width: 50%;
    }
}

.backdrop-blur-sm {
    backdrop-filter: blur(8px);
  }
</style>
