import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment"
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useCompletedInvestments = () => {
  const loading = ref(false);
  const completedInvestments = ref<any[]>([]);

  const fetchCompletedInvestments = async () => {
    loading.value = true;
    const response = await investment_api.$_completed_investment() as any

    if (response.type !== "ERROR") {
      completedInvestments.value = response.data;
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

  return {
    completedInvestments,
    fetchCompletedInvestments,
    loading,
  };
};
