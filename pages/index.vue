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
<!-- 
<template>
  <main>
    <div class="flex flex-col items-center justify-center w-full h-screen">
      <div class="lg:w-[500px] p-4 flex flex-col justify-start items-start">
        <div class="flex justify-start items-start">
          <img src="@/assets/img/logo.png" alt="LoaniQ Logo" class="mx-auto mb-4 w-24" />
        </div>
        <h2 class="text-3xl font-medium text-[#323740] text-center mb-2">Welcome back</h2>
        <p class="text-[#687181] leading-relaxed pb-4">
          Please fill in your information below to access your account.
        </p>
        
        <div v-if="failedAttempts > 0 && failedAttempts < maxAttempts" 
             class="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm animate-fadeIn">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>Login failed. You have {{ maxAttempts - failedAttempts }} attempts remaining.</span>
          </div>
        </div>
        
        <form class="w-full space-y-6" @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="block text-[#7D8799] font-medium mb-1 text-sm" for="email">Enter Your Email Address</label>
            <input 
              type="text" 
              id="email" 
              v-model="credential.email.value" 
              class="w-full px-4 py-4 bg-[#F4F5F7] outline-none border-[0.5px] border-[#F4F5F7] rounded-md focus:outline-none focus:border-green-500" 
              :disabled="isAccountBlocked"
            />
          </div>
          <div class="mb-4 relative">
            <div class="flex items-center justify-between">
              <label class="block text-[#7D8799] font-medium mb-1 text-sm" for="passcode">Enter Your six-digit passcode</label>
              <div class="text-sm">
                <NuxtLink to="/recover-password" class="font-semibold text-[#2F6D67] hover:text-[#2F6D67]">Forgot password?</NuxtLink>
              </div>
            </div>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="passcode" 
              v-model="credential.passcode.value" 
              class="w-full px-4 py-4 bg-[#F4F5F7] outline-none border-[0.5px] border-[#F4F5F7] rounded-md focus:outline-none focus:border-green-500" 
              :disabled="isAccountBlocked"
            />
            <div
              @click="toggleShowPassword"
              class="absolute inset-y-0 right-4 top-6 flex items-center cursor-pointer"
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
          <div class="pt-6">
            <button 
              :disabled="loading || isFormDisabled || isAccountBlocked" 
              type="submit" 
              class="w-full bg-[#2F6D67] text-white py-3.5 disabled:cursor-not-allowed disabled:opacity-25 rounded-md hover:bg-[#2F6D67] transition"
            >
              {{ loading ? 'Processing...' : isAccountBlocked ? 'Account Blocked' : 'Login' }}
            </button>
          </div>
        </form>
        <div class="text-center mt-4">
          <p class="text-[#687181] flex gap-x-2">
            Don't have an account? 
            <NuxtLink to="/signup" class="text-[#2F6D67] hover:underline">Sign up here</NuxtLink> 
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 4.86165L13.3333 10.695L7.5 16.5283" stroke="#2F6D67" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </p>
        </div>
      </div>
    </div>
    
    <Transition name="modal">
      <div v-if="showBlockedModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out" 
             :class="showBlockedModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
          <div class="p-6">
            <div class="flex justify-center mb-4">
              <div class="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <line x1="8" y1="11" x2="16" y2="11"></line>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-bold text-center text-gray-900 mb-2">Account Blocked</h3>
            <p class="text-gray-600 text-center mb-6">
              Your account has been temporarily blocked due to multiple failed login attempts. 
              Please contact support to regain access to your account.
            </p>
            <div class="flex justify-center">
              <button 
                @click="showSupportForm = true; showBlockedModal = false" 
                class="px-6 py-3 bg-[#2F6D67] text-white rounded-md hover:bg-[#265854] transition-colors duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    

    <Transition name="modal">
      <div v-if="showSupportForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-500 ease-in-out" 
             :class="showSupportForm ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-gray-900">Request Account Unblock</h3>
              <button @click="showSupportForm = false" class="text-gray-400 hover:text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form @submit.prevent="submitSupportRequest" class="space-y-4">
              <div class="space-y-2">
                <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="supportForm.name" 
                  class="w-full px-4 py-3 bg-[#F4F5F7] border-[0.5px] border-[#F4F5F7] rounded-md focus:outline-none focus:border-[#2F6D67]" 
                  required
                />
              </div>
              
              <div class="space-y-2">
                <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="supportForm.email" 
                  class="w-full px-4 py-3 bg-[#F4F5F7] border-[0.5px] border-[#F4F5F7] rounded-md focus:outline-none focus:border-[#2F6D67]" 
                  required
                />
              </div>
              
              <div class="space-y-2">
                <label for="reason" class="block text-sm font-medium text-gray-700">Reason for Unblock</label>
                <select 
                  id="reason" 
                  v-model="supportForm.reason" 
                  class="w-full px-4 py-3 bg-[#F4F5F7] border-[0.5px] border-[#F4F5F7] rounded-md focus:outline-none focus:border-[#2F6D67]" 
                  required
                >
                  <option value="" disabled>Select a reason</option>
                  <option value="forgot_password">Forgot Password</option>
                  <option value="account_hacked">Account Was Hacked</option>
                  <option value="mistake">Made a Mistake</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div class="space-y-2">
                <label for="message" class="block text-sm font-medium text-gray-700">Additional Information</label>
                <textarea 
                  id="message" 
                  v-model="supportForm.message" 
                  rows="4" 
                  class="w-full px-4 py-3 bg-[#F4F5F7] border-[0.5px] border-[#F4F5F7] rounded-md focus:outline-none focus:border-[#2F6D67]" 
                  required
                  placeholder="Please provide details about your situation..."
                ></textarea>
              </div>
              
              <div class="pt-4">
                <button 
                  type="submit" 
                  class="w-full bg-[#2F6D67] text-white py-3.5 rounded-md hover:bg-[#265854] transition-colors duration-300 flex items-center justify-center"
                  :disabled="supportFormSubmitting"
                >
                  <svg v-if="supportFormSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ supportFormSubmitting ? 'Submitting...' : 'Submit Request' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
    

    <Transition name="modal">
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out" 
             :class="showSuccessModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
          <div class="p-6">
            <div class="flex justify-center mb-4">
              <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-bold text-center text-gray-900 mb-2">Request Submitted</h3>
            <p class="text-gray-600 text-center mb-6">
              Your account unblock request has been submitted successfully. Our support team will review your request and get back to you within 24 hours.
            </p>
            <div class="flex justify-center">
              <button 
                @click="resetAll" 
                class="px-6 py-3 bg-[#2F6D67] text-white rounded-md hover:bg-[#265854] transition-colors duration-300"
              >
                Return to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    
    <CoreFullScreenLoader
      :visible="loading"
      text="Authenticating..."
      logo="/path-to-your-logo.png"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
