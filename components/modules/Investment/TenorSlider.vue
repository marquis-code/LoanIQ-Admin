<template>
    <div class="space-y-6">
      <!-- Min Tenor Slider -->
      <div>
        <label for="minTenor" class="block text-sm font-semibold">Min Tenor</label>
        <div class="flex items-center space-x-2">
          <input
            type="range"
            id="minTenor"
            v-model="minTenor"
            :min="minTenorValue"
            :max="maxTenorValue"
            class="w-full"
            @input="emitSelection"
          />
          <span class="text-sm font-medium">{{ minTenor }}</span>
        </div>
      </div>
  
      <!-- Max Tenor Slider -->
      <div>
        <label for="maxTenor" class="block text-sm font-semibold">Max Tenor</label>
        <div class="flex items-center space-x-2">
          <input
            type="range"
            id="maxTenor"
            v-model="maxTenor"
            :min="minTenorValue"
            :max="maxTenorValue"
            class="w-full"
            @input="emitSelection"
          />
          <span class="text-sm font-medium">{{ maxTenor }}</span>
        </div>
      </div>
  
      <!-- Display Selected Values -->
      <!-- <div class="mt-4">
        <p class="font-semibold">Selected Tenor Range:</p>
        <pre>Min Tenor: {{ minTenor }}</pre>
        <pre>Max Tenor: {{ maxTenor }}</pre>
      </div> -->
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    setup(props, { emit }) {
      // Default values for min and max tenor range
      const minTenorValue = 3;
      const maxTenorValue = 6;
  
      // Reactive properties to hold the selected values
      const minTenor = ref(minTenorValue);
      const maxTenor = ref(maxTenorValue);
  
      // Emit selected values to the parent when sliders change
      const emitSelection = () => {
        emit('update:selectedTenor', { minTenor: minTenor.value, maxTenor: maxTenor.value });
      };
  
      return {
        minTenor,
        maxTenor,
        minTenorValue,
        maxTenorValue,
        emitSelection,
      };
    },
  });
  </script>
  
  <style scoped>
  /* Optional custom styles */
  input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 8px;
    background: #ddd;
    border-radius: 4px;
    outline: none;
    transition: background 0.3s ease;
  }
  
  input[type="range"]:focus {
    background: #bbb;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #4caf50;
    border-radius: 50%;
    cursor: pointer;
  }
  
  input[type="range"]::-webkit-slider-runnable-track {
    height: 8px;
    background: #ddd;
    border-radius: 4px;
  }
  
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: #bbb;
  }
  
  input[type="range"]:active::-webkit-slider-thumb {
    background: #388e3c;
  }
  </style>
  