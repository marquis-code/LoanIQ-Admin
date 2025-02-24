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
                  {{ title }}
                </DialogTitle>
                
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ message }}
                  </p>
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
                    type="button"
                    :class="[
                      'inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white',
                      actionType === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
                    ]"
                    @click="confirm"
                  >
                    {{ confirmText }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
  <script setup lang="ts">
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
  
  defineProps<{
    isOpen: boolean
    title: string
    message: string
    confirmText: string
    actionType?: 'danger' | 'primary'
  }>()
  
  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'confirm'): void
  }>()
  
  const closeModal = () => {
    emit('close')
  }
  
  const confirm = () => {
    emit('confirm')
  }
  </script>