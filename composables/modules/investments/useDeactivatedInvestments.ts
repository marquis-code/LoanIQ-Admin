import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment"
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

const deactivatedInvestments = ref<any[]>([]);

export const useDeactivatedInvestments = () => {
  const loading = ref(false);
  const metadata = ref({
    page: 1,
    pageSize: 7,
    total: 0,
    pages: 0,
  });

  const fetchDeactivatedInvestments = async () => {
    loading.value = true;
    const response = await investment_api.$_deactivated_investment(metadata.value) as any

    if (response.type !== "ERROR") {
      const { page, pageSize, total, pages } = response?.data?.data || {};
      deactivatedInvestments.value = response?.data?.data?.activeInvestments;
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error fetching deactivated investments"}`,
        toastType: "error",
        duration: 3000,
      });
    }
    loading.value = false;
  };

  onMounted(() => {
    fetchDeactivatedInvestments()
  })

  watch( [metadata.value.page, metadata.value.pageSize], // Watch only page and pageSize
    () => {
        // debouncedGetProperties(); // Use the debounced version here
        fetchDeactivatedInvestments()
    }
);


  return {
    deactivatedInvestments,
    loading,
    metadata
  };
};
