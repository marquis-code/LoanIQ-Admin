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
                  <!-- {{ investment }} -->
                    <!-- {{ form }} -->
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Description</label>
                      <input
                        type="text"
                        v-model="form.description"
                        class="mt-1 block w-full py-2.5 px-3 py-2.5 outline-none rounded-md border border-gray-200 py-2.5 outline-none shadow-sm  sm:text-sm"
                        required
                      />
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Company</label>
                      <input
                        type="text"
                        v-model="form.company"
                        class="mt-1 block w-full py-2.5 px-3 py-2.5 outline-none rounded-md border border-gray-200 shadow-sm  sm:text-sm"
                        required
                      />
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Amount</label>
                      <input
                        type="number"
                        v-model="form.amount"
                        class="mt-1 block w-full py-2.5 px-3 py-2.5 outline-none rounded-md border border-gray-200 shadow-sm  sm:text-sm"
                        required
                      />
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Investment Rate (%)</label>
                      <input
                        type="text"
                        v-model="form.investmentRate"
                        class="mt-1 block w-full py-2.5 px-3 py-2.5 outline-none rounded-md border border-gray-200 shadow-sm  sm:text-sm"
                        required
                      />
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="date"
                        v-model="form.startDate"
                        class="mt-1 block w-full py-2.5 px-3 py-2.5 outline-none rounded-md border border-gray-200 shadow-sm  sm:text-sm"
                        required
                      />
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="date"
                        v-model="form.endDate"
                        class="mt-1 block w-full py-2.5 px-3 py-2.5 outline-none rounded-md border border-gray-200 shadow-sm  sm:text-sm"
                        required
                      />
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
                      class="inline-flex justify-center rounded-md border border-transparent bg-[#2F6D67] px-4 py-2 text-sm font-medium text-white"
                    >
                      {{ submitButtonText }}
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
  import { ref, computed } from 'vue'
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
  import type { ExternalInvestment } from '~/types'
  
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
  const submitButtonText = computed(() => props.mode === 'add' ? 'Create Investment' : 'Update Investment')
  
  const form = ref({
    description: props.investment?.description ?? '',
    company: props.investment?.company ?? '',
    amount: props.investment?.amount ?? 0,
    investmentRate: props.investment?.investmentRate ?? '',
    startDate: props.investment?.startDate ?? '',
    endDate: props.investment?.endDate ?? ''
  })
  
  const closeModal = () => {
    emit('close')
  }
  const formatToHTMLDate = (dateStr: string) =>
  new Date(dateStr).toISOString().split("T")[0];

watch(
  () => props.investment,
  (investment) => {
    if (!investment) return;
    const { startDate, endDate, ...rest } = investment;
    form.value = {
      // ...rest,
      description: investment?.description ?? '',
      company: investment?.company ?? '',
      amount: investment?.amount ?? 0,
      investmentRate: investment?.investmentRate ?? '',
      startDate: formatToHTMLDate(startDate),
      endDate: formatToHTMLDate(endDate)
    };
  },
  { immediate: true, deep: true }
);

  
  const handleSubmit = () => {
    emit('submit', {
      ...form.value,
      id: props.investment?.id
    })
    closeModal()
  }
  </script>