<template>
    <div class="space-y-2">
      <h3 class="font-semibold text-sm">Automated Frequency</h3>
      <div class="space-y-2">
        <label v-for="(frequency, index) in automatedFrequencies" :key="index" class="flex items-center input-label space-x-2">
          <input 
            type="checkbox"
            :value="frequency"
            v-model="selectedAutomatedFrequencies"
            @change="emitSelection"
            class="form-checkbox text-blue-600"
          />
          <span>{{ frequency }}</span>
        </label>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  
  export default defineComponent({
    setup(props, { emit }) {
      // Possible options for automated frequency
      const automatedFrequencies = ['one-off', 'daily', 'weekly', 'monthly'];
  
      // Reactive array for selected frequencies
      const selectedAutomatedFrequencies = ref<string[]>([]);
  
      // Emit the selected values to the parent whenever the selection changes
      const emitSelection = () => {
        emit('update:selectedAutomatedFrequencies', selectedAutomatedFrequencies.value);
      };
  
      // Watch the selected values and emit changes to the parent
      watch(selectedAutomatedFrequencies, emitSelection);
  
      return {
        automatedFrequencies,
        selectedAutomatedFrequencies,
        emitSelection,
      };
    },
  });
  </script>
  
  <style scoped>
  /* You can add custom styles here if needed */
  </style>
  