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
            <input v-model="credential.email.value" id="email" name="email" type="email" autocomplete="email" required class="w-full border px-4 py-3  bg-[#F4F5F7] outline-none  rounded-md focus:outline-none focus:border-green-500">
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
            id="password" class="w-full px-4 py-3  bg-[#F4F5F7] outline-none  rounded-md border focus:outline-none focus:border-green-500">
            <div
            @click="toggleShowPassword"
            class="absolute inset-y-0 right-4 top-1 flex items-center cursor-pointer"
          >
              <img  v-if="!showPassword" src="@/assets/icons/eyeClose.svg" alt="close" />
              <img v-if="showPassword" src="@/assets/icons/eyeOpen.svg" alt="open"/>
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