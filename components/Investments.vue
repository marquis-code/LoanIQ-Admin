<!-- <template>
    <main>
        <table v-if="investments.length && !fetchingInvestnemts" class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="header in investmentHeaders" :key="header"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="investment in investments" :key="investment.id">
                <td class="whitespace-nowrap px-6 py-6">
                  {{ investment.name ?? 'Nil' }}
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
                  <span :class="{
                    'bg-green-100 text-green-800':
                      investment.status === 'active',
                    'bg-yellow-100 text-yellow-800':
                      investment.status === 'pending',
                    'bg-red-100 text-red-800':
                      investment.status === 'completed',
                  }" class="rounded-full px-2 py-1 text-xs font-medium">
                    {{ investment.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else-if="!investments?.length && !fetchingInvestnemts"
            class="flex mx-auto border-[0.5px] mt-5 mx-6 flex-col items-center justify-center h-64 bg-white rounded-lg">
            <div class="flex items-center justify-center p-6 mb-4">
              <img :src="dynamicIcons('illustration')" />
            </div>
            <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
              No Investments Available
            </p>
          </div>
          <CoreLoader v-else class="mt-6" />
    </main>
</template>

<script setup lang="ts">
import moment from "moment";
import { useCurrencyFormatter } from "@/composables/core/useCurrencyFormatter";
const { formatCurrency } = useCurrencyFormatter();
import { useGetInvestments } from "@/composables/modules/users/useFetchInvestments";
const { investments, loading: fetchingInvestnemts } = useGetInvestments();
// Investments data
const investmentHeaders = [
  "Name",
  "Amount",
  "Start Date",
  "End Date",
  "Status",
];
</script> -->

<template>
  <main>
    <table v-if="investments.length && !fetchingInvestnemts" class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th v-for="header in investmentHeaders" :key="header"
            class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr v-for="investment in investments" :key="investment.id" @click="router.push(`/dashboard/investment-mgt/clients/${investment.id}`)" class="hover:bg-gray-50">
          <td class="whitespace-nowrap px-6 py-4">
            <div class="flex items-center">
              <div class="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                <component :is="investment.lock ? LockIcon : CreditCardIcon" class="h-5 w-5 text-indigo-600" />
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ investment.name || 'Investment Plan' }}
                </div>
                <div class="text-xs text-gray-500">
                  ID: {{ investment.id.substring(0, 8) }}...
                </div>
              </div>
            </div>
          </td>
          <td class="whitespace-nowrap px-6 py-4">
            <div class="text-sm font-medium text-gray-900">{{ formatCurrency(investment?.amount) }}</div>
            <div class="text-xs text-gray-500">
              {{ investment.topUpAmount > 0 ? `+${formatCurrency(investment?.topUpAmount)} top-up` : '' }}
            </div>
          </td>
          <td class="whitespace-nowrap px-6 py-4">
            <div class="text-sm font-medium text-gray-900">{{ investment.interestRate }}%</div>
            <div class="text-xs text-gray-500">
              {{ investment.interestPaymentSchedule === 'upfront' ? 'Paid upfront' : investment.interestPaymentSchedule }}
            </div>
          </td>
          <td class="whitespace-nowrap px-6 py-4">
            <div class="text-sm font-medium text-gray-900">
              {{ investment.tenor }} days
            </div>
            <div class="text-xs text-gray-500">
              {{ moment(investment.startDate).format("MMM D") }} - {{ moment(investment.maturityDate).format("MMM D, YYYY") }}
            </div>
          </td>
          <td class="whitespace-nowrap px-6 py-4">
            <div class="text-sm font-medium text-emerald-600">
              {{ formatCurrency(investment?.returnOnInvestment) }}
            </div>
            <div class="text-xs text-gray-500">
              Expected return
            </div>
          </td>
          <td class="whitespace-nowrap px-6 py-4">
            <span :class="{
              'bg-green-100 text-green-800 border border-green-300': investment.status === 'active',
              'bg-yellow-100 text-yellow-800 border border-yellow-300': investment.status === 'pending',
              'bg-red-100 text-red-800 border border-red-300': investment.status === 'completed',
              'bg-blue-100 text-blue-800 border border-blue-300': investment.status === 'matured',
            }" class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
              <component :is="getStatusIcon(investment.status)" class="mr-1 h-3 w-3" />
              {{ investment.status.charAt(0).toUpperCase() + investment.status.slice(1) }}
              <LockIcon v-if="investment.lock" class="ml-1 h-3 w-3" />
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else-if="!investments?.length && !fetchingInvestnemts"
      class="flex mx-auto border-[0.5px] mt-5 mx-6 flex-col items-center justify-center h-64 bg-white rounded-lg">
      <div class="flex items-center justify-center p-6 mb-4">
        <img :src="dynamicIcons('illustration')" />
      </div>
      <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
        No Investments Available
      </p>
    </div>
    <CoreLoader v-else class="mt-6" />
  </main>
</template>

<script setup lang="ts">
import moment from "moment";
import { useCurrencyFormatter } from "@/composables/core/useCurrencyFormatter";
import { 
  Lock as LockIcon, 
  CreditCard as CreditCardIcon,
  CheckCircle2 as CheckCircleIcon,
  Clock as ClockIcon,
  AlertCircle as AlertCircleIcon,
  Award as AwardIcon
} from 'lucide-vue-next';
const router = useRouter()

const { formatCurrency } = useCurrencyFormatter();
import { useGetInvestments } from "@/composables/modules/users/useFetchInvestments";
const { investments, loading: fetchingInvestnemts } = useGetInvestments();

// Updated investment headers to show the most important information
const investmentHeaders = [
  "Investment",
  "Amount",
  "Interest Rate",
  "Tenor",
  "Returns",
  "Status"
];

// Function to get the appropriate status icon
const getStatusIcon = (status) => {
  switch (status) {
    case 'active':
      return CheckCircleIcon;
    case 'pending':
      return ClockIcon;
    case 'completed':
      return AwardIcon;
    case 'matured':
      return AwardIcon;
    default:
      return AlertCircleIcon;
  }
};
</script>

