<template>
  <div class="flex min-h-full flex-col justify-center px-6 pt-24 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="@/assets/img/logo.png" alt="Your Company" />
      <h2 class="mt-4 text-center text-xl font-bold leading-9 tracking-tight text-gray-900">Reset password</h2>
      <p class="text-sm text-gray-400 text-center">This password should be different from the previous password.</p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="handleResetPassword" class="space-y-6">
        <div>
          <div class="flex items-center justify-between">
            <label for="new-password" class="block text-sm font-medium leading-6 text-gray-900">New Password</label>
          </div>
          <div class="mt-2 relative">
            <input
                v-model="credentialObj.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                id="new-password"
                name="new-password"
                class="w-full px-4 py-4 bg-[#F4F5F7] outline-none border-[0.5px] border-[#F4F5F7] rounded-md focus:outline-none focus:border-green-500"
            />
            <span
                @click="toggleNewPassword"
                class="absolute right-4 top-4 cursor-pointer text-gray-500"
            >
              <img  v-if="!showNewPassword" src="@/assets/icons/eyeClose.svg" alt="close" />
              <img v-if="showNewPassword" src="@/assets/icons/eyeOpen.svg" alt="open"/>
<!--              {{ showNewPassword ? 'Hide' : 'Show' }}-->
            </span>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="confirm-password" class="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
          </div>
          <div class="mt-2 relative">
            <input
                v-model="credentialObj.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirm-password"
                name="confirm-password"
                class="w-full px-4 py-4 bg-[#F4F5F7] outline-none border-[0.5px] border-[#F4F5F7] rounded-md focus:outline-none focus:border-green-500"
            />
            <span
                @click="toggleConfirmPassword"
                class="absolute right-4 top-4 cursor-pointer text-gray-500"
            >
              <img  v-if="!showConfirmPassword" src="@/assets/icons/eyeClose.svg" alt="close" />
              <img v-if="showConfirmPassword" src="@/assets/icons/eyeOpen.svg" alt="open"/>
<!--              {{ showConfirmPassword ? 'Hide' : 'Show' }}-->
            </span>
          </div>
        </div>

        <div class="pt-10">
          <button
              type="submit"
              class="flex disabled:cursor-not-allowed w-full justify-center rounded-md bg-[#2F6D67] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2F6D67] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6D67]"
          >
            {{ loading ? 'Processing...' : 'Submit' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { useResetPassword } from "@/composables/auth/resetPassword";
const { showToast } = useCustomToast();

const { credential } = useResetPassword();
const credentialObj = ref({
  newPassword: "",
  confirmPassword: "",
});
const loading = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const emit = defineEmits(["password"]);

const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const handleResetPassword = () => {
  if (credentialObj.value.newPassword !== credentialObj.value.confirmPassword) {
      showToast({
        title: "Error",
        message: "Passwords do not match!",
        toastType: "error",
        duration: 3000,
      });
    return;
  }

  const resetObj = JSON.parse(localStorage.getItem("resetObj") || "{}");

  // Update Password
  resetObj.password = credentialObj.value.newPassword
  localStorage.setItem("resetObj", JSON.stringify(resetObj));

  credential.newPassword.value = credentialObj.value.newPassword;
  emit("password", credentialObj.value.newPassword);
};
</script>
