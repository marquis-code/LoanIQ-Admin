<template>
  <main>
    <div class="flex min-h-full flex-col justify-center px-6 pt-24 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="@/assets/img/logo.png" alt="Your Company" />
        <h2 class="mt-4 text-center text-xl font-bold leading-9 tracking-tight text-gray-900">
          Please check your email
        </h2>
        <p class="text-sm text-gray-400 text-center">We have sent the code to {{ email }}</p>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form @submit.prevent="submitOTP" class="space-y-6">
          <div class="flex justify-center items-center gap-x-6">
            <input
                v-for="(digit, index) in otp"
                :key="index"
                type="text"
                maxlength="1"
                v-model="otp[index]"
                @input="moveToNext(index, $event)"
                class="w-14 h-14 text-center border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <p class="text-sm text-center text-gray-500">
            <span>Send code again</span>
            <span class="font-semibold ml-1">{{ timer }}</span>
          </p>

          <div class="pt-10">
            <button
                :disabled="loading"
                type="submit"
                class="flex w-full disabled:cursor-not-allowed disabled:opacity-25 justify-center rounded-md bg-[#2F6D67] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2F6D67] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6D67]"
            >
              {{ loading ? "Processing..." : "Submit" }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <CoreFullScreenLoader :visible="loading" text="Authenticating..." logo="/path-to-your-logo.png" />
  </main>
</template>

<script lang="ts" setup>
import { useResetPassword } from "@/composables/auth/resetPassword";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const email = "Eonn12@gmail.com"; // Replace with dynamic data as required
const otp = ref<string[]>(Array(5).fill("")); // For a 5-digit OTP
const loading = ref(false);
const timer = ref("00:34");
const router = useRouter();
const route = useRoute();
const { credential } = useResetPassword();

// Emit OTP event
const emit = defineEmits(["otp"]);

const submitOTP = async () => {
  loading.value = true;
  const otpCode = otp.value.join("");

  if (otpCode.length !== 5) {
    alert("Please enter a valid OTP!");
    loading.value = false;
    return;
  }

    const resetObj = JSON.parse(localStorage.getItem("resetObj") || "{}");
    // Update the resetObj with the OTP
    resetObj.otp = otpCode;

  // Save the updated resetObj back to localStorage
  localStorage.setItem("resetObj", JSON.stringify(resetObj));

  credential.otp.value = otpCode;

    // Emit the OTP
    emit("otp", otpCode);

    // Update the query parameter in the URL
    router.push({
      path: route.path,
      query: { ...route.query, otp: otpCode },
    });

};

const moveToNext = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.value && index < otp.value.length - 1) {
    (document.querySelectorAll("input")[index + 1] as HTMLInputElement)?.focus();
  }
};

// Timer Countdown Logic
onMounted(() => {
  let countdown = 34;
  const interval = setInterval(() => {
    if (countdown <= 0) {
      clearInterval(interval);
      timer.value = "00:00";
    } else {
      countdown -= 1;
      const minutes = Math.floor(countdown / 60)
          .toString()
          .padStart(2, "0");
      const seconds = (countdown % 60).toString().padStart(2, "0");
      timer.value = `${minutes}:${seconds}`;
    }
  }, 1000);
});
</script>

<style scoped>
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
