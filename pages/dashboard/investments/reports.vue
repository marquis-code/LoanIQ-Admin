<template>
    <div class="container mx-auto p-4 space-y-8">
      <!-- Investment Reports Header -->
      <h2 class="text-2xl font-semibold">Investment Reports</h2>
  
      <!-- Investment Report Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="report in reports" :key="report.title" class="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
          <div class="flex items-center space-x-2 mb-4">
<!--            <img src="/report-icon.svg" alt="Report Icon" class="w-6 h-6" />-->
            <h3 class="text-gray-700 font-semibold">{{ report.title }}</h3>
          </div>
          <button class="bg-orange-500 text-white px-4 py-2 rounded-lg">View Report</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const reports = ref([
    { title: 'Investment Report' },
    { title: 'Investment Liquidation Report' },
    { title: 'Investment Maturity Report' },
    { title: 'Interest Accrued Report' },
    { title: 'Activity Report' },
    { title: 'Short Term Investment Report' },
    { title: 'Short Term Maturity Report' },
    { title: 'Short Term Liquidation Report' },
  ]);

  definePageMeta({
          layout: 'admin-dashboard',
           middleware: 'auth'
      })
  </script>
  