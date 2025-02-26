import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useActiveInvestments = () => {
  const loading = ref(false);
  const activeInvestments = ref<any[]>([]);
  const metadata = ref({
    page: 1,
    pageSize: 7,
    total: 0,
    pages: 0,
  });

  const fetchActiveInvestments = async () => {
    loading.value = true;
    const response = await investment_api.$_active_investment(metadata.value) as any
    // console.log(response?.data?.data?.activeInvestments, 'res pns s here')
    if (response.type !== "ERROR") {
      console.log(response?.data?.data?.activeInvestments, 'res pns s here')
      // console.log(response?.data?.data, 'Active invstments')
      activeInvestments.value = response?.data?.data?.activeInvestments;
      const { page, pageSize, total, pages } = response?.data?.data || {};
      metadata.value = { page, pageSize, total, pages };
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error fetching active investments"}`,
        toastType: "error",
        duration: 3000,
      });
    }
    loading.value = false;
  };


  onMounted(() => {
    fetchActiveInvestments()
  })


  watch( [metadata.value.page, metadata.value.pageSize], // Watch only page and pageSize
    () => {
        // debouncedGetProperties(); // Use the debounced version here
        fetchActiveInvestments()
    }
);

  return {
    activeInvestments,
    loading,
  };
};
