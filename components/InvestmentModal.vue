<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                {{ modalTitle }}
              </DialogTitle>
              
              <form @submit.prevent="handleSubmit" class="mt-4">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <input
                      type="text"
                      v-model="form.description"
                      class="mt-1 block w-full py-2.5 px-3 outline-none rounded-md border border-gray-200 shadow-sm sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Company</label>
                    <input
                      type="text"
                      v-model="form.company"
                      class="mt-1 block w-full py-2.5 px-3 outline-none rounded-md border border-gray-200 shadow-sm sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                      type="text"
                      v-model="formattedAmount"
                      @input="formatAmount"
                      class="mt-1 block w-full py-2.5 px-3 outline-none rounded-md border border-gray-200 shadow-sm sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Investment Rate (%)</label>
                    <input
                      type="text"
                      v-model="form.investmentRate"
                      class="mt-1 block w-full py-2.5 px-3 outline-none rounded-md border border-gray-200 shadow-sm sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      v-model="form.startDate"
                      :max="form.endDate"
                      @change="validateDates"
                      class="mt-1 block w-full py-2.5 px-3 outline-none rounded-md border border-gray-200 shadow-sm sm:text-sm"
                      required
                    />
                    <p v-if="dateError.startDate" class="mt-1 text-sm text-red-600">{{ dateError.startDate }}</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      v-model="form.endDate"
                      :min="form.startDate"
                      @change="validateDates"
                      class="mt-1 block w-full py-2.5 px-3 outline-none rounded-md border border-gray-200 shadow-sm sm:text-sm"
                      required
                    />
                    <p v-if="dateError.endDate" class="mt-1 text-sm text-red-600">{{ dateError.endDate }}</p>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                    @click="closeModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="loading || hasDateErrors"
                    class="inline-flex disabled:cursor-not-allowed disabled:opacity-25 justify-center rounded-md border border-transparent bg-[#2F6D67] px-4 py-2 text-sm font-medium text-white"
                  >
                    {{ loading ? 'Processing...' : 'Submit'}}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAddExternalInvestment } from '@/composables/modules/finance-mgt/useAddExternalInvestment'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import type { ExternalInvestment } from '~/types'
const { addExternalInvestment, loading } = useAddExternalInvestment()

const props = defineProps<{
  isOpen: boolean
  investment?: ExternalInvestment
  mode: 'add' | 'edit'
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: Partial<ExternalInvestment>): void
}>()

const modalTitle = computed(() => props.mode === 'add' ? 'Add New Investment' : 'Edit Investment')

const form = ref({
  description: '',
  company: '',
  amount: 0,
  investmentRate: '',
  startDate: '',
  endDate: ''
})

const formattedAmount = ref('')
const dateError = ref({
  startDate: '',
  endDate: ''
})

const hasDateErrors = computed(() => {
  return !!dateError.value.startDate || !!dateError.value.endDate
})

// Format amount as currency while typing
const formatAmount = () => {
  // Remove non-digit characters except decimal point
  let value = formattedAmount.value.replace(/[^\d.]/g, '')
  
  // Ensure only one decimal point
  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Convert to number and back to string with thousand separators
  const numValue = parseFloat(value) || 0
  form.value.amount = numValue
  
  // Format with thousand separators
  formattedAmount.value = numValue.toLocaleString('en-US', {
    minimumFractionDigits: parts.length > 1 ? 2 : 0,
    maximumFractionDigits: 2
  })
}

// Validate dates
const validateDates = () => {
  dateError.value = {
    startDate: '',
    endDate: ''
  }
  
  if (form.value.startDate && form.value.endDate) {
    const startDate = new Date(form.value.startDate)
    const endDate = new Date(form.value.endDate)
    
    if (startDate > endDate) {
      dateError.value.endDate = 'End date must be after start date'
      return false
    }
    
    if (endDate < startDate) {
      dateError.value.startDate = 'Start date must be before end date'
      return false
    }
  }
  
  return true
}

const formatToHTMLDate = (dateStr: string) =>
  dateStr ? new Date(dateStr).toISOString().split("T")[0] : ''

// Watch for changes in props.investment
watch(
  () => props.investment,
  (investment) => {
    if (!investment) return
    form.value = {
      description: investment?.description ?? '',
      company: investment?.company ?? '',
      amount: investment?.amount ?? 0,
      investmentRate: investment?.investmentRate ?? '',
      startDate: formatToHTMLDate(investment.startDate),
      endDate: formatToHTMLDate(investment.endDate)
    }
    
    // Update formatted amount
    formattedAmount.value = form.value.amount.toLocaleString('en-US')
  },
  { immediate: true, deep: true }
)

const closeModal = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (!validateDates()) {
    return
  }
  
  await addExternalInvestment({
    ...form.value,
    // Ensure amount is a number
    amount: parseFloat(form.value.amount.toString().replace(/,/g, ''))
  }).then((data: any) => {
    if(data.status === 201){
      closeModal()
    }
  })
}
</script>