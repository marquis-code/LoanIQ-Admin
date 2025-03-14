<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Wallet Management</h1>

    <!-- Wallet Summary -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-lg font-semibold mb-4">Wallet Summary</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-500">Total Balance</h3>
          <p class="text-2xl font-bold">{{ formatCurrency(walletSummary.totalBalance) }}</p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500">Available Balance</h3>
          <p class="text-2xl font-bold">{{ formatCurrency(walletSummary.availableBalance) }}</p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500">Pending Transactions</h3>
          <p class="text-2xl font-bold">{{ walletSummary.pendingTransactions }}</p>
        </div>
      </div>
    </div>

    <!-- Wallet Actions -->
    <!-- <div class="flex flex-wrap gap-4 mb-8">
      <button @click="openDepositModal" class="bg-blue-500 text-white px-4 py-2 rounded-md">Deposit Funds</button>
      <button @click="openWithdrawModal" class="bg-green-500 text-white px-4 py-2 rounded-md">Withdraw Funds</button>
      <button @click="openTransferModal" class="bg-yellow-500 text-white px-4 py-2 rounded-md">Transfer Funds</button>
    </div> -->
    <!-- {{ transactionHistory }} -->

    <!-- Recent Transactions -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-lg font-semibold mb-4">Recent Transactions</h2>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="transaction in recentTransactions" :key="transaction.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ transaction.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ transaction.type }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatCurrency(transaction.amount) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(transaction.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ transaction.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(transaction.date) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button @click="viewTransactionDetails(transaction)" class="text-blue-600 hover:text-blue-900">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <div v-if="isDepositModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Deposit Funds</h2>
        <form @submit.prevent="handleDeposit">
          <div class="mb-4">
            <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
            <input type="number" id="amount" v-model="depositAmount" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded-md">Deposit</button>
        </form>
        <button @click="isDepositModalOpen = false" class="mt-4 w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
      </div>
    </div>

    <div v-if="isWithdrawModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Withdraw Funds</h2>
        <form @submit.prevent="handleWithdraw">
          <div class="mb-4">
            <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
            <input type="number" id="amount" v-model="withdrawAmount" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
          </div>
          <button type="submit" class="w-full bg-green-500 text-white px-4 py-2 rounded-md">Withdraw</button>
        </form>
        <button @click="isWithdrawModalOpen = false" class="mt-4 w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
      </div>
    </div>

    <div v-if="isTransferModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Transfer Funds</h2>
        <form @submit.prevent="handleTransfer">
          <div class="mb-4">
            <label for="recipient" class="block text-sm font-medium text-gray-700">Recipient</label>
            <input type="text" id="recipient" v-model="transferRecipient" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
          </div>
          <div class="mb-4">
            <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
            <input type="number" id="amount" v-model="transferAmount" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
          </div>
          <button type="submit" class="w-full bg-yellow-500 text-white px-4 py-2 rounded-md">Transfer</button>
        </form>
        <button @click="isTransferModalOpen = false" class="mt-4 w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWalletTransactionHistory } from '@/composables/modules/wallet/useWalletTransactionHistory'
import { ref } from 'vue'
const { fetchTransactionHistory, loading, transactionHistory } = useWalletTransactionHistory()

interface WalletSummary {
  totalBalance: number
  availableBalance: number
  pendingTransactions: number
}

interface Transaction {
  id: string
  type: string
  amount: number
  status: string
  date: string
}

const walletSummary = ref<WalletSummary>({
  totalBalance: 10000,
  availableBalance: 8500,
  pendingTransactions: 3
})

const recentTransactions = ref<Transaction[]>([
  { id: '1', type: 'deposit', amount: 1000, status: 'completed', date: '2025-02-23T10:00:00Z' },
  { id: '2', type: 'withdrawal', amount: 500, status: 'pending', date: '2025-02-23T11:00:00Z' },
  { id: '3', type: 'transfer', amount: 250, status: 'completed', date: '2025-02-23T12:00:00Z' },
  { id: '4', type: 'deposit', amount: 2000, status: 'completed', date: '2025-02-23T13:00:00Z' },
  { id: '5', type: 'withdrawal', amount: 1000, status: 'failed', date: '2025-02-23T14:00:00Z' },
])

const isDepositModalOpen = ref(false)
const isWithdrawModalOpen = ref(false)
const isTransferModalOpen = ref(false)

const depositAmount = ref(0)
const withdrawAmount = ref(0)
const transferAmount = ref(0)
const transferRecipient = ref('')

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'failed': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const openDepositModal = () => {
  isDepositModalOpen.value = true
}

const openWithdrawModal = () => {
  isWithdrawModalOpen.value = true
}

const openTransferModal = () => {
  isTransferModalOpen.value = true
}

const handleDeposit = () => {
  // Implement deposit logic here
  console.log('Depositing:', depositAmount.value)
  isDepositModalOpen.value = false
}

const handleWithdraw = () => {
  // Implement withdraw logic here
  console.log('Withdrawing:', withdrawAmount.value)
  isWithdrawModalOpen.value = false
}

const handleTransfer = () => {
  // Implement transfer logic here
  console.log('Transferring:', transferAmount.value, 'to', transferRecipient.value)
  isTransferModalOpen.value = false
}

const viewTransactionDetails = (transaction: Transaction) => {
  // Implement view transaction details logic here
  console.log('Viewing transaction:', transaction)
}

definePageMeta({
  layout: 'admin-dashboard',
  middleware: 'auth',
})
</script>