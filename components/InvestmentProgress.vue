<template>
    <div class="mt-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <p class="text-sm font-medium">Investment Progress</p>
          <div class="relative ml-2">
            <HelpCircle 
              @click="showTooltip = !showTooltip" 
              @mouseenter="showTooltip = true"
              @mouseleave="showTooltip = false"
              class="h-4 w-4 text-gray-400 cursor-pointer hover:text-primary transition-colors"
            />
            <div v-if="showTooltip" class="absolute left-0 top-6 bg-white text-gray-800 p-3 rounded-lg shadow-lg z-10 w-64 text-xs">
              <p>This shows how far your investment has progressed toward maturity.</p>
              <p class="mt-1">
                <span class="font-medium">Start:</span> {{ formatDate(startDate) }}
              </p>
              <p>
                <span class="font-medium">Maturity:</span> {{ formatDate(maturityDate) }}
              </p>
              <div class="mt-2 flex items-center gap-2">
                <span class="block h-2 w-2 rounded-full bg-blue-500"></span>
                <span>Early stage (0-25%)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="block h-2 w-2 rounded-full bg-green-500"></span>
                <span>Mid stage (26-50%)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="block h-2 w-2 rounded-full bg-yellow-500"></span>
                <span>Later stage (51-75%)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="block h-2 w-2 rounded-full bg-orange-500"></span>
                <span>Final stage (76-100%)</span>
              </div>
              <div class="absolute top-[-6px] left-0 w-3 h-3 bg-white transform rotate-45"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <p 
            class="text-sm font-medium transition-all duration-300" 
            :class="progressTextColor"
          >
            {{ progressPercentage }}%
          </p>
          <Clock class="ml-1 h-4 w-4" :class="progressTextColor" />
        </div>
      </div>
      
      <div class="mt-2 h-3 w-full rounded-full bg-gray-100 overflow-hidden relative">
        <!-- Background pattern for empty part -->
        <div class="absolute inset-0 opacity-10">
          <div class="w-full h-full" style="background-image: linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent); background-size: 8px 8px;"></div>
        </div>
        
        <!-- Animated progress bar -->
        <div
          class="h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
          :class="progressColorClass"
          :style="{ width: `${animatedWidth}%` }"
        >
          <!-- Animated shine effect -->
          <div 
            class="absolute inset-0 opacity-30 animate-shine"
            style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); background-size: 200% 100%;"
          ></div>
          
          <!-- Animated pulse at the end of the progress bar -->
          <div 
            v-if="progressPercentage > 0 && progressPercentage < 100"
            class="absolute right-0 top-0 h-full w-2 animate-pulse"
            :class="progressPulseClass"
          ></div>
        </div>
        
        <!-- Milestone markers -->
        <div class="absolute inset-0 flex items-center">
          <div class="relative w-full h-full">
            <div v-for="milestone in [25, 50, 75]" :key="milestone" 
                 class="absolute top-0 bottom-0 w-px bg-white" 
                 :style="{ left: `${milestone}%` }">
              <div class="absolute -top-1 -translate-x-1/2 h-5 w-px bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Time remaining -->
      <div class="mt-2 flex justify-between text-xs text-gray-500">
        <span>{{ daysElapsed }} days elapsed</span>
        <span>{{ daysRemaining }} days remaining</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { HelpCircle, Clock } from 'lucide-vue-next';
  
  interface Props {
    startDate: string;
    maturityDate: string;
  }
  
  const props = defineProps<Props>();
  const showTooltip = ref(false);
  const animatedWidth = ref(0);
  
  // Calculate progress percentage
  const progressPercentage = computed(() => {
    if (!props.startDate || !props.maturityDate) return 0;
    
    const start = new Date(props.startDate);
    const end = new Date(props.maturityDate);
    const now = new Date();
    
    if (now > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    return Math.max(0, Math.min(Math.round((current / total) * 100), 100));
  });
  
  // Calculate days elapsed and remaining
  const daysElapsed = computed(() => {
    if (!props.startDate) return 0;
    
    const start = new Date(props.startDate);
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, elapsed);
  });
  
  const daysRemaining = computed(() => {
    if (!props.maturityDate) return 0;
    
    const end = new Date(props.maturityDate);
    const now = new Date();
    const remaining = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, remaining);
  });
  
  // Determine progress bar color based on percentage
  const progressColorClass = computed(() => {
    const percentage = progressPercentage.value;
    
    if (percentage <= 25) return 'bg-blue-500';
    if (percentage <= 50) return 'bg-green-500';
    if (percentage <= 75) return 'bg-yellow-500';
    return 'bg-orange-500';
  });
  
  // Determine pulse color based on percentage
  const progressPulseClass = computed(() => {
    const percentage = progressPercentage.value;
    
    if (percentage <= 25) return 'bg-blue-300';
    if (percentage <= 50) return 'bg-green-300';
    if (percentage <= 75) return 'bg-yellow-300';
    return 'bg-orange-300';
  });
  
  // Determine text color based on percentage
  const progressTextColor = computed(() => {
    const percentage = progressPercentage.value;
    
    if (percentage <= 25) return 'text-blue-500';
    if (percentage <= 50) return 'text-green-500';
    if (percentage <= 75) return 'text-yellow-500';
    return 'text-orange-500';
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Animate progress bar on mount
  onMounted(() => {
    setTimeout(() => {
      animatedWidth.value = progressPercentage.value;
    }, 300);
  });
  
  // Update animated width when progress changes
  watch(progressPercentage, (newValue) => {
    animatedWidth.value = newValue;
  });
  </script>
  
  <style scoped>
  @keyframes shine {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
  
  .animate-shine {
    animation: shine 3s infinite linear;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
  
  .animate-pulse {
    animation: pulse 1.5s infinite;
  }
  </style>
  
  