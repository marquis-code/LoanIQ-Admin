<template>
    <div class="flex min-h-full flex-col justify-center px-6 pt-24 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img class="mx-auto h-10 w-auto" src="@/assets/img/logo.png" alt="Your Company">
          <h2 class="mt-4 text-center text-xl font-bold leading-9 tracking-tight text-gray-900">Forgot password?</h2>
          <p class="text-sm text-gray-400 text-center">No worries, we'll send you reset instructions.</p>
        </div>
      
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form @submit.prevent="forgotPassword" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <div class="mt-2">
                <input v-model="credential.email.value" placeholder="Enter your email" id="email" name="email" type="email"  class="w-full px-4 py-4  bg-[#F4F5F7] outline-none border-[0.5px] border-[#F4F5F7] rounded-md focus:outline-none focus:border-green-500">
              </div>
            </div>
      
    
            <div class="pt-10">
              <button :disabled="loading" type="submit" class="flex w-full disabled:cursor-not-allowed disabled:opacity-25 justify-center rounded-md bg-[#2F6D67] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2F6D67] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6D67]">{{ loading ? 'processing..' : 'Submit'}}</button>
            </div>
          </form>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
        import { useForgotPassword } from '@/composables/auth/forgotPassword'
        const {  credential, forgotPassword, loading } = useForgotPassword()
    const router = useRouter()
    </script>