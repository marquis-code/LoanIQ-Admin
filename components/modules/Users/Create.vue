<template>
    <!-- <div class="flex items-center justify-center bg-gray-100"> -->
      <!-- <div class="bg-white w-full max-w-md"> -->
       <!-- <div class="flex justify-center items-center flex-col pb-6">
         <h1 class="text-xl font-semibold text-gray-800 text-center">Create User</h1>
         <p class="text-sm text-gray-400 text-center -mt-3">Fill in the information below to create a user</p>
       </div> -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
            <input
              id="email"
              v-model="payload.email"
              type="email"
              placeholder="Enter email"
              class="input-field"
            />
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
          </div>
  
          <!-- BVN Field -->
          <div>
            <label for="bvn" class="block text-sm font-medium text-gray-700">BVN:</label>
            <input
              id="bvn"
              v-model="payload.bvn"
              type="text"
              placeholder="Enter BVN"
              maxlength="11"
              class="input-field"
            />
            <p v-if="errors.bvn" class="text-red-500 text-sm mt-1">{{ errors.bvn }}</p>
          </div>
  
          <!-- Submit Button -->
          <div class="pt-6">
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-[#2F6D67] text-white disabled:cursor-not-allowed disabled:opacity-25 font-medium py-3.5 text-sm px-4 rounded-lg shadow-md "
            >
              {{  loading ? 'processing..' : 'Submit' }}
            </button>
          </div>
        </form>
      <!-- </div> -->
    <!-- </div> -->
  </template>
  
  <script setup>
  import { useCreateUser } from '@/composables/modules/users/useCreateUser'
  const { setPayload, createUser, loading }  = useCreateUser()
  import { ref } from "vue";
  
  const payload = ref({
    email: "",
    bvn: "",
  });
  
  const errors = ref({
    email: null,
    bvn: null,
  });
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validateForm = () => {
    let isValid = true;
    errors.value.email = null;
    errors.value.bvn = null;
  
    // Validate email
    if (!payload.value.email) {
      errors.value.email = "Email is required.";
      isValid = false;
    } else if (!validateEmail(payload.value.email)) {
      errors.value.email = "Invalid email format.";
      isValid = false;
    }
  
    // Validate BVN
    if (!payload.value.bvn) {
      errors.value.bvn = "BVN is required.";
      isValid = false;
    } else if (!/^\d{11}$/.test(payload.value.bvn)) {
      errors.value.bvn = "BVN must be 11 digits.";
      isValid = false;
    }
  
    return isValid;
  };

  const emit = defineEmits(['success'])
  
  const handleSubmit = async () => {
    if (validateForm()) {
        setPayload(payload.value)
        await createUser()
        emit('success')
        payload.value = { email: "", bvn: "" }; 
    }
  };
  </script>
  
  <style>
  /* Add any custom styles if needed */
  </style>
  