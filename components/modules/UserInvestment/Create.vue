<template>
    <main>
      <div class="p-6 max-w-4xl space-y-8 bg-white rounded-lg">


        <section class="lg:flex gap-x-10 space-y-6 lg:space-y-0">
          <section class="lg:w-6/12">
            <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
            <input
              id="email"
              v-model="payload.email"
              type="email"
              placeholder="Enter email"
              class="input-field"
            />
          </div>

            <div v-if="!fetchingInvestmentsProducts">
                <label for="investment-product" class="block text-sm font-medium text-gray-700">Product</label>
                <select v-model="selectedInvestmentProduct">
                    <option value="">Please select investment product</option>
                    <option v-for="product in products"
                    :key="product.id" :value="product"> {{ product.name }}</option>
                </select>
            </div>
            <div class="border-b pb-3 ">
        
              <h2 class="text-xl font-semibold text-gray-800 mb-5 space-x-3">{{ selectedInvestmentProduct.name ??= 'Nil' }}<span
                  class="text-xs bg-[#EEEFF2] text-gray-600 px-3 py-2 rounded-full ml-4">{{ selectedInvestmentProduct?.interestRate ?? 'Nil'
                  }}% Annual returns</span></h2>
              <p class="text-gray-600 text-sm leading-loose text-justify">
                {{ selectedInvestmentProduct.description ??= 'Nil' }}
              </p>
            </div>
    
            <!-- Benefits -->
            <div class="border-b pb-3">
              <h3 class="font-semibold text-lg mb-2">Benefits</h3>
              <div class="grid grid-cols-2 gap-4">
                <p v-for="(item, idx) in selectedInvestmentProduct?.benefits" :key="idx"
                  class="text-sm text-gray-600 flex items-center gap-x-2"><svg width="24" height="24" viewBox="0 0 24 24"
                    fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_0_1859)">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM9.29 16.29L5.7 12.7C5.31 12.31 5.31 11.68 5.7 11.29C6.09 10.9 6.72 10.9 7.11 11.29L10 14.17L16.88 7.29C17.27 6.9 17.9 6.9 18.29 7.29C18.68 7.68 18.68 8.31 18.29 8.7L10.7 16.29C10.32 16.68 9.68 16.68 9.29 16.29Z"
                        fill="#D80032" />
                    </g>
                    <defs>
                      <clipPath id="clip0_0_1859">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  {{ item }}</p>
              </div>
            </div>
          </section>
          
    
          <section class="lg:w-6/12">
            <!-- {{ payload }} -->
            <!-- Form Section -->
            <div class="space-y-6">
              <div>
                <label class="text-[#7D8799] text-sm">Name This Investment For Identification</label>
                <input type="text" v-model="payload.name" placeholder="Rent Payment"
                  class="w-full p-2 py-3.5 text-sm border border-gray-300 outline-none border-none bg-[#F4F5F7] rounded" />
              </div>
              <div>
                <label class="text-[#7D8799] text-sm">Frequency</label>
                <select v-model="payload.automatedFrequency"
                  class="w-full outline-none border-none p-2 py-3.5 text-sm border bg-[#F4F5F7] border-gray-300 rounded">
                  <option value="">Please select Frequency</option>
                  <option :value="item" v-for="(item, idx) in selectedInvestmentProduct?.automatedFrequency" :key="idx">{{ item }}
                  </option>
                </select>
              </div>
    
              <div>
                <label class="text-[#7D8799] text-sm">Interest payment option</label>
                <select v-model="payload.interestPaymentSchedule"
                  class="w-full outline-none border-none p-2 py-3.5 text-sm border bg-[#F4F5F7] border-gray-300 rounded">
                  <option value="">Please select an Interest payment option</option>
                  <option :value="item" v-for="(item, idx) in selectedInvestmentProduct?.interestPaymentSchedule" :key="idx">{{ item }}
                  </option>
                </select>
              </div>
    
              <div>
                <label class="text-[#7D8799] text-sm">Investment Tenor (months) {{ payload?.tenor }}</label>
                <div class="flex items-center space-x-4 mt-3">
                   <input
                    type="range"
                    v-model="payload.tenor"
                    class="w-full appearance-none bg-[#F4F5F7] rounded-lg h-2 cursor-pointer"
                    :min="minTenor"
                    :max="maxTenor"
                    :disabled="!isValidRange"
                  />
                </div>
              </div>
    
    
              <!-- Amount and ROI Section -->
              <div class="flex flex-col  justify-between gap-y-4 border-b pb-4 border-gray-100">
                <h3 class="font-semibold text-[#7D8799]">Your Amount (₦)</h3>
                <div class="flex items-center  space-x-4">
                  <button @click="decreaseAmount" :disabled="amount.value <= (selectedInvestmentProduct?.minInvestment || 0)" class="">
                    <svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M20.5 0C9.45431 0 0.5 8.95431 0.5 20C0.5 31.0457 9.45431 40 20.5 40C31.5457 40 40.5 31.0457 40.5 20C40.5 8.95431 31.5457 0 20.5 0ZM26.5 18V21.968H14.5V18H26.5Z"
                        fill="#D9D9D9" />
                    </svg>
    
                  </button>
                  <div class="flex justify-center items-center">
                  <input
                  type="text"
                  :value="formattedAmount"
                  @input="updateAmount" 
                    class="text-2xl font-bold text-center border-none outline-none p-2 w-full no-caret"
                  />
                </div>
    
                  <button @click="increaseAmount" class="">
                    <svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M20.5 0C9.45431 0 0.5 8.95431 0.5 20C0.5 31.0457 9.45431 40 20.5 40C31.5457 40 40.5 31.0457 40.5 20C40.5 8.95431 31.5457 0 20.5 0ZM22.62 13V18.248H27.9V22.12H22.62V27.4H18.748V22.12H13.5V18.248H18.748V13H22.62Z"
                        fill="#DD3636" />
                    </svg>
    
                  </button>
                </div>
    
                <!-- <p>ROI: {{ formatCurrency(roi) }}</p> -->
              </div>
              <p class="text-[#434E61] text-sm flex items-center gap-x-1">
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.5 16H12.5V12H11.5M12.5 8H12.51M21.5 12C21.5 16.9706 17.4706 21 12.5 21C7.52944 21 3.5 16.9706 3.5 12C3.5 7.02944 7.52944 3 12.5 3C17.4706 3 21.5 7.02944 21.5 12Z"
                    stroke="#687181" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
    
                Total ROI after the completed cycle <span
                  class="text-[#10A83B] font-bold bg-[#EDFFF0] px-3 text-sm py-2 rounded-full">{{ formatCurrency(roi) }}</span>
              </p>
            </div>
    
            <!-- Submit Button -->
            <div class="pt-6">
              <button @click="router.push(`/dashboard/investments/explore-investments/${selectedInvestmentProduct.id}/summary`)"
                class="w-full py-3.5 bg-[#2F6D67] text-white rounded-md">Submit</button>
            </div>
          </section>
        </section>
    
      </div>

    </main>
    </template>
    
    
    <script setup lang="ts">
    import { ref, computed, watch, onMounted } from 'vue';
    import { formatCurrency } from '@/utils/currencyUtils';
    import { useFetchInvestmentProducts } from '@/composables/modules/investment-products/useFetchInvestmentProducts';
    import { useCreateInvestment } from '@/composables/modules/investments/useCreateInvestment'
    const { payload, loading: creating } = useCreateInvestment()
    const router = useRouter();
    import { calculate_roi } from '@/utils/calculateROI';
    const { investmentProducts: products, loading: fetchingInvestmentsProducts } = useFetchInvestmentProducts();
    
    // Form state
    const form = ref({
      amount: '',
    });
    
    const selectedInvestmentProduct = ref({})
    
    const formattedAmount = ref(""); 
    const rawAmount = ref(product?.value?.minInvestment || 0); // For the raw numeric value
    
    // Format number as Naira currency
    const formatToNaira = (value) => {
      return `₦${value.toLocaleString("en-NG")}`; // Format with commas and Naira sign
    };
    
    // Calculate and set ROI
    function calculateAndSetROI() {
      const principal = Number(payload.value.principal) || 0; // Ensure `principal` is a number
      const annual_rate = Number(product?.value?.interestRate) / 100 || 0; // Ensure `annual_rate` is a number
      const days = Number(payload?.value?.tenor) || 0; // Ensure `days` is a number
      const months = days / 30; // Convert tenor to months
      roi.value = calculate_roi(principal, annual_rate, months);
    }
    
    
    
    const updateAmount = (event) => {
      // Only allow numeric characters by replacing non-numeric ones
      const input = event.target.value.replace(/[^0-9]/g, ""); // Strip non-numeric characters
      rawAmount.value = parseInt(input, 10) || 0; // Update raw numeric value
    
      // Format the raw amount to Naira
      formattedAmount.value = formatToNaira(rawAmount.value); 
      event.target.value = formattedAmount.value; // Update the input field with the formatted value
    
      // Update the principal payload with the raw value (not formatted)
      payload.value.principal = rawAmount.value;
    
      // Use the raw amount for ROI calculation
      amount.value = rawAmount.value;
    
      // Call ROI calculation function
      calculateAndSetROI();
    };
    
    // // Update the raw value and reformat as user types
    // Watch for initial product value and update the formatted amount
    watch(
      () => product?.value?.minInvestment,
      (newMinInvestment) => {
        if (newMinInvestment) {
          rawAmount.value = newMinInvestment;
          formattedAmount.value = formatToNaira(newMinInvestment);
          payload.value.principal = formattedAmount.value
        }
      },
      { immediate: true } // Trigger immediately for initial value
    );
    
    // Amount and ROI state
    const amount = ref(0); // Internal amount
    const roi = ref(0); // ROI value
    
    
    // Update investment amount dynamically
    function updateInvestmentAmount(event: Event) {
      const inputValue = (event.target as HTMLInputElement).value;
      form.value.amount = inputValue;
    }
    
    // Ensure the amount cannot be less than the minimum investment
    const validateMinInvestment = () => {
      if (form.value.amount < product?.value?.minInvestment) {
        form.value.amount = product?.value?.minInvestment;
      }
    };
    
    // Watch for changes in product and initialize amount and ROI
    watch(
      () => product?.value,
      (newProduct) => {
        if (newProduct?.minInvestment) {
          amount.value = newProduct.minInvestment; // Set initial raw amount
          form.value.amount = formatToNaira(amount.value); // Set formatted amount
          payload.value.principal = form.value.amount
          calculateAndSetROI();
        }
      },
      { immediate: true } // Trigger the watcher immediately
    );
    
    
    // Watch for changes in product and initialize amount and ROI
    watch(
      () => payload?.value.tenor,
      (newProduct) => {
        calculateAndSetROI();
      },
      { immediate: true } // Trigger the watcher immediately
    );
    
    // Computed properties for min and max tenor
    const minTenor = computed(() => Number(product.value.minTenor) || 1); // Default to 1 if invalid
    const maxTenor = computed(() => Number(product.value.maxTenor) > 0 ? Number(product.value.maxTenor) : 10); // Default to 10 if invalid
    
    // Check if range is valid
    const isValidRange = computed(() => minTenor.value < maxTenor.value);
    
    // Initialize payload.tenor with a valid value
    onMounted(() => {
      payload.value.tenor = minTenor.value;
    });
    
    // Watch for changes in the input field to update the raw amount and recalculate ROI
    watch(
      () => form.value.amount,
      (newValue) => {
        // Parse the input value and remove formatting
        const parsedValue = parseInt(newValue.toString().replace(/[₦,]/g, ""), 10);
        if (!isNaN(parsedValue)) {
          amount.value = parsedValue; // Update raw amount
          payload.value.principal = parsedValue
          calculateAndSetROI(); // Recalculate ROI in real-time
        }
        // Format the input value
        form.value.amount = formatToNaira(amount.value);
      }
    );
    
    // Breadcrumb items
    const breadcrumbItems = computed(() => [
      { label: 'Investments', path: '/dashboard/invest' },
      { label: product?.value?.name || 'Unnamed Product' }, // Fallback for undefined product name
    ]);
    
    
    // Increase investment amount
    function increaseAmount() {
      const incrementValue = 100000; // Increment value
    
      // Ensure raw numeric value is synced with the input
      const parsedValue = parseInt(form.value.amount.toString().replace(/[₦,]/g, ""), 10);
      if (!isNaN(parsedValue)) {
        amount.value = parsedValue; // Sync amount.value with the input field
      }
    
      amount.value += incrementValue; // Increment the amount
      formattedAmount.value = formatToNaira(amount.value); // Update formatted amount
      form.value.amount = formattedAmount.value; // Sync formatted amount with the input field
      calculateAndSetROI();
    }
    
    // Decrease investment amount
    function decreaseAmount() {
      const decrementValue = 100000; // Decrement value
    
      // Ensure raw numeric value is synced with the input
      const parsedValue = parseInt(form.value.amount.toString().replace(/[₦,]/g, ""), 10);
      if (!isNaN(parsedValue)) {
        amount.value = parsedValue; // Sync amount.value with the input field
      }
    
      // Only decrease if the value is greater than the minimum investment
      if (amount.value > (product?.value?.minInvestment || 0)) {
        amount.value -= decrementValue; // Decrement the amount
        formattedAmount.value = formatToNaira(amount.value); // Update formatted amount
        form.value.amount = formattedAmount.value; // Sync formatted amount with the input field
        calculateAndSetROI();
      }
    }
    
    // Watch for manual input in the input field
    watch(
      () => form.value.amount,
      (newValue) => {
        const parsedValue = parseInt(newValue.toString().replace(/[₦,]/g, ""), 10);
        if (!isNaN(parsedValue)) {
          amount.value = parsedValue; // Sync amount.value with parsed value
          rawAmount.value = parsedValue; // Sync rawAmount with parsed value
          formattedAmount.value = formatToNaira(parsedValue); // Update formatted amount
          calculateAndSetROI(); // Recalculate ROI
        }
      }
    );
    
    onMounted(() => {
      if (product?.value?.minInvestment) {
        amount.value = product?.value?.minInvestment; // Set initial raw amount
        payload.value.principal = product?.value?.minInvestment;
        form.value.amount = formatToNaira(amount.value); // Set formatted amount
        calculateAndSetROI();
      }
    });
    
    </script>
    
    
    <style>
    /* Remove the number input caret (spinners) */
    input[type="number"].no-caret::-webkit-inner-spin-button,
    input[type="number"].no-caret::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type="number"].no-caret {
      -moz-appearance: textfield; /* Firefox */
    }
    
    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #7D8799;
      cursor: pointer;
    }
    
    input[type="range"]::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #7D8799;
      cursor: pointer;
    }
    
    input[type="range"]::-ms-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #7D8799;
      cursor: pointer;
    }
    </style>