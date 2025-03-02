<template>
<main>
    <div v-if="!loading" class="grid gap-6 md:grid-cols-2">
            <div class="space-y-4">
              <h3 class="text-lg font-medium">Personal Information</h3>
              <div class="grid gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">Email</label>
                  <p class="mt-1">{{ user?.email }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Phone</label>
                  <p class="mt-1">{{ user?.phoneNumber }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Date Joined</label>
                  <p class="mt-1">
                    {{ new Date(user?.createdAt).toLocaleDateString() }}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-lg font-medium">Account Actions</h3>
              <div class="flex flex-wrap gap-3">
                <button @click="showFlagModal = true"
                  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                  <Flag class="mr-2 h-4 w-4" />
                  {{ user?.flagStatus ? "Remove Flag" : "Flag User" }}
                </button>
                <button @click="showBlockModal = true"
                  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                  <Ban class="mr-2 h-4 w-4" />
                  {{ user?.blockStatus ? "Unblock User" : "Block User" }}
                </button>
                <button @click="showGenerateAccountNumberModal = true"
                  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                  <Ban class="mr-2 h-4 w-4" />
                  Generate Account Number
                </button>
              </div>
            </div>
          </div>
          <CoreLoader v-else class="mt-6" />



    <!-- Flag Modal -->
    <TransitionRoot appear :show="showFlagModal" as="template">
      <Dialog as="div" @close="showFlagModal = false" class="relative z-50">
        <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/80" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-[90%] sm:w-[85%] md:w-[80%] mx-auto lg:w-[500px] max-w-[5200px] rounded-lg bg-white p-6">
                <DialogTitle class="text-lg font-medium">
                  {{ user?.flagStatus ? "Remove Flag" : "Flag User" }}
                </DialogTitle>
                <div class="mt-4">
                  <textarea v-model="flagComment" rows="4"
                    class="w-full rounded-md p-3 outline-none border-[0.5px] border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    :placeholder="user?.flagStatus
                        ? 'Reason for removing flag...'
                        : 'Reason for flagging user...'
                      "></textarea>
                </div>
                <div class="mt-6 flex justify-end gap-3">
                  <button @click="showFlagModal = false"
                    class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button @click="handleFlag" :disabled="unflagging || flagging"
                    class="rounded-md disabled:cursor-not-allowed disabled:opacity-25 bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                    <span v-if="user.flagStatus">{{ unflagging ? 'processing...' : 'Confirm' }}</span>
                    <span v-else-if="!user.flagStatus">{{ flagging ? 'processing...' : 'Confirm' }}</span>
                    <span v-else>Confirm</span>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Block Modal -->
    <TransitionRoot appear :show="showBlockModal" as="template">
      <Dialog as="div" @close="showBlockModal = false" class="relative z-50">
        <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/80" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-[90%] sm:w-[85%] md:w-[80%] mx-auto lg:w-[500px] max-w-[5200px] rounded-lg bg-white p-6">
                <DialogTitle class="text-lg font-medium">
                  {{ user?.blockStatus ? "Unblock User" : "Block User" }}
                </DialogTitle>
                <div class="mt-4">
                  <textarea v-model="blockComment" rows="4"
                    class="w-full rounded-md p-3 outline-none border-[0.5px] border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    :placeholder="user?.blockStatus
                        ? 'Reason for unblocking user...'
                        : 'Reason for blocking user...'
                      "></textarea>
                </div>
                <div class="mt-6 flex justify-end gap-3">
                  <button @click="showBlockModal = false"
                    class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <!-- <button
                    @click="handleBlock"
                    class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    Confirm
                  </button> -->
                  <button @click="handleBlock" :disabled="unblocking || blocking"
                    class="rounded-md disabled:cursor-not-allowed disabled:opacity-25 bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                    <span v-if="user.blockStatus">{{ unblocking ? 'processing...' : 'Confirm' }}</span>
                    <span v-else-if="!user.blockStatus">{{ blocking ? 'processing...' : 'Confirm' }}</span>
                    <span v-else>Confirm</span>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Generate Account Number Modal -->
    <TransitionRoot appear :show="showGenerateAccountNumberModal" as="template">
      <Dialog as="div" @close="showGenerateAccountNumberModal = false" class="relative z-50">
        <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/80" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-[90%] sm:w-[85%] md:w-[80%] mx-auto lg:w-[500px] max-w-[5200px] rounded-lg bg-white p-6">
                <DialogTitle class="text-lg font-medium">
                  Generate Account Number
                </DialogTitle>

                <p class="font-medium pt-5">Are you sure you want to generate accoiunt number for {{ user?.firstName }}
                  {{ user?.lastName }} ?</p>

                <div class="mt-16">
                  <button @click="proceedToGenerateAccountNumber" :disabled="generating"
                    class="bg-[#2F6D67] disabled:opacity-25 disabled:cursor-not-allowed text-white px-4 py-3.5 w-full rounded-md">
                    {{ generating ? "processing..." : 'Continue' }}
                  </button>
                </div>
                <!-- <div class="mt-4">
                      <textarea
                        v-model="blockComment"
                        rows="4"
                        class="w-full rounded-md p-3 outline-none border-[0.5px] border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        :placeholder="
                          user?.blockStatus
                            ? 'Reason for unblocking user...'
                            : 'Reason for blocking user...'
                        "
                      ></textarea>
                    </div>
                    <div class="mt-6 flex justify-end gap-3">
                      <button
                        @click="showBlockModal = false"
                        class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        @click="handleBlock"
                        :disabled="unblocking || blocking"
                        class="rounded-md disabled:cursor-not-allowed disabled:opacity-25 bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                      >
                      <span v-if="user.blockStatus">{{ unblocking ? 'processing...' : 'Confirm' }}</span>
                      <span v-else-if="!user.blockStatus">{{ blocking ? 'processing...' : 'Confirm' }}</span>
                      <span v-else>Confirm</span>
                      </button>
                    </div> -->
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- OTP Modal Modal -->
    <TransitionRoot appear :show="openConfirmAccountNumberOTPModal" as="template">
      <Dialog as="div" @close="openConfirmAccountNumberOTPModal = false" class="relative z-50">
        <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black/80" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-[90%] sm:w-[85%] md:w-[80%] mx-auto lg:w-[500px] max-w-[5200px] rounded-lg bg-white p-6">
                <!-- <DialogTitle class="text-lg font-medium">
                    Generate Account Number
                    </DialogTitle> -->

                <CoreOtpInput title="Verify Your Email"
                  :description="`We have sent a verification code to ${user?.email}`" :otpBoxes="6" :loader="processing"
                  :timerDuration="240" :onTimerExpire="handleTimerExpire" @otp="handleOtp" @clear="handleClear" />

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
</main>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  User,
  Flag,
  Ban,
  MapPin,
  Monitor,
  LogIn,
  CreditCard,
  RefreshCw
} from "lucide-vue-next";

import { useGetUserDetails } from "@/composables/modules/users/useGetUserDetails";
import { useUnflagUserAccount } from "@/composables/modules/users/useUnflagUserAccount";
import { useFlagUserAccount } from "@/composables/modules/users/useFlagUserAccount";
import { useUnblockUser } from "@/composables/modules/users/useUnblockUser";
import { useBlockUser } from "@/composables/modules/users/useBlockUser";
import { useSubmitAccountNumberRequest } from '@/composables/modules/users/useSubmitAccountNumberRequest'
import { useGenerateAccountNumber } from '@/composables/modules/users/useGenerateAccountNumber'
import { useCustomToast } from "@/composables/core/useCustomToast";

const { user, loading } = useGetUserDetails();
const { unblockUser, loading: unblocking } = useUnblockUser();
const { flagUserAccount, loading: flagging } = useFlagUserAccount();
const { unflagUserAccount, loading: unflagging } = useUnflagUserAccount();
const { blockUser, loading: blocking } = useBlockUser();
const { showToast } = useCustomToast();
const { generateAccountNumber, loading: generating } = useGenerateAccountNumber()
const { submitAccountNumberRequest, loading: processing, setPayload } = useSubmitAccountNumberRequest()


const activeTab = ref("details");
const showFlagModal = ref(false);
const showBlockModal = ref(false);
const showGenerateAccountNumberModal = ref(false)
const openConfirmAccountNumberOTPModal = ref(false)
const isGenerateAccount = ref(false)
const flagComment = ref("");
const blockComment = ref("");
const otpComponent = ref();

const proceedToGenerateAccountNumber = async () => {
  if (user.value) {
    const response = await generateAccountNumber(user?.value?.id)
    console.log(response, ';res hee')
    if (response && response === 'success') {
      isGenerateAccount.value = false
      showGenerateAccountNumberModal.value = false
      openConfirmAccountNumberOTPModal.value = true
    }
  }
}


const handleOtp = async (otpCode: string) => {
  const payload = {
    otp: otpCode
  }
  setPayload(payload)
  await submitAccountNumberRequest().then(() => {
    openConfirmAccountNumberOTPModal.value = false
    generating.value = false

  })
};

const handleClear = () => {
  otpComponent.value.clearOtp(); // Call the `clearOtp` method in the child component
};

const handleTimerExpire = async () => {
  handleClear()
  await proceedToGenerateAccountNumber()
  showToast({
    title: "Error",
    message: "The OTP has expired, a new OTP has been sent successfully..",
    toastType: "error",
    duration: 3000,
  });
};

// Methods
const handleFlag = async () => {
  try {
    if (user?.value.flagStatus) {
      await unflagUserAccount(user.value.id);
    } else {
      await flagUserAccount(user.value.id);
    }
  } catch (error) {
    console.error("Error handling flag action:", error);
  } finally {
    showFlagModal.value = false;
    flagComment.value = "";
  }
};

const handleBlock = async () => {
  try {
    if (user.value.blockStatus) {
      await unblockUser(user.value.id);
    } else {
      await blockUser(user.value.id);
    }
  } catch (error) {
    console.error("Error handling block action:", error);
  } finally {
    showBlockModal.value = false;
    blockComment.value = "";
  }
};

const reviewDocument = (document: any) => {
  // Handle document review logic
  console.log("Reviewing document:", document);
};
</script>