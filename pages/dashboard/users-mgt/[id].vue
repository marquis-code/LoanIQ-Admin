<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- Breadcrumb -->
    <div class="mb-6 flex items-center text-sm text-gray-600">
      <NuxtLink to="/dashboard/users-mgt" class="hover:text-primary"
        >Users</NuxtLink
      >
      <span class="mx-2">/</span>
      <span class="font-medium"
        >{{ user?.firstName }} {{ user?.lastName }}</span
      >
    </div>

    <!-- User Quick Info -->
    <div
      v-if="!loading"
      class="mb-6 rounded-lg bg-white p-6 shadow-sm"
    >
      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-center gap-4">
          <div class="h-16 w-16 overflow-hidden rounded-full bg-gray-100">
            <img
              src="@/assets/icons/avatar.svg"
              :alt="user?.firstName"
              class="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 class="text-xl font-semibold text-gray-900">
              {{ user?.firstName }} {{ user?.lastName }}
            </h1>
            <p class="text-sm text-gray-500">ID: {{ user?.id }}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            :class="{
              'bg-green-100 text-green-800': user?.blockStatus === false,
              'bg-red-100 text-red-800': user?.blockStatus === true,
              'bg-yellow-100 text-yellow-800': user?.flagStatus === true,
            }"
            class="rounded-full px-3 py-1 text-sm font-medium"
          >
            {{ user?.blockStatus ? "Blocked" : "Active" }}
            {{ user?.flagStatus ? "Flagged" : "" }}
            <!-- {{ user.status.charAt(0).toUpperCase() + user.status.slice(1) }} -->
          </span>
          <span
            class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
          >
            KYC Tier {{ user?.tier }}
          </span>
        </div>
      </div>
    </div>
    <CoreLoader v-else class="mt-6" />

    <!-- Tabs -->
    <div class="mb-6 rounded-lg bg-white shadow-sm">
      <div class="border-b">
        <div class="flex overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="{
              'border-primary text-primary': activeTab === tab.id,
              'border-transparent text-gray-500 hover:text-gray-700':
                activeTab !== tab.id,
            }"
            class="flex min-w-max items-center border-b-2 px-4 py-3 text-sm font-medium focus:outline-none"
          >
            <component :is="tab.icon" class="mr-2 h-4 w-4" />
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- User Details Tab -->
        <div v-if="activeTab === 'details'" class="space-y-6">
          <div
            v-if="!loading"
            class="grid gap-6 md:grid-cols-2"
          >
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
                  <label class="text-sm font-medium text-gray-500"
                    >Date Joined</label
                  >
                  <p class="mt-1">
                    {{ new Date(user?.createdAt).toLocaleDateString() }}
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-lg font-medium">Account Actions</h3>
              <div class="flex flex-wrap gap-3">
                <button
                  @click="showFlagModal = true"
                  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <Flag class="mr-2 h-4 w-4" />
                  {{ user?.flagStatus ? "Remove Flag" : "Flag User" }}
                </button>
                <button
                  @click="showBlockModal = true"
                  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <Ban class="mr-2 h-4 w-4" />
                  {{ user?.blockStatus ? "Unblock User" : "Block User" }}
                </button>
                <button @click="showGenerateAccountNumberModal = true"  class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                  <Ban class="mr-2 h-4 w-4" />
                  Generate Account Number
                </button>
              </div>
            </div>
          </div>
          <CoreLoader v-else class="mt-6" />
        </div>

        <!-- Transactions Tab -->
        <div v-if="activeTab === 'transactions'" class="overflow-x-auto">
          <table
            v-if="transactions.length && !fetchingTransactions"
            class="min-w-full divide-y divide-gray-200"
          >
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="header in transactionHeaders"
                  :key="header"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="transaction in transactions" :key="transaction?.id">
                <td class="whitespace-nowrap px-6 py-6">
                  {{ transaction?.referenceId }}
                </td>
                <td class="whitespace-nowrap px-6 py-6">
                  {{ moment(transaction?.date).format("MMMM Do YYYY") }}
                </td>
                <td class="whitespace-nowrap px-6 py-6">
                  <span
                    :class="{
                      'bg-green-100 text-green-800':
                        transaction?.creditType === 'Credit',
                      'bg-red-100 text-red-800':
                        transaction?.creditType === 'Debit',
                    }"
                    class="rounded-full px-2 py-1 text-xs font-medium"
                  >
                    {{ transaction?.creditType }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-6">
                  {{ formatCurrency(transaction?.amount) }}
                </td>
                <td class="whitespace-nowrap px-6 py-6">
                  <span
                    :class="{
                      'bg-green-100 text-green-800':
                        transaction.status === 'Successfull',
                      'bg-yellow-100 text-yellow-800':
                        transaction.status === 'Pending',
                      'bg-red-100 text-red-800':
                        transaction.status === 'Failed',
                    }"
                    class="rounded-full px-2 py-1 text-xs font-medium"
                  >
                    {{ transaction.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-else-if="!transactions?.length && !fetchingTransactions"
            class="flex mx-auto border-[0.5px] mt-5 mx-6 flex-col items-center justify-center h-64 bg-white rounded-lg"
          >
            <div class="flex items-center justify-center p-6 mb-4">
              <img :src="dynamicIcons('illustration')" />
            </div>
            <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
              No Transactions Available
            </p>
          </div>
          <CoreLoader v-else class="mt-6" />
        </div>

        <!-- Investments Tab -->
        <div v-if="activeTab === 'investments'" class="overflow-x-auto">
          <table
            v-if="investments.length && !fetchingInvestnemts"
            class="min-w-full divide-y divide-gray-200"
          >
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="header in investmentHeaders"
                  :key="header"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="investment in investments" :key="investment.id">
                <td class="whitespace-nowrap px-6 py-6">
                  {{ investment.name }}
                </td>
                <td class="whitespace-nowrap px-6 py-6">
                  {{ formatCurrency(investment?.amount) }}
                </td>
                <td class="whitespace-nowrap px-6 py-6">
                  {{ moment(investment.startDate).format("MMMM Do YYYY") }}
                </td>
                <td class="whitespace-nowrap px-6 py-6">
                  {{ moment(investment.endDate).format("MMMM Do YYYY") }}
                </td>
                <td class="whitespace-nowrap px-6 py-6">
                  <span
                    :class="{
                      'bg-green-100 text-green-800':
                        investment.status === 'active',
                      'bg-yellow-100 text-yellow-800':
                        investment.status === 'pending',
                      'bg-red-100 text-red-800':
                        investment.status === 'completed',
                    }"
                    class="rounded-full px-2 py-1 text-xs font-medium"
                  >
                    {{ investment.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-else-if="!investments?.length && !fetchingInvestnemts"
            class="flex mx-auto border-[0.5px] mt-5 mx-6 flex-col items-center justify-center h-64 bg-white rounded-lg"
          >
            <div class="flex items-center justify-center p-6 mb-4">
              <img :src="dynamicIcons('illustration')" />
            </div>
            <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
              No Investments Available
            </p>
          </div>
          <CoreLoader v-else class="mt-6" />
        </div>

        <!-- KYC Documents Tab -->
        <div v-if="activeTab === 'kyc'" class="space-y-6">
          <div
            v-if="kycDocuments?.length && !loadingDocuments"
            class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div
              v-for="document in kycDocuments"
              :key="document.id"
              class="rounded-lg border p-4"
            >
              <div class="mb-3 flex items-center justify-between">
                <h4 class="font-medium">{{ document.idType }}</h4>
                <span
                  :class="{
                    'bg-green-100 text-green-800':
                      document.status === 'approved',
                    'bg-yellow-100 text-yellow-800':
                      document.status === 'pending',
                    'bg-red-100 text-red-800': document.status === 'rejected',
                  }"
                  class="rounded-full px-2 py-1 text-xs font-medium"
                >
                  {{ document.status }}
                </span>
              </div>
              <!-- {{document}} -->
              <!-- <div class="mb-3 aspect-video overflow-hidden rounded-lg bg-gray-100">
                  <img
                    :src="document.documentFrontCopy"
                    :alt="document.type"
                    class="h-full w-full object-cover"
                  />
                </div> -->
              <div
                class="mb-3 aspect-video overflow-hidden rounded-lg bg-gray-100 relative group"
              >
                <div
                  class="h-full w-full transition-transform duration-500 transform preserve-3d group-hover:rotate-y-180"
                >
                  <!-- Front Side -->
                  <img
                    :src="document.documentFrontCopy || placeholderImage"
                    :alt="document.type"
                    class="absolute inset-0 h-full w-full object-cover backface-hidden"
                  />
                  <!-- Back Side -->
                  <img
                    :src="document.documentBackCopy || placeholderImage"
                    :alt="document.type"
                    class="absolute inset-0 h-full w-full object-cover backface-hidden rotate-y-180"
                  />
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="reviewDocument(document)"
                  class="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Review
                </button>
              </div>
            </div>
          </div>
          <div
            v-else-if="!kycDocuments?.length && !loadingDocuments"
            class="flex mx-auto border-[0.5px] mt-5 mx-6 flex-col items-center justify-center h-64 bg-white rounded-lg"
          >
            <div class="flex items-center justify-center p-6 mb-4">
              <img :src="dynamicIcons('illustration')" />
            </div>
            <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
              No KYC Documents Available
            </p>
          </div>
          <CoreLoader v-else class="mt-6" />
        </div>

        <!-- Activity Tab -->
        <div v-if="activeTab === 'activity'" class="space-y-6">
          <div
            v-if="activitiesList?.length && !loadingActivities"
            class="space-y-4"
          >
            <div
              v-for="activity in activities"
              :key="activity.id"
              class="rounded-lg border p-4"
            >
              <div class="flex items-start gap-4">
                <div
                  :class="{
                    'bg-green-100': activity.type === 'login',
                    'bg-blue-100': activity.type === 'transaction',
                    'bg-yellow-100': activity.type === 'update',
                  }"
                  class="rounded-full p-2"
                >
                  <component
                    :is="getActivityIcon(activity.type)"
                    class="h-4 w-4"
                    :class="{
                      'text-green-600': activity.type === 'login',
                      'text-blue-600': activity.type === 'transaction',
                      'text-yellow-600': activity.type === 'update',
                    }"
                  />
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-medium">{{ activity.action }}</h4>
                    <span class="text-sm text-gray-500">{{
                      activity.time
                    }}</span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600">
                    {{ activity.description }}
                  </p>
                  <div class="mt-2 text-sm text-gray-500">
                    <span class="mr-4">
                      <MapPin class="mr-1 inline-block h-4 w-4" />
                      {{ activity.location }}
                    </span>
                    <span>
                      <Monitor class="mr-1 inline-block h-4 w-4" />
                      {{ activity.device }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else-if="!activitiesList?.length && !loadingActivities"
            class="flex mx-auto border-[0.5px] mt-5 mx-6 flex-col items-center justify-center h-64 bg-white rounded-lg"
          >
            <div class="flex items-center justify-center p-6 mb-4">
              <img :src="dynamicIcons('illustration')" />
            </div>
            <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
              No Activities Logs Available
            </p>
          </div>
          <CoreLoader v-else class="mt-6" />
        </div>
      </div>
    </div>

    <!-- Flag Modal -->
    <TransitionRoot appear :show="showFlagModal" as="template">
      <Dialog as="div" @close="showFlagModal = false" class="relative z-50">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/80" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
            <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] mx-auto lg:w-[500px] max-w-[5200px] rounded-lg bg-white p-6">
                <DialogTitle class="text-lg font-medium">
                  {{ user?.flagStatus ? "Remove Flag" : "Flag User" }}
                </DialogTitle>
                <div class="mt-4">
                  <textarea
                    v-model="flagComment"
                    rows="4"
                    class="w-full rounded-md p-3 outline-none border-[0.5px] border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    :placeholder="
                      user?.flagStatus
                        ? 'Reason for removing flag...'
                        : 'Reason for flagging user...'
                    "
                  ></textarea>
                </div>
                <div class="mt-6 flex justify-end gap-3">
                  <button
                    @click="showFlagModal = false"
                    class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    @click="handleFlag"
                    :disabled="unflagging || flagging"
                    class="rounded-md disabled:cursor-not-allowed disabled:opacity-25 bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                  >
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
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/80" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] mx-auto lg:w-[500px] max-w-[5200px] rounded-lg bg-white p-6">
                <DialogTitle class="text-lg font-medium">
                  {{ user?.blockStatus ? "Unblock User" : "Block User" }}
                </DialogTitle>
                <div class="mt-4">
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
                  <!-- <button
                    @click="handleBlock"
                    class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    Confirm
                  </button> -->
                  <button
                    @click="handleBlock"
                    :disabled="unblocking || blocking"
                    class="rounded-md disabled:cursor-not-allowed disabled:opacity-25 bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                  >
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
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="fixed inset-0 bg-black/80" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
              <div class="flex min-h-full items-center justify-center p-4">
                <TransitionChild
                  enter="duration-300 ease-out"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="duration-200 ease-in"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] mx-auto lg:w-[500px] max-w-[5200px] rounded-lg bg-white p-6">
                    <DialogTitle class="text-lg font-medium">
                    Generate Account Number
                    </DialogTitle>

                    <p class="font-medium pt-5">Are you sure you want to generate accoiunt number for {{ user?.firstName }} {{ user?.lastName }}  ?</p>

                    <div class="mt-16">
                      <button @click="proceedToGenerateAccountNumber" :disabled="generating" class="bg-[#2F6D67] disabled:opacity-25 disabled:cursor-not-allowed text-white px-4 py-3.5 w-full rounded-md">
                        {{  generating ? "processing..." : 'Cotinue' }}
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
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="fixed inset-0 bg-black/80" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
              <div class="flex min-h-full items-center justify-center p-4">
                <TransitionChild
                  enter="duration-300 ease-out"
                  enter-from="opacity-0 scale-95"
                  enter-to="opacity-100 scale-100"
                  leave="duration-200 ease-in"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <DialogPanel class="w-[90%] sm:w-[85%] md:w-[80%] mx-auto lg:w-[500px] max-w-[5200px] rounded-lg bg-white p-6">
                    <!-- <DialogTitle class="text-lg font-medium">
                    Generate Account Number
                    </DialogTitle> -->

                    <CoreOtpInput
                        title="Verify Your Email"
                        :description="`We have sent a verification code to ${user?.email}`"
                        :otpBoxes="6"
                        :loader="processing"
                        :timerDuration="240"
                        :onTimerExpire="handleTimerExpire"
                        @otp="handleOtp"
                        @clear="handleClear"
                    />

                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import moment from "moment";
