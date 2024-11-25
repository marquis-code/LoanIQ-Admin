<template>
    <div class="flex min-h-full flex-col justify-center px-6 pt-24 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img class="mx-auto h-10 w-auto" src="@/assets/img/logo.png" alt="Your Company">
          <h2 class="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
        </div>
      
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form @submit.prevent="changeDefaultPassword" class="space-y-6">
      
            <div>
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
              </div>
              <div class="mt-2">
                <input v-model="credential.oldPassword.value" id="old-password" name="old-password" type="password" class="w-full px-4 py-4  bg-[#F4F5F7] outline-none border-[0.5px] border-[#F4F5F7] rounded-md focus:outline-none focus:border-green-500">
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                <!-- <div class="text-sm">
                  <NuxtLink to="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</NuxtLink>
                </div> -->
              </div>
              <div class="mt-2">
                <input v-model="credential.newPassword.value"  id="new-password" name="new-password" type="password"  class="w-full px-4 py-4  bg-[#F4F5F7] outline-none border-[0.5px] border-[#F4F5F7] rounded-md focus:outline-none focus:border-green-500">
              </div>
            </div>
      
            <div class="pt-10">
              <button type="submit" class="flex w-full justify-center rounded-md bg-[#2F6D67] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2F6D67] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6D67]">Sign in</button>
            </div>
          </form>
    
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    import { useChangeDefaultPassword } from '@/composables/auth/useChangeDefaultPassword'
    const { credential, changeDefaultPassword, loading } = useChangeDefaultPassword()
    const router = useRouter()
    const handleSubmit = () => {
      router.push('/dashboard')
    }
    </script>