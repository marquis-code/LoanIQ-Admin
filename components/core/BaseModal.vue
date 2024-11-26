<template>
    <div 
        v-if="show" 
        class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl w-[400px] mx-auto relative">
            <button 
                @click="closeModal" 
                class="absolute top-3 right-3 z-50 text-gray-600 hover:text-gray-800 focus:outline-none">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    fill="none" 
                    viewBox="0 0 24 24">
                    <path 
                        d="M6 18L18 6M6 6l12 12" 
                        stroke="currentColor" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round" />
                </svg>
            </button>
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>();
const emit = defineEmits(['update:show']);

const closeModal = () => {
    emit('update:show', false);
};
</script>

<style scoped>
/* Optional: Fine-tune modal dimensions for larger screens */
@media (min-width: 768px) {
    .max-w-md {
        max-width: 40%;
    }
}
</style>
