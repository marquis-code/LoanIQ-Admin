<template>
 <main>
   <ModulesAuthVerify @otp="handleOtp" v-if="activeStep === 'verify'" />
   <ModulesAuthReset v-if="activeStep === 'reset'" @password="handlePassword" />
   <CoreFullScreenLoader
      :visible="loading"
      text="Authenticating..."
      logo="/path-to-your-logo.png"
   />
 </main>
    </template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useResetPassword } from "@/composables/auth/resetPassword";

const { credential, resetPassword, setPayload, loading } = useResetPassword();
const router = useRouter();
const route = useRoute();

const payloadObj = ref({
  password: "",
  otp: "",
});

const activeStep = ref(route.query.step || "verify");

// Function to update query parameter whenever `activeStep` changes
const updateQuery = () => {
  router.push({
    path: route.path,
    query: { ...route.query, step: activeStep.value },
  });
};

// Sync `activeStep` to query parameter on mount
onMounted(() => {
  if (!route.query.step) {
    updateQuery(); // Initialize the query if `step` is not in the query
  }
});

// Watch for changes in `activeStep` and update the query
watch(activeStep, () => {
  updateQuery();
});

// Handle OTP action
const handleOtp = (otp: string) => {
  payloadObj.value.otp = otp;
  activeStep.value = "reset";
  updateQuery();
};

// Handle Password action
const handlePassword = async (password: string) => {
  payloadObj.value.password = password;
  const resetObj = JSON.parse(localStorage.getItem("resetObj") || "{}");
  setPayload(resetObj)
  await resetPassword();
};
</script>