import placeholderImage from "@/assets/icons/document.svg";
import { useCurrencyFormatter } from "@/composables/core/useCurrencyFormatter";
import { useGetTransactions } from "@/composables/modules/users/useFetchTransactions";
import { useGetUserDetails } from "@/composables/modules/users/useGetUserDetails";
import { useGetInvestments } from "@/composables/modules/users/useFetchInvestments";
import { useGetActivities } from "@/composables/modules/users/useFetchActivity";
import { useGetKycDocuments } from "@/composables/modules/users/useFetchKycDocuments";
import { useUnflagUserAccount } from "@/composables/modules/users/useUnflagUserAccount";
import { useFlagUserAccount } from "@/composables/modules/users/useFlagUserAccount";
import { useUnblockUser } from "@/composables/modules/users/useUnblockUser";
import { useBlockUser } from "@/composables/modules/users/useBlockUser";
import { useSubmitAccountNumberRequest } from '@/composables/modules/users/useSubmitAccountNumberRequest'
import { useGenerateAccountNumber } from '@/composables/modules/users/useGenerateAccountNumber'
import { useCustomToast } from "@/composables/core/useCustomToast";
const { user, loading } = useGetUserDetails();
const { transactions, loading: fetchingTransactions } = useGetTransactions();
const { investments, loading: fetchingInvestnemts } = useGetInvestments();
const { activities: activitiesList, loading: loadingActivities } =
  useGetActivities();