// import { use_auth_login } from '@/composables/auth/login'
import { useLogin } from '@/composables/auth/login'
const { credential, login, loading, isFormDisabled } = useLogin()
// const { credential, login, loading, isFormDisabled } = use_auth_login()

// Password visibility toggle
const showPassword = ref(false)
const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

// Login attempt tracking
const maxAttempts = 5
const failedAttempts = ref(0)
const isAccountBlocked = computed(() => failedAttempts.value >= maxAttempts)
const showBlockedModal = ref(false)
const showSupportForm = ref(false)
const showSuccessModal = ref(false)
const supportFormSubmitting = ref(false)

// Support form data
const supportForm = ref({
  name: '',
  email: '',
  reason: '',
  message: ''
})

// Handle login with attempt tracking
const handleLogin = async () => {
  if (isAccountBlocked.value) {
    showBlockedModal.value = true
    return
  }
  
  try {
    await login()
    // If login is successful, reset failed attempts
    failedAttempts.value = 0
  } catch (error) {
    // Increment failed attempts on login failure
    failedAttempts.value++
    
    // Show blocked modal if max attempts reached
    if (isAccountBlocked.value) {
      setTimeout(() => {
        showBlockedModal.value = true
      }, 500)
    }
  }
}

// Submit support request
const submitSupportRequest = async () => {
  supportFormSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Show success modal
    showSupportForm.value = false
    showSuccessModal.value = true
    
    // Reset support form
    supportForm.value = {
      name: '',
      email: '',
      reason: '',
      message: ''
    }
  } catch (error) {
    console.error('Error submitting support request:', error)
  } finally {
    supportFormSubmitting.value = false
  }
}

// Reset all states
const resetAll = () => {
  showSuccessModal.value = false
  showSupportForm.value = false
  showBlockedModal.value = false
  // Note: We don't reset failedAttempts here to keep the account blocked
}

// Persist failed attempts in localStorage
onMounted(() => {
  const storedAttempts = localStorage.getItem('failedLoginAttempts')
  if (storedAttempts) {
    failedAttempts.value = parseInt(storedAttempts)
    
    // Show blocked modal if account is already blocked
    if (isAccountBlocked.value) {
      showBlockedModal.value = true
    }
  }
})

// Update localStorage when attempts change
watch(failedAttempts, (newValue) => {
  localStorage.setItem('failedLoginAttempts', newValue.toString())
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style> -->