<!-- pages/analytics.vue -->
<template>
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Referral Analytics</h1>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500 mb-1">Total Referrals</h3>
          <p class="text-3xl font-bold text-gray-900">{{ stats.totalReferrals }}</p>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500 mb-1">Pending</h3>
          <p class="text-3xl font-bold text-gray-900">{{ stats.pendingReferrals }}</p>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500 mb-1">Completed</h3>
          <p class="text-3xl font-bold text-gray-900">{{ stats.completedReferrals }}</p>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-500 mb-1">Conversion Rate</h3>
          <p class="text-3xl font-bold text-gray-900">{{ stats.conversionRate.toFixed(1) }}%</p>
        </div>
      </div>
      
      <!-- Visualization -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Platform Distribution -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Referral by Platform</h2>
          <div class="h-64">
            <PlatformChart :data="stats.topPlatforms" />
          </div>
        </div>
        
        <!-- Status Distribution -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Referral Status</h2>
          <div class="h-64">
            <StatusChart 
              :completed="stats.completedReferrals" 
              :pending="stats.pendingReferrals" 
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useReferralApi } from '~/composables/useReferralApi';
  
  const { getReferralStats } = useReferralApi();
  const stats = getReferralStats;

  definePageMeta({
      layout: 'admin-dashboard'
  })
  </script>