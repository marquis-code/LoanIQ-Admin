<template>
    <div class="space-y-2">
      <h3 class="font-semibold text-gray-900 text-sm">Interest Payment Schedule</h3>
      <div class="space-y-2">
        <label v-for="(schedule, index) in interestPaymentSchedules" :key="index" class="flex items-center space-x-2 input-label">
          <input 
            type="checkbox"
            :value="schedule"
            v-model="selectedInterestSchedules"
            @change="emitSelection"
            class="form-checkbox text-blue-600"
          />
          <span>{{ schedule }}</span>
        </label>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  
  export default defineComponent({
    setup(props, { emit }) {
      // Possible options for interest payment schedule
      const interestPaymentSchedules = ['upfront', 'monthly', 'after-maturity'];
  
      // Reactive array for selected schedules
      const selectedInterestSchedules = ref<string[]>([]);
  
      // Emit the selected values to the parent whenever the selection changes
      const emitSelection = () => {
        emit('update:selectedInterestSchedules', selectedInterestSchedules.value);
      };
  
      // Watch the selected values and emit changes to the parent
      watch(selectedInterestSchedules, emitSelection);
  
      return {
        interestPaymentSchedules,
        selectedInterestSchedules,
        emitSelection,
      };
    },
  });
  </script>
  
  <style scoped>
  /* You can add custom styles here if needed */
  </style>
  