import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useGetInvestmentDetails = () => {
  const route = useRoute()
  const loading = ref(false);
  const investmentDetails = ref<any>(null);

  const fetchInvestmentDetails = async () => {
    loading.value = true;
    const response = await investment_api.$_get_investment_details(route.params.id) as any

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

  onMounted(() => {
    fetchInvestmentDetails()
  })

  return {
    investmentDetails,
    fetchInvestmentDetails,
    loading,
  };
};
