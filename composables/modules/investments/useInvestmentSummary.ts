import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useInvestmentSummary = () => {
  const route = useRoute()
  const loading = ref(false);
  const investmentSummary = ref<any>(null);

  const fetchInvestmentSummary = async () => {
    loading.value = true;
    const response = await investment_api.$_investment_summary(route.params.id) as any
    console.log(response, 'response here')
    loading.value = false;

    if (response.type !== "ERROR") {
      investmentSummary.value = response.data.data || {};
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error fetching investment summary"}`,
        toastType: "error",
        duration: 3000,
      });
    }
  };

  onMounted(() => {
    fetchInvestmentSummary()
  })

  return {
    investmentSummary,
    fetchInvestmentSummary,
    loading,
  };
};
