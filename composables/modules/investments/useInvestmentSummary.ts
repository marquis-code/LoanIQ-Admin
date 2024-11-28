import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useInvestmentSummary = () => {
  const loading = ref(false);
  const investmentSummary = ref<any>(null);

  const fetchInvestmentSummary = async (id: string) => {
    loading.value = true;
    const response = await investment_api.$_investment_summary(id) as any
    loading.value = false;

    if (response.type !== "ERROR") {
      investmentSummary.value = response.data;
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error fetching investment summary"}`,
        toastType: "error",
        duration: 3000,
      });
    }
  };

  return {
    investmentSummary,
    fetchInvestmentSummary,
    loading,
  };
};
