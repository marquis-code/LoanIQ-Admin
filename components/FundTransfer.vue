<script setup lang="ts">
import { ref, computed } from 'vue'

interface BeneficiaryAccount {
  id: string
  accountName: string
  accountNumber: string
  bankName: string
  lastFourDigits: string
  cardType: 'visa' | 'mastercard'
}

// Sample beneficiary data
const beneficiaries = ref<BeneficiaryAccount[]>([
  {
    id: '1',
    accountName: 'John Doe',
    accountNumber: '1234567890',
    bankName: 'Chase Bank',
    lastFourDigits: '4321',
    cardType: 'visa'
  },
  {
    id: '2',
    accountName: 'Jane Smith',
    accountNumber: '0987654321',
    bankName: 'Bank of America',
    lastFourDigits: '8765',
    cardType: 'mastercard'
  }
])

const isModalOpen = ref(false)
const amount = ref('')
const selectedBeneficiary = ref<BeneficiaryAccount | null>(null)
const password = ref('')
const isProcessing = ref(false)
const currentStep = ref(1)

const formattedAmount = computed(() => {
  if (!amount.value) return ''
  const numericValue = amount.value.replace(/[^0-9.]/g, '')
  const parsedValue = parseFloat(numericValue)
  if (isNaN(parsedValue)) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(parsedValue)
})

const handleAmountInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  amount.value = input.value.replace(/[^0-9.]/g, '')
}

const selectBeneficiary = (beneficiary: BeneficiaryAccount) => {
  selectedBeneficiary.value = beneficiary
}

const handleTransfer = async () => {
  if (!selectedBeneficiary.value || !amount.value || !password.value) return
  
  isProcessing.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  isProcessing.value = false
  isModalOpen.value = false
  
  // Reset form
  amount.value = ''
  selectedBeneficiary.value = null
  password.value = ''
  currentStep.value = 1
}

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}
</script>

<template>
  <div>
    <!-- Trigger Button -->
    <!-- <button
      @click="isModalOpen = true"
      class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
    >
      New Transfer
    </button> -->

    <!-- Modal Overlay -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <!-- Modal Content -->
      <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden relative">
        <!-- Modal Header -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-semibold text-gray-800">Transfer Funds</h2>
            <button
              @click="isModalOpen = false"
              class="text-gray-500 hover:text-gray-700"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <!-- Improved Progress Steps -->
          <div class="flex items-center justify-center px-4">
            <div class="flex items-center w-full max-w-md">
              <!-- Step 1 -->
              <div class="relative flex flex-col items-center flex-1">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium',
                    currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  ]"
                >
                  1
                </div>
                <span class="text-xs mt-2 text-gray-600">Amount</span>
              </div>

              <!-- Connector 1-2 -->
              <div class="flex-1 h-1 mx-2" :class="[
                currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
              ]"></div>

              <!-- Step 2 -->
              <div class="relative flex flex-col items-center flex-1">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium',
                    currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  ]"
                >
                  2
                </div>
                <span class="text-xs mt-2 text-gray-600">Recipient</span>
              </div>

              <!-- Connector 2-3 -->
              <div class="flex-1 h-1 mx-2" :class="[
                currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'
              ]"></div>

              <!-- Step 3 -->
              <div class="relative flex flex-col items-center flex-1">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium',
                    currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  ]"
                >
                  3
                </div>
                <span class="text-xs mt-2 text-gray-600">Confirm</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <!-- Step 1: Amount -->
          <div v-if="currentStep === 1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Enter Amount
            </label>
            <div class="relative">
              <span class="absolute left-4 top-3 text-gray-500">$</span>
              <input
                type="text"
                v-model="amount"
                @input="handleAmountInput"
                class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <p class="text-lg font-semibold text-gray-700 mt-4">
              {{ formattedAmount }}
            </p>
          </div>

          <!-- Step 2: Select Beneficiary -->
          <div v-if="currentStep === 2" class="space-y-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Recipient
            </label>
            <div class="grid gap-4">
              <div
                v-for="beneficiary in beneficiaries"
                :key="beneficiary.id"
                @click="selectBeneficiary(beneficiary)"
                :class="[
                  'cursor-pointer p-4 rounded-xl transition-all transform hover:scale-105',
                  selectedBeneficiary?.id === beneficiary.id
                    ? 'ring-2 ring-blue-500 bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300'
                ]"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-semibold">{{ beneficiary.accountName }}</p>
                    <p class="text-sm opacity-80">
                      {{ beneficiary.bankName }}
                    </p>
                    <p class="text-sm opacity-80">
                      •••• {{ beneficiary.lastFourDigits }}
                    </p>
                  </div>
                  <div class="w-12">
                    <img
                      v-if="beneficiary.cardType === 'visa'"
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                      alt="Visa"
                      class="w-full"
                    />
                    <img
                      v-else
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                      alt="Mastercard"
                      class="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Password -->
          <div v-if="currentStep === 3">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Enter Password to Confirm
            </label>
            <input
              type="password"
              v-model="password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 border-t border-gray-200 flex justify-between">
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <div class="flex-1"></div>
          <button
            v-if="currentStep < 3"
            @click="nextStep"
            :disabled="
              (currentStep === 1 && !amount) ||
              (currentStep === 2 && !selectedBeneficiary)
            "
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
          <button
            v-else
            @click="handleTransfer"
            :disabled="!password || isProcessing"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span v-if="isProcessing">Processing...</span>
            <span v-else>Transfer {{ formattedAmount }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