const { documents: kycDocuments, loading: loadingDocuments } =
  useGetKycDocuments();
const { unblockUser, loading: unblocking } = useUnblockUser();
const { flagUserAccount, loading: flagging } = useFlagUserAccount();
const { unflagUserAccount, loading: unflagging } = useUnflagUserAccount();
const { blockUser, loading: blocking } = useBlockUser();
const { formatCurrency } = useCurrencyFormatter();
const { showToast } = useCustomToast();
const { generateAccountNumber, loading: generating } = useGenerateAccountNumber ()
const { submitAccountNumberRequest, loading: processing, setPayload } = useSubmitAccountNumberRequest()

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


const tabs = [
  { id: "details", name: "User Details", icon: User },
  { id: "transactions", name: "Transactions", icon: CreditCard },
  { id: "investments", name: "Investments", icon: RefreshCw },
  { id: "kyc", name: "KYC Documents", icon: Flag },
  { id: "activity", name: "Activity", icon: Monitor },
];

const activeTab = ref("details");
const showFlagModal = ref(false);
const showBlockModal = ref(false);
const showGenerateAccountNumberModal = ref(false)
const openConfirmAccountNumberOTPModal = ref(false)
const isGenerateAccount = ref(false)
const flagComment = ref("");
const blockComment = ref("");
const otpComponent = ref();

