<template>
  <div class="px-4 sm:px-6 lg:px-8 mt-6">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">
          Users
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all the users including their name, title,
          email and role.
        </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button @click="openAddUserModal = true" class="text-sm text-white bg-black rounded-md py-2.5 px-5">Add User</button>
      </div>
    </div>
    <div v-if="users.length && !loading" class="">
      <div class="mt-8 flow-root">
        <div class="-my-2 overflow-x-auto">
          <div class="inline-block min-w-full w-full py-2 align-middle border-[0.5px] rounded-lg">
            <table class="min-w-full w-full divide-y divide-gray-300">
              <thead class="">
                <tr class="">
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Blocked</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Flagged</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Account Type</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr class="pl-6" v-for="(user, index) in users"
                :key="index">
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center">
                      <div class="h-11 w-11 shrink-0">
                        <img v-if="!user.avatar" class="h-11 w-11 rounded-full"
                          src="@/assets/icons/avatar.svg"
                          alt="">
                          <img v-else class="h-11 w-11 rounded-full"
                          :src="user.avatar"
                          alt="">
                      </div>
                      <div class="ml-4">
                        <div class="font-medium text-gray-900">{{ `${user?.firstName} ${user?.lastName}` || 'Nil' }}</div>
                        <div class="mt-1 text-gray-500">{{ user?.email || 'Nil' }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div class="text-gray-900">{{ user.phoneNumber ?? 'Nil' }}</div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <span
                      class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ user?.blockStatus }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <span
                      class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{{ user?.flagStatus }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{{ user.accountType ?? 'Nil' }}</td>
                  <td
                  class="py-4 px-5 relative whitespace-nowrap text-sm text-[#667185]"
                >
                  <button
                    @click="toggleDropdown(index)"
                    class="inline-flex items-center text-sm font-medium text-[#667185] hover:text-black"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.99609 10H10.0036"
                        stroke="#292929"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15 10H15.0075"
                        stroke="#1D2739"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M5 10H5.00748"
                        stroke="#1D2739"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <div
                    v-if="activeDropdown === index"
                    class="absolute -top-2 right-10 z-50 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg"
                  >
                    <ul
                      class="py-1 text-sm text-gray-700 divide divide-y-[0.5px]"
                    >
                      <li>
                        <a
                            @click="selectOption('view', user)"
                            href="#"
                            class="block flex items-center gap-x-2 px-4 py-3 hover:bg-gray-100 text-start"
                        >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#4a4a4a"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                          >
                            <path
                                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            ></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          View
                        </a>
                      </li>
                      <li>
                        <a
                            @click="selectOption('flag-status-update', user)"
                            href="#"
                            class="block flex items-center gap-x-2 px-4 py-3 hover:bg-gray-100 text-start"
                        >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#4a4a4a"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          {{user.flagStatus ? 'Un-Flag' : 'Flag'}}
                        </a>
                      </li>
<!--                      <li>-->
<!--                        <a-->
<!--                            @click="selectOption('request', user)"-->
<!--                            href="#"-->
<!--                            class="block flex items-center gap-x-2 px-4 py-3 hover:bg-gray-100 text-start"-->
<!--                        >-->
<!--                        <svg-->
<!--                            xmlns="http://www.w3.org/2000/svg"-->
<!--                            width="22"-->
<!--                            height="22"-->
<!--                            viewBox="0 0 24 24"-->
<!--                            fill="none"-->
<!--                            stroke="#4a4a4a"-->
<!--                            stroke-width="1.5"-->
<!--                            stroke-linecap="round"-->
<!--                            stroke-linejoin="round"-->
<!--                          >-->
<!--                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>-->
<!--                            <polyline points="22 4 12 14.01 9 11.01"></polyline>-->
<!--                          </svg>-->
<!--                         request account number-->
<!--                        </a>-->
<!--                      </li>-->
                      <li>
                        <a
                          @click="selectOption('generate', user)"
                          href="#"
                          class="block flex items-center gap-x-2 px-4 py-3 hover:bg-gray-100 text-start"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#4a4a4a"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                           Generate account number
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!users.length && !loading"
      class="flex border-[0.5px] mt-5 flex-col items-center justify-center h-64 bg-white rounded-lg">
      <div class="flex items-center justify-center p-6 mb-4">
        <img :src="dynamicIcons('illustration')" />
      </div>
      <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
        No Investment Product Available
      </p>
    </div>
    <CoreLoader v-else class="mt-6" />
    <div v-if="activeDropdown !== null" @click="closeDropdown" class="fixed inset-0 z-40 bg-black opacity-25"></div>
    <ModalsConfirm @close="isFlaggingModalOpen = false" @continue="confirmFlagingAction(selectedUser)"
      :loading="users.flagStatus ? unflagging : flagging" title="Confirm Action" :description="`Are you sure you want to ${users.flagStatus ? 'Un-Flag' : 'Flag'} ${selectedUser.firstName ?? 'Nil'} ${selectedUser.lastName ?? 'Nil' } account`" :show="isFlaggingModalOpen" />

    <ModalsConfirm @close="isBlockingModalOpen = false" @continue="confirmBlockingAction(selectedUser)"
      :loading="users.blockStatus ? unblocking : blocking" title="Confirm Action" :description="`Are you sure you want to ${users.blockStatus ? 'Un-Block' : 'Block'} ${selectedUser.firstName ?? 'Nil'} ${selectedUser.lastName ?? 'Nil' } account`" :show="isBlockingModalOpen" />

      <CoreBaseModal :show="openAddUserModal" @update:show="openAddUserModal = false">
          <ModulesUsersCreate @success="openAddUserModal = false" />
      </CoreBaseModal>

      <ModalsConfirm
      @close="isRequestModalOpen = false"
      @continue="proceedToRequestAccountNumber"
      :loading="loading"
      title="Confirm Request"
      :description="`Are you sure you want to proceed to request account number for ${selectedUser?.firstName} ${selectedUser?.lastName}`"
      :show="isRequestModalOpen"
    />


    <ModalsConfirm
      @close="isGenerateAccount = false"
      @continue="proceedToGenerateAccountNumber"
      :loading="generating"
      title="Confirm!"
      :description="`Are you sure you want to proceed to generate account number for ${selectedUser?.firstName} ${selectedUser?.lastName}`"
      :show="isGenerateAccount"
    />

    <CoreBaseModal :show="openConfirmAccountNumberOTPModal" @update:show="openConfirmAccountNumberOTPModal = false">
<!--      <ModulesUsersCreate @success="openConfirmAccountNumberOTPModal = false" />-->
      <!-- Timer duration in seconds (4 minutes) -->
      <CoreOtpInput
          title="Verify Your Email"
          description="We have sent a verification code to john@example.com."
          :otpBoxes="6"
          :loader="loading"
          :timerDuration="240"
          :onTimerExpire="handleTimerExpire"
          @otp="handleOtp"
          @clear="handleClear"
      />
    </CoreBaseModal>
  </div>
</template>

<script setup lang="ts">
import { useSubmitAccountNumberRequest } from '@/composables/modules/users/useSubmitAccountNumberRequest'
import { useGenerateAccountNumber } from '@/composables/modules/users/useGenerateAccountNumber'
import { useBlockUser } from '@/composables/modules/users/useBlockUser'
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
const { blockUser, loading: blocking, } = useBlockUser()
const { generateAccountNumber, loading: generating } = useGenerateAccountNumber ()
const { submitAccountNumberRequest, loading, setPayload } = useSubmitAccountNumberRequest()


import { useUnblockUser } from '@/composables/modules/users/useUnblockUser'
const { unblockUser, loading: unblocking, } = useUnblockUser()

import { useFlagUserAccount } from '@/composables/modules/users/useFlagUserAccount'
const { flagUserAccount, loading: flagging, } = useFlagUserAccount()

import { useUnflagUserAccount } from '@/composables/modules/users/useUnflagUserAccount'
const { unflagUserAccount, loading: unflagging, } = useUnflagUserAccount()
import { dynamicIcons } from "@/utils/assets";
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  users: {
    type: Array,
    default: () => [],
  },
});

