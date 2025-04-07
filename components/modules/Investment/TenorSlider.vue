<template>
  <div class="space-y-8">
    <!-- Min Tenor Slider -->
    <div class="slider-container">
      <div class="flex justify-between items-center mb-2">
        <label for="minTenor" class="text-sm font-semibold">Min Tenor</label>
        <span class="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">{{ minTenor }} months</span>
      </div>
      <input
        type="range"
        id="minTenor"
        v-model="minTenor"
        :min="3"
        :max="maxTenor - 1"
        class="w-full slider"
        @input="handleMinTenorChange"
      />
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>3</span>
        <span>{{ maxTenor - 1 }}</span>
      </div>
    </div>
  
    <!-- Max Tenor Slider -->
    <div class="slider-container">
      <div class="flex justify-between items-center mb-2">
        <label for="maxTenor" class="text-sm font-semibold">Max Tenor</label>
        <span class="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">{{ maxTenor }} months</span>
      </div>
      <input
        type="range"
        id="maxTenor"
        v-model="maxTenor"
        :min="minTenor + 1"
        :max="24"
        class="w-full slider"
        @input="handleMaxTenorChange"
      />
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>{{ minTenor + 1 }}</span>
        <span>24</span>
      </div>
    </div>

    <!-- Visual representation of selected range -->
    <!-- <div class="relative pt-4">
      <div class="w-full h-2 bg-gray-200 rounded-full">
        <div 
          class="absolute h-2 bg-green-500 rounded-full transition-all duration-300 ease-in-out"
          :style="{ left: `${rangeLeftPercent}%`, width: `${rangeWidthPercent}%` }"
        ></div>
      </div>
      <div class="flex justify-between mt-2 text-xs">
        <span>3</span>
        <span>24</span>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';

export default defineComponent({
  emits: ['update:selectedTenor'],
  
  setup(props, { emit }) {
    // Fixed min and max tenor values
    const MIN_TENOR = 3;
    const MAX_TENOR = 24;

    // Reactive properties with correct initialization
    const minTenor = ref(MIN_TENOR);
    const maxTenor = ref(4); // Starting max at 4 as requested

    // Computed properties for the visual range indicator
    const rangeLeftPercent = computed(() => {
      return ((minTenor.value - MIN_TENOR) / (MAX_TENOR - MIN_TENOR)) * 100;
    });
    
    const rangeWidthPercent = computed(() => {
      return ((maxTenor.value - minTenor.value) / (MAX_TENOR - MIN_TENOR)) * 100;
    });

    // Handlers with proper constraints
    const handleMinTenorChange = () => {
      // Ensure min tenor doesn't go below 3
      if (minTenor.value < MIN_TENOR) {
        minTenor.value = MIN_TENOR;
      }
      
      // Ensure min tenor doesn't exceed max - 1
      if (minTenor.value >= maxTenor.value - 1) {
        minTenor.value = maxTenor.value - 1;
      }
      
      emitSelection();
    };

    const handleMaxTenorChange = () => {
      // Ensure max tenor doesn't exceed 24
      if (maxTenor.value > MAX_TENOR) {
        maxTenor.value = MAX_TENOR;
      }
      
      // Ensure max tenor is at least min + 1
      if (maxTenor.value <= minTenor.value + 1) {
        maxTenor.value = minTenor.value + 1;
      }
      
      emitSelection();
    };

    // Emit selected values to the parent
    const emitSelection = () => {
      emit('update:selectedTenor', { 
        minTenor: minTenor.value, 
        maxTenor: maxTenor.value 
      });
    };

    // Initial emit
    watch([minTenor, maxTenor], () => {
      emitSelection();
    }, { immediate: true });

    return {
      minTenor,
      maxTenor,
      emitSelection,
      handleMinTenorChange,
      handleMaxTenorChange,
      rangeLeftPercent,
      rangeWidthPercent
    };
  },
});
</script>

<style scoped>
.slider-container {
  position: relative;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  background: #388e3c;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  background: #388e3c;
}

.slider::-webkit-slider-thumb:active {
  transform: scale(1.2);
  background: #2e7d32;
}

.slider::-moz-range-thumb:active {
  transform: scale(1.2);
  background: #2e7d32;
}

.slider:focus {
  background: #d1d5db;
}
</style>