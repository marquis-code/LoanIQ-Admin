<template>
    <div>
      <label for="benefit" class="input-label text-sm">Add Investment Benefit</label>
      <div class="flex gap-2 mb-4">
        <input
          type="text"
          v-model="benefitInput"
          placeholder="Enter benefit"
          class="input-field"
          @input="checkDuplicate"
        />
        <button
          @click="addBenefit"
          :disabled="!benefitInput || isDuplicate"
          class="px-4 py-1 text-white bg-green-500 rounded disabled:bg-gray-400"
        >
          Save
        </button>
      </div>
  
      <label for="description" class="input-label text-sm">Investment Benefits</label>
      <ul class="flex flex-wrap gap-4">
        <li
          class="flex items-center gap-x-2 texts-sm text-gray-500"
          v-for="(item, index) in benefits"
          :key="index"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#417505"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            ></polygon>
          </svg>
          {{ item }}
        </li>
      </ul>
    </div>
  </template>
  

  <script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps<{
  initialBenefits: string[];
}>();

const emits = defineEmits<{
  (e: 'update:benefits', value: string[]): void;
}>();

const benefitInput = ref<string>('');
const benefits = ref<string[]>([...props.initialBenefits]);
const isDuplicate = ref<boolean>(false);

// Check for duplicate benefits
const checkDuplicate = () => {
  isDuplicate.value = benefits.value.includes(benefitInput.value.trim());
};

// Add benefit to the array and clear input field
const addBenefit = () => {
  if (benefitInput.value.trim() && !isDuplicate.value) {
    benefits.value.push(benefitInput.value.trim());
    emits('update:benefits', benefits.value);
    benefitInput.value = ''; // Clear the input field
    isDuplicate.value = false; // Reset duplicate status
  }
};
</script>

<style scoped>
.input-label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
}
</style>
