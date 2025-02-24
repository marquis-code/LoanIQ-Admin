<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Financial Analytics</h1>
  
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="metric in summaryMetrics" :key="metric.label" class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-lg font-semibold mb-2">{{ metric.label }}</h2>
          <p class="text-2xl font-bold">{{ formatCurrency(metric.value) }}</p>
          <p :class="metric.change >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ metric.change >= 0 ? '+' : '' }}{{ metric.change }}% from last period
          </p>
        </div>
      </div>
  
      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-lg font-semibold mb-4">Revenue vs Expenses</h2>
          <div class="h-80 bg-gray-100 flex items-center justify-center">
            Revenue vs Expenses Chart
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-lg font-semibold mb-4">Transaction Volume</h2>
          <div class="h-80 bg-gray-100 flex items-center justify-center">
            Transaction Volume Chart
          </div>
        </div>
      </div>
  
      <!-- Top Transactions -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Top Transactions</h2>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaction in topTransactions" :key="transaction.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ transaction.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ transaction.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatCurrency(transaction.amount) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(transaction.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  interface SummaryMetric {
    label: string
    value: number
    change: number
  }
  
  interface Transaction {
    id: string
    type: string
    amount: number
    date: string
  }
  
  const summaryMetrics = ref<SummaryMetric[]>([
    { label: 'Total Revenue', value: 500000, change: 5.2 },
    { label: 'Total Expenses', value: 300000, change: -2.1 },
    { label: 'Net Profit', value: 200000, change: 8.7 },
    { label: 'Average Transaction', value: 750, change: 1.5 },
  ])
  
  const topTransactions = ref<Transaction[]>([
    { id: '1', type: 'deposit', amount: 10000, date: '2025-02-23T10:00:00Z' },
    { id: '2', type: 'withdrawal', amount: 5000, date: '2025-02-23T11:00:00Z' },
    { id: '3', type: 'deposit', amount: 7500, date: '2025-02-23T12:00:00Z' },
    { id: '4', type: 'withdrawal', amount: 3000, date: '2025-02-23T13:00:00Z' },
    { id: '5', type: 'deposit', amount: 6000, date: '2025-02-23T14:00:00Z' },
  ])
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
  }

  definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth',
})
  </script>