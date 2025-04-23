<template>
    <div class="">      
      <!-- Main Content -->
      <main class="">
        <div class="px-4 sm:px-0">
          <div class="bg-white shadow rounded-lg">
            <AuditTrail />
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import AuditTrail from '@/components/AuditTrail.vue';

  definePageMeta({
    layout: 'admin-dashboard'
  })
  </script>