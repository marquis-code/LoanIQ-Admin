<template>
<main>
  <div class="flex min-h-full flex-col justify-center px-6 pt-24 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="@/assets/img/logo.png" alt="Your Company">
      <h2 class="mt-4 text-center text-xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
    </div>
  
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
          <div class="mt-2">
            <input v-model="credential.email.value" id="email" name="email" type="email" autocomplete="email" required class="w-full px-4 py-4  bg-[#F4F5F7] outline-none border-[0.5px] border-[#F4F5F7] rounded-md focus:outline-none focus:border-green-500">
          </div>
        </div>
  
        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div class="text-sm">
              <NuxtLink to="/forgot-password" class="font-semibold text-[#2F6D67] hover:text-[#2F6D67]">Forgot password?</NuxtLink>
            </div>
          </div>
          <div class="mt-2 relative">
            <input v-model="credential.passcode.value" :type="showPassword ? 'text' : 'password'"
            id="password" class="w-full px-4 py-4  bg-[#F4F5F7] outline-none border-[0.5px] border-[#F4F5F7] rounded-md focus:outline-none focus:border-green-500">
            <div
            @click="toggleShowPassword"
            class="absolute inset-y-0 right-4 top-1 flex items-center cursor-pointer"
          >
            <svg
              v-if="!showPassword"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.3332 6.66669C18.3332 6.66669 14.9998 11.6667 9.99984 11.6667C4.99984 11.6667 1.6665 6.66669 1.6665 6.66669"
                stroke="#1D2739"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M12.5 11.25L13.75 13.3333"
                stroke="#1D2739"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16.6665 9.16669L18.3332 10.8334"
                stroke="#1D2739"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1.6665 10.8334L3.33317 9.16669"
                stroke="#1D2739"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.5 11.25L6.25 13.3333"
                stroke="#1D2739"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
  
            <svg
              v-if="showPassword"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.9532 9.20419C18.2065 9.55944 18.3332 9.7371 18.3332 10C18.3332 10.2629 18.2065 10.4406 17.9532 10.7959C16.8148 12.3922 13.9075 15.8334 9.99984 15.8334C6.09215 15.8334 3.18492 12.3922 2.04654 10.7959C1.79318 10.4406 1.6665 10.2629 1.6665 10C1.6665 9.7371 1.79318 9.55944 2.04654 9.20419C3.18492 7.60789 6.09215 4.16669 9.99984 4.16669C13.9075 4.16669 16.8148 7.60789 17.9532 9.20419Z"
                stroke="#1D2739"
                stroke-width="2"
              />
              <path
                d="M12.5 10C12.5 8.61925 11.3807 7.5 10 7.5C8.61925 7.5 7.5 8.61925 7.5 10C7.5 11.3807 8.61925 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10Z"
                stroke="#1D2739"
                stroke-width="1.5"
              />
            </svg>
          </div>
          </div>
        </div>
  
        <div class="pt-10">
          <button :disabled="loading" type="submit" class="flex disabled:cursor-not-allowed disabled:opacity-25 w-full justify-center rounded-md bg-[#2F6D67] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2F6D67] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6D67]">{{ loading ? 'processing...' : 'Sign In' }}</button>
        </div>
      </form>
  
      <!-- <p class="mt-10 text-center text-sm text-gray-500">
        Not a member?
        <NuxtLink to="#" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sl</NuxtLink>
      </p> -->
    </div>
  </div>
  <CoreFullScreenLoader
      :visible="loading"
      text="Authenticating..."
      logo="/path-to-your-logo.png"
    />
</main>
</template>

<script setup lang="ts">
import { useLogin } from '@/composables/auth/login'
const { credential, login, loading, isFormDisabled } = useLogin()

const showPassword = ref(false);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

definePageMeta({
  middleware: 'auth'
})

</script>