<!-- components/StatusChart.vue -->
<template>
    <div class="w-full h-full flex items-center justify-center" v-if="completed === 0 && pending === 0">
      <p class="text-gray-500">No data available</p>
    </div>
    <div class="w-full h-full" v-else ref="chartContainer"></div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  
  const props = defineProps<{
    completed: number;
    pending: number;
  }>();
  
  const chartContainer = ref<HTMLElement | null>(null);
  
  // Function to create the donut chart
  const createChart = () => {
    if (!chartContainer.value) return;
    
    // Clear previous chart if any
    chartContainer.value.innerHTML = '';
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 200 200');
    
    // Calculate total
    const total = props.completed + props.pending;
    if (total === 0) return;
    
    // Calculate angles
    const completedAngle = (props.completed / total) * 360;
    const pendingAngle = (props.pending / total) * 360;
    
    // Define colors
    const completedColor = '#10B981'; // Green
    const pendingColor = '#F59E0B'; // Amber
    
    // Create donut chart
    const radius = 70;
    const innerRadius = 40;
    const centerX = 100;
    const centerY = 100;
    
    // Helper function to create a path for an arc
    const createArc = (startAngle: number, endAngle: number) => {
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      const startX = centerX + radius * Math.cos(startRad);
      const startY = centerY + radius * Math.sin(startRad);
      const endX = centerX + radius * Math.cos(endRad);
      const endY = centerY + radius * Math.sin(endRad);
      
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
      
      const outerArc = `M ${centerX},${centerY} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY} Z`;
      
      return outerArc;
    };
    
    // Create paths for each segment
    if (props.completed > 0) {
      const completedPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      completedPath.setAttribute('d', createArc(0, completedAngle));
      completedPath.setAttribute('fill', completedColor);
      svg.appendChild(completedPath);
    }
    
    if (props.pending > 0) {
      const pendingPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pendingPath.setAttribute('d', createArc(completedAngle, 360));
      pendingPath.setAttribute('fill', pendingColor);
      svg.appendChild(pendingPath);
    }
    
    // Create inner circle for donut hole
    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('cx', centerX.toString());
    innerCircle.setAttribute('cy', centerY.toString());
    innerCircle.setAttribute('r', innerRadius.toString());
    innerCircle.setAttribute('fill', 'white');
    svg.appendChild(innerCircle);
    
    // Add total in center
    const totalText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    totalText.setAttribute('x', centerX.toString());
    totalText.setAttribute('y', (centerY - 5).toString());
    totalText.setAttribute('text-anchor', 'middle');
    totalText.setAttribute('font-size', '16');
    totalText.setAttribute('font-weight', 'bold');
    totalText.setAttribute('fill', '#374151');
    totalText.textContent = total.toString();
    svg.appendChild(totalText);
    
    // Add "Total" label
    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelText.setAttribute('x', centerX.toString());
    labelText.setAttribute('y', (centerY + 15).toString());
    labelText.setAttribute('text-anchor', 'middle');
    labelText.setAttribute('font-size', '12');
    labelText.setAttribute('fill', '#6B7280');
    labelText.textContent = 'Total';
    svg.appendChild(labelText);
    
    // Add legend
    const legendY1 = 170;
    const legendY2 = 190;
    const legendX1 = 60;
    const legendX2 = 140;
    
    // Completed legend
    const completedRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    completedRect.setAttribute('x', (legendX1 - 15).toString());
    completedRect.setAttribute('y', (legendY1 - 10).toString());
    completedRect.setAttribute('width', '10');
    completedRect.setAttribute('height', '10');
    completedRect.setAttribute('fill', completedColor);
    svg.appendChild(completedRect);
    
    const completedLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    completedLabel.setAttribute('x', legendX1.toString());
    completedLabel.setAttribute('y', legendY1.toString());
    completedLabel.setAttribute('font-size', '10');
    completedLabel.setAttribute('fill', '#4B5563');
    completedLabel.textContent = `Completed: ${props.completed}`;
    svg.appendChild(completedLabel);
    
    // Pending legend
    const pendingRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    pendingRect.setAttribute('x', (legendX2 - 15).toString());
    pendingRect.setAttribute('y', (legendY1 - 10).toString());
    pendingRect.setAttribute('width', '10');
    pendingRect.setAttribute('height', '10');
    pendingRect.setAttribute('fill', pendingColor);
    svg.appendChild(pendingRect);
    
    const pendingLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    pendingLabel.setAttribute('x', legendX2.toString());
    pendingLabel.setAttribute('y', legendY1.toString());
    pendingLabel.setAttribute('font-size', '10');
    pendingLabel.setAttribute('fill', '#4B5563');
    pendingLabel.textContent = `Pending: ${props.pending}`;
    svg.appendChild(pendingLabel);
    
    // Add to container
    chartContainer.value.appendChild(svg);
  };
  
  // Create chart on mount and when data changes
  onMounted(createChart);
  watch([() => props.completed, () => props.pending], createChart);
  </script>