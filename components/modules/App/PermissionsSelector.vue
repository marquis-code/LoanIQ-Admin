<template>
    <fieldset>
      <legend class="sr-only">Permissions</legend>
      <div class="space-y-5">
        <div v-for="option in options" :key="option" class="relative flex items-start">
          <div class="flex h-6 items-center">
            <input
              :id="option"
              type="checkbox"
              :value="option"
              @change="toggleOption(option)"
              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div class="ml-3 text-sm">
            <label :for="option" class="font-medium text-gray-900 capitalize">{{ option }}</label>
            <p class="text-gray-500">Allow the user to {{ option }} items.</p>
          </div>
        </div>
      </div>
    </fieldset>
  </template>
  
  <script setup lang="ts">
  import { computed, defineProps, defineEmits } from 'vue';
  
  const options = ['create', 'edit', 'delete', 'view'];
  const props = defineProps<{ modelValue: string[] }>();
  const emit = defineEmits<{ (e: 'update:modelValue', value: string[]): void }>();
  
  const selectedOptions = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });
  
  const toggleOption = (option: string) => {
    if (selectedOptions.value.includes(option)) {
      selectedOptions.value = selectedOptions.value.filter(item => item !== option);
    } else {
      selectedOptions.value = [...selectedOptions.value, option];
    }
  };
  </script>
  