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
  "Plan",
  "Amount",
  "Start Date",
  "End Date",
  "Status",
];
</script>