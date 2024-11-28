import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useGetInvestmentDetails = () => {
  const loading = ref(false);
  const investmentDetails = ref<any>(null);

  const fetchInvestmentDetails = async (id: string) => {
    loading.value = true;
    const response = await investment_api.$_get_investment_details(id) as any

    if (response.type !== "ERROR") {
      investmentDetails.value = response.data;
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error fetching investment details"}`,
        toastType: "error",
        duration: 3000,
      });
    }
    loading.value = false;
  };

  return {
    investmentDetails,
    fetchInvestmentDetails,
    loading,
  };
};
