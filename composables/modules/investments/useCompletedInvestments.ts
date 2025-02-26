import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment"
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

const completedInvestments = ref<any[]>([]);

export const useCompletedInvestments = () => {
  const loading = ref(false);
  const metadata = ref({
    page: 1,
    pageSize: 7,
    total: 0,
    pages: 0,
  });


  const fetchCompletedInvestments = async () => {
    loading.value = true;
    const response = await investment_api.$_completed_investment(metadata.value) as any

    if (response.type !== "ERROR") {
      const { page, pageSize, total, pages } = response?.data?.data || {};
      completedInvestments.value = response?.data?.data?.activeInvestments;
      metadata.value = { page, pageSize, total, pages };
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error fetching completed investments"}`,
        toastType: "error",
        duration: 3000,
      });
    }
    loading.value = false;
  };

  onMounted(() => {
    fetchCompletedInvestments()
  })



  watch( [metadata.value.page, metadata.value.pageSize], // Watch only page and pageSize
    () => {
        // debouncedGetProperties(); // Use the debounced version here
        fetchCompletedInvestments()
    }
);

  return {
    completedInvestments,
    fetchCompletedInvestments,
    loading,
    metadata
  };
};
