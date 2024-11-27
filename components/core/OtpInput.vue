<template>
  <main>
    <div class="flex min-h-full flex-col justify-center">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="@/assets/img/logo.png" alt="Your Company" />
        <h2 class="mt-4 text-center text-xl font-bold leading-9 tracking-tight text-gray-900">{{ title }}</h2>
        <p class="text-sm text-gray-400 text-center">{{ description }}</p>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form @submit.prevent="submitOTP" class="space-y-6">
          <div class="flex justify-center items-center gap-x-2">
            <input
                v-for="(digit, index) in otp"
                :key="index"
                type="text"
                maxlength="1"
                v-model="otp[index]"
                @input="moveToNext(index)"
                ref="otpInputs"
                class="w-14 h-14 text-center border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <p class="text-sm text-center text-gray-500">
            <span>Send code again</span>
            <span class="font-semibold ml-1">{{ timer }}</span>
          </p>

          <div class="pt-10">
            <button
                :disabled="loader || !isOtpComplete"
                type="submit"
                class="flex w-full disabled:cursor-not-allowed disabled:opacity-25 justify-center rounded-md bg-[#2F6D67] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#2F6D67] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6D67]"
            >
              {{ loader ? 'Processing...' : 'Submit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <CoreFullScreenLoader :visible="loader" text="Authenticating..." logo="/path-to-your-logo.png" />
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, nextTick } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  otpBoxes: {
    type: Number,
    default: 5,
  },
  loader: {
    type: Boolean,
    default: false,
  },
  onTimerExpire: {
    type: Function,
    default: () => {},
  },
  timerDuration: {
    type: Number,
    default: 4 * 60, // Default 4 minutes in seconds
  },
});

const emit = defineEmits(["otp", "clear"]);

// State
const otp = ref<string[]>(Array(props.otpBoxes).fill(""));
const timer = ref("");
const otpInputs = ref<HTMLInputElement[]>([]); // Ref for all OTP inputs

// Computed property to check if all OTP boxes are filled
const isOtpComplete = computed(() => otp.value.every((digit) => digit.trim() !== ""));

// Submit OTP
const submitOTP = () => {
  const otpCode = otp.value.join("");
  emit("otp", otpCode);
};

// Clear OTP fields
const clearOtp = () => {
  otp.value = Array(props.otpBoxes).fill("");
  emit("clear");
  nextTick(() => {
    otpInputs.value[0]?.focus(); // Focus back to the first input
  });
};

// Move to the next input box
const moveToNext = (index: number) => {
  if (otp.value[index] && index < otpInputs.value.length - 1) {
    nextTick(() => {
      otpInputs.value[index + 1]?.focus();
    });
  }
};

// Timer Countdown Logic
onMounted(() => {
  let countdown = props.timerDuration;
  const interval = setInterval(() => {
    if (countdown <= 0) {
      clearInterval(interval);
      timer.value = "00:00";
      props.onTimerExpire(); // Call the timer expiration function
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