// Transactions data
const transactionHeaders = ["ID", "Date", "Type", "Amount", "Status"];

// Investments data
const investmentHeaders = [
  "Plan",
  "Amount",
  "Start Date",
  "End Date",
  "Status",
];

// Activity data
const activities = [
  {
    id: 1,
    type: "login",
    action: "User Login",
    time: "2024-02-25 09:30 AM",
    description: "Successful login from Chrome browser",
    location: "New York, USA",
    device: "Chrome / Windows",
  },
  {
    id: 2,
    type: "transaction",
    action: "Investment Made",
    time: "2024-02-25 10:15 AM",
    description: "Invested $5,000 in Gold Plan",
    location: "New York, USA",
    device: "Chrome / Windows",
  },
  // Add more activities...
];

const proceedToGenerateAccountNumber = async () => {
  if(user.value){
    const response = await generateAccountNumber(user?.value?.id)
    console.log(response, ';res hee')
    if(response && response === 'success'){
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

const getActivityIcon = (type: string) => {
  switch (type) {
    case "login":
      return LogIn;
    case "transaction":
      return CreditCard;
    case "update":
      return RefreshCw;
    default:
      return Monitor;
  }
};

definePageMeta({
  layout: "admin-dashboard",
  middleware: "auth",
});
</script>

<style scoped>
.preserve-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.group-hover\:rotate-y-180:hover {
  transform: rotateY(180deg);
}
</style>
