<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Wallet Balance Card -->
      <div 
        class="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-lg text-white relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]"
        @mouseenter="activeCard = 'wallet'"
        @mouseleave="activeCard = null"
      >
        <div class="absolute right-0 top-0 opacity-10 transform transition-transform duration-500" :class="{'scale-110': activeCard === 'wallet'}">
          <Wallet class="h-32 w-32" />
        </div>
        <div class="flex justify-between items-start">
          <h2 class="text-lg font-semibold mb-2">Wallet Balance</h2>
          <div class="relative">
            <HelpCircle 
              @click="toggleTooltip('wallet')" 
              class="h-5 w-5 cursor-pointer hover:text-blue-200 transition-colors"
            />
            <div v-if="tooltips.wallet" class="absolute top-6 right-0 bg-white text-gray-800 p-3 rounded-lg shadow-lg z-10 w-64 text-sm">
              <p>Your available wallet balance. This is the amount you can spend or withdraw.</p>
              <p class="mt-1">Ledger balance includes pending transactions.</p>
              <div class="absolute top-[-6px] right-2 w-3 h-3 bg-white transform rotate-45"></div>
            </div>
          </div>
        </div>
        <p class="text-2xl font-bold transition-all duration-300" :class="{'scale-110 transform': activeCard === 'wallet'}">
          {{ formatCurrency(wallet?.balance) }}
        </p>
        <p class="text-sm mt-2">Ledger: {{ formatCurrency(wallet?.ledgerBalance) }}</p>
        <p class="text-sm mt-2">Daily Limit: ₦{{ user?.dailyLimit }}</p>
      </div>
      
      <!-- Investment Balance Card -->
      <div 
        class="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-6 shadow-lg text-white relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]"
        @mouseenter="activeCard = 'investment'"
        @mouseleave="activeCard = null"
      >
        <div class="absolute right-0 top-0 opacity-10 transform transition-transform duration-500" :class="{'scale-110': activeCard === 'investment'}">
          <TrendingUp class="h-32 w-32" />
        </div>
        <div class="flex justify-between items-start">
          <h2 class="text-lg font-semibold mb-2">Investment Balance</h2>
          <div class="relative">
            <HelpCircle 
              @click="toggleTooltip('investment')" 
              class="h-5 w-5 cursor-pointer hover:text-emerald-200 transition-colors"
            />
            <div v-if="tooltips.investment" class="absolute top-6 right-0 bg-white text-gray-800 p-3 rounded-lg shadow-lg z-10 w-64 text-sm">
              <p>Total value of all your active investments.</p>
              <p class="mt-1">This includes principal amounts and any accrued interest.</p>
              <div class="absolute top-[-6px] right-2 w-3 h-3 bg-white transform rotate-45"></div>
            </div>
          </div>
        </div>
        <p class="text-2xl font-bold transition-all duration-300" :class="{'scale-110 transform': activeCard === 'investment'}">
          {{ formatCurrency(investmentBalance) }}
        </p>
        <div class="mt-2 flex items-center text-sm">
          <ArrowUpRight class="h-4 w-4 mr-1" />
          <span>Growing your wealth</span>
        </div>
      </div>
      
      <!-- Account Details Card -->
      <div 
        class="rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 p-6 shadow-lg text-white relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]"
        @mouseenter="activeCard = 'account'"
        @mouseleave="activeCard = null"
      >
        <div class="absolute right-0 top-0 opacity-10 transform transition-transform duration-500" :class="{'scale-110': activeCard === 'account'}">
          <CreditCard class="h-32 w-32" />
        </div>
        <div class="flex justify-between items-start">
          <h2 class="text-lg font-semibold mb-2">Account Details</h2>
          <div class="relative">
            <HelpCircle 
              @click="toggleTooltip('account')" 
              class="h-5 w-5 cursor-pointer hover:text-amber-200 transition-colors"
            />
            <div v-if="tooltips.account" class="absolute top-6 right-0 bg-white text-gray-800 p-3 rounded-lg shadow-lg z-10 w-64 text-sm">
              <p>Your bank account details for deposits and withdrawals.</p>
              <p class="mt-1">Use these details to receive funds from other banks.</p>
              <div class="absolute top-[-6px] right-2 w-3 h-3 bg-white transform rotate-45"></div>
            </div>
          </div>
        </div>
        <div class="space-y-2 mt-2">
          <div class="flex items-center">
            <User class="h-4 w-4 mr-2 opacity-80" />
            <p class="text-sm">{{ wallet?.accountName || 'Not Available' }}</p>
          </div>
          <div class="flex items-center">
            <Hash class="h-4 w-4 mr-2 opacity-80" />
            <p class="text-sm">{{ wallet?.accountNumber || 'Not Available' }}</p>
          </div>
          <div class="flex items-center">
            <Building class="h-4 w-4 mr-2 opacity-80" />
            <p class="text-sm">{{ wallet?.bankName || 'Not Available' }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { 
    Wallet, 
    TrendingUp, 
    CreditCard, 
    HelpCircle,
    User,
    Hash,
    Building,
    ArrowUpRight
  } from 'lucide-vue-next';
  
  interface WalletType {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    balance?: number;
    ledgerBalance?: number;
  }
  
  interface UserType {
    dailyLimit?: string;
    // other user properties
  }
  
  const props = defineProps({
    wallet: {
      type: Object as () => WalletType,
      default: () => ({})
    },
    user: {
      type: Object as () => UserType,
      default: () => ({})
    },
    investmentBalance: {
      type: Number,
      default: 0
    },
    formatCurrency: {
      type: Function,
      required: true
    }
  });
  
  // Track which card is currently being hovered
  const activeCard = ref<string | null>(null);
  
  // Track which tooltips are visible
  const tooltips = ref({
    wallet: false,
    investment: false,
    account: false
  });
  
  // Toggle tooltip visibility
  const toggleTooltip = (name: 'wallet' | 'investment' | 'account') => {
    // Close all other tooltips
    Object.keys(tooltips.value).forEach(key => {
      if (key !== name) {
        tooltips.value[key as keyof typeof tooltips.value] = false;
      }
    });
    
    // Toggle the selected tooltip
    tooltips.value[name] = !tooltips.value[name];
  };
  
  // Close tooltips when clicking outside
  const closeTooltips = () => {
    Object.keys(tooltips.value).forEach(key => {
      tooltips.value[key as keyof typeof tooltips.value] = false;
    });
  };
  
  // Add click outside listener
  if (process.client) {
    window.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.relative')) {
        closeTooltips();
      }
    });
  }
  </script>
  
  <style scoped>
  /* Add some animation classes */
  @keyframes pulse {
    0%, 100% {
      opacity: 0.8;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
  }
  
  .animate-pulse {
    animation: pulse 2s infinite;
  }
  </style>
  
  