<template>
<main>
    <table v-if="transactions.length && !fetchingTransactions" class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="header in transactionHeaders" :key="header"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
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
                  <span :class="{
                    'bg-green-100 text-green-800':
                      transaction?.creditType === 'Credit',
                    'bg-red-100 text-red-800':
                      transaction?.creditType === 'Debit',
                  }" class="rounded-full px-2 py-1 text-xs font-medium">
                    {{ transaction?.creditType }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-6">
                  {{ formatCurrency(transaction?.amount) }}
                </td>
                <td class="whitespace-nowrap px-6 py-6">
                  <span :class="{
                    'bg-green-100 text-green-800':
                      transaction.status === 'Successfull',
                    'bg-yellow-100 text-yellow-800':
                      transaction.status === 'Pending',
                    'bg-red-100 text-red-800':
                      transaction.status === 'Failed',
                  }" class="rounded-full px-2 py-1 text-xs font-medium">
                    {{ transaction.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else-if="!transactions?.length && !fetchingTransactions"
            class="flex mx-auto border-[0.5px] mt-5 mx-6 flex-col items-center justify-center h-64 bg-white rounded-lg">
            <div class="flex items-center justify-center p-6 mb-4">
              <img :src="dynamicIcons('illustration')" />
            </div>
            <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
              No Transactions Available
            </p>
          </div>
          <CoreLoader v-else class="mt-6" />
</main>
</template>

<script setup lang="ts">
import moment from "moment";
import { useCurrencyFormatter } from "@/composables/core/useCurrencyFormatter";
const { formatCurrency } = useCurrencyFormatter();
const transactionHeaders = ["ID", "Date", "Type", "Amount", "Status"];
import { useGetTransactions } from "@/composables/modules/users/useFetchTransactions";
const { transactions, loading: fetchingTransactions } = useGetTransactions();
</script>