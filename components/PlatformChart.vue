<!-- components/PlatformChart.vue -->
<template>
    <div class="w-full h-full flex items-center justify-center" v-if="data.length === 0">
      <p class="text-gray-500">No data available</p>
    </div>
    <div class="w-full h-full" v-else ref="chartContainer"></div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  
  const props = defineProps<{
    data: { platform: string; count: number }[];
  }>();
  
  const chartContainer = ref<HTMLElement | null>(null);
  
  // Function to create the chart
  const createChart = () => {
    if (!chartContainer.value || props.data.length === 0) return;
    
    // Clear previous chart if any
    chartContainer.value.innerHTML = '';
    
    // Calculate total for percentages
    const total = props.data.reduce((sum, item) => sum + item.count, 0);
    
    // Set colors for platforms
    const colors: Record<string, string> = {
      facebook: '#4267B2',
      twitter: '#1DA1F2',
      instagram: '#E1306C',
      linkedin: '#0077B5',
      email: '#DB4437',
      other: '#34A853'
    };
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 400 200');
    
    // Create bar chart
    const barWidth = 40;
    const barGap = 20;
    const maxBarHeight = 150;
    const startX = 50;
    const startY = 180;
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '200');
    title.setAttribute('y', '20');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#374151');
    title.textContent = 'Referrals by Platform';
    svg.appendChild(title);
    
    // Find max value for scaling
    const maxValue = Math.max(...props.data.map(item => item.count));
    
    // Create bars
    props.data.forEach((item, index) => {
      const barHeight = (item.count / maxValue) * maxBarHeight;
      const x = startX + index * (barWidth + barGap);
      const y = startY - barHeight;
      
      // Bar
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bar.setAttribute('x', x.toString());
      bar.setAttribute('y', y.toString());
      bar.setAttribute('width', barWidth.toString());
      bar.setAttribute('height', barHeight.toString());
      bar.setAttribute('fill', colors[item.platform.toLowerCase()] || '#9CA3AF');
      svg.appendChild(bar);
      
      // Value label
      const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueLabel.setAttribute('x', (x + barWidth / 2).toString());
      valueLabel.setAttribute('y', (y - 5).toString());
      valueLabel.setAttribute('text-anchor', 'middle');
      valueLabel.setAttribute('font-size', '12');
      valueLabel.setAttribute('fill', '#4B5563');
      valueLabel.textContent = item.count.toString();
      svg.appendChild(valueLabel);
      
      // Platform label
      const platformLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      platformLabel.setAttribute('x', (x + barWidth / 2).toString());
      platformLabel.setAttribute('y', (startY + 15).toString());
      platformLabel.setAttribute('text-anchor', 'middle');
      platformLabel.setAttribute('font-size', '10');
      platformLabel.setAttribute('fill', '#4B5563');
      platformLabel.textContent = item.platform.charAt(0).toUpperCase() + item.platform.slice(1);
      svg.appendChild(platformLabel);
    });
    
    // Add to container
    chartContainer.value.appendChild(svg);
  };
  
  // Create chart on mount and when data changes
  onMounted(createChart);
  watch(() => props.data, createChart, { deep: true });
  </script>
  