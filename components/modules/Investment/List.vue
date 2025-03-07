<template>
  <div class="px-4 sm:px-6 lg:px-8 mt-6">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">
          Investment Products
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all investment products their Name,	Min Investment,	Interest Rate (%),	Min Tenor(months),	Max Tenor(months),	Pre Liquidation Fee and	Status.	
        </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <NuxtLink v-if="canCreate('investment-product')"
          to="/dashboard/investment-products/create"
          class="block rounded-md bg-[#2F6D67] px-3 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#2F6D67] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6D67]"
        >
          Create Investment Product
        </NuxtLink>
      </div>
    </div>
    <div v-if="products.length && !loading" class="">
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
          >
            <div
              class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg"
            >
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Min Investment
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Interest Rate (%)
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Min Tenor(months)
                    </th>
                    <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Max Tenor(months)
                    </th>
                    <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Pre Liquidation Fee
                    </th>
                    <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr
                    v-for="(product, index) in products"
                    :key="index"
                    class="even:bg-gray-50"
                  >
                    <td
                      class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0"
                    >
                      <div class="flex items-center">
                        <div class="ml-4">
                          <div class="font-medium text-gray-900">
                            {{ product?.name || "Nil" }}
                          </div>
                          <div class="mt-1 text-gray-500">
                            {{
                              `${product?.description?.slice(0, 20)}...` ||
                              "Nil"
                            }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-5 text-sm text-gray-500"
                    >
                      <div class="text-gray-900">
                        {{ formatCurrency(product?.minInvestment) || "Nil" }}
                      </div>
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-5 text-sm text-gray-500"
                    >
                      {{ product?.interestRate || "Nil" }}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-5 text-sm text-gray-500"
                    >
                      {{ product?.minTenor || "Nil" }}
                    </td>
                    <td
                        class="whitespace-nowrap px-3 py-5 text-sm text-gray-500"
                    >
                      {{ product?.maxTenor || "Nil" }}
                    </td>
                    <td
                        class="whitespace-nowrap px-3 py-5 text-sm text-gray-500"
                    >
                      {{ formatCurrency(product?.preLiquidationFee) || "Nil" }}
                    </td>
                    <td
                        class="whitespace-nowrap px-3 py-5 text-sm text-gray-500"
                    >
                      <span class="rounded-full text-xs px-5 py-1.5" :class="[product?.status === 'active' ? 'text-green-900 bg-green-200' : 'text-red-900 bg-red-200']">{{ product?.status || "Nil" }}</span>
                    </td>
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
                      <li v-if="canView('investment-product')">
                        <a
                         @click="selectOption('view', product)"
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
                      <li v-if="canDelete('investment-product')">
                        <a
                          @click="selectOption('delete', product)"
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
                          Delete
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
    </div>
    <div
      v-else-if="!products.length && !loading"
      class="flex border-[0.5px] mt-5 flex-col items-center justify-center h-64 bg-white rounded-lg"
    >
      <div class="flex items-center justify-center p-6 mb-4">
        <img :src="dynamicIcons('illustration')" />
      </div>
      <p class="text-[#1D2739] font-medium pt-0 mt-0 text-sm">
        No Investment Product Available
      </p>
    </div>
    <CoreLoader v-else class="mt-6" />
    <div
    v-if="activeDropdown !== null"
    @click="closeDropdown"
    class="fixed inset-0 z-40 bg-black opacity-25"
  ></div>
  <ModalsConfirm
      @close="isDeleteModalOpen = false"
      @continue="deleteInvestmentProduct(selectedInvestment.id)"
      :loading="deleting"
      title="Confirm Delete"
      :description="`Are you sure you want to delete ${
        selectedInvestment.name ?? 'Nil'
      } product`"
      :show="isDeleteModalOpen"
    />
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '@/utils/currencyUtils';
import { usePermissions } from '@/composables/core/usePermissions'
const { canCreate, canView, canDelete } = usePermissions()
import { useArchiveInvestmentProduct } from '@/composables/modules/investment-products/useArchiveInvestmentProduct' 
const { archiveInvestmentProduct,
  loading:deleting } = useArchiveInvestmentProduct()
import { dynamicIcons } from "@/utils/assets";
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  products: {
    type: Array,
    default: () => [],
  },
});

const selectedInvestment = ref({});

const isDeleteModalOpen = ref(false);

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
    selectedInvestment.value = item
    if(option === 'view'){
      emit('selected', item)
    }

    if(option === 'delete'){
      isDeleteModalOpen.value  =  true
      // emit('selected', item)
    }
  };
</script>