const openAddUserModal = ref(false)
const isFlaggingModalOpen = ref(false);
const isBlockingModalOpen = ref(false);
const isRequestModalOpen = ref(false)
const isGenerateAccount = ref(false)
const openConfirmAccountNumberOTPModal = ref(false)
const otpComponent = ref();

const confirmFlagingAction = async (item: any) => {
  if(item.flagStatus){
    await unflagUserAccount(item.id)
  }

  if(!item.flagStatus){
    await flagUserAccount(item.id)
  }
}

const confirmBlockingAction = async (item: any) => {
  if(item.blockStatus){
    await unblockUser(item.id)
  }

  if(!item.blockStatus){
    await blockUser(item.id)
  }
}

const proceedToGenerateAccountNumber = async () => {
  if(selectedUser.value){
    const response = await generateAccountNumber(selectedUser?.value?.id)
    console.log(response, 'response here 0000')
    if(response && response === 'success'){
      isGenerateAccount.value = false
      openConfirmAccountNumberOTPModal.value = true
    }
  }
}

const selectedUser = ref({});

const openDropdown = ref<number | null>(null);
const emit = defineEmits(["selected"]);

const activeDropdown = ref<number | null>(null);

const toggleDropdown = (index: number) => {
  if (activeDropdown.value === index) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = index;
  }
};

const closeDropdown = () => {
  activeDropdown.value = null;
};

// Close dropdown when clicking outside the specific row
const handleClickOutside = (event: MouseEvent) => {
  const dropdownId = `drop-options-${openDropdown.value}`;
  const dropdownButton = document.getElementById(dropdownId);
  if (dropdownButton && !dropdownButton.contains(event.target as Node)) {
    openDropdown.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});


const selectOption = (option: string, item?: any) => {
  console.log(item, 'item')
  selectedUser.value = item
  if (option === 'view') {
    emit('selected', item)
  }

  if (option === 'flag-status-update') {
    isFlaggingModalOpen.value = true
    // emit('selected', item)
  }

  if (option === 'block-status-update') {
    isBlockingModalOpen.value = true
    // emit('selected', item)
  }

  if(option === 'request'){
    isRequestModalOpen.value = true
  }

  if(option === 'generate'){
    isGenerateAccount.value = true
  }
  closeDropdown()
};

const handleOtp = async (otpCode: string) => {
  // console.log("OTP Entered:", otpCode);
  const payload = {
    otp: otpCode
  }
  setPayload(payload)
  await submitAccountNumberRequest()
  openConfirmAccountNumberOTPModal.value = false
};

const handleClear = () => {
  console.log("Clearing OTP fields...");
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

</script>
