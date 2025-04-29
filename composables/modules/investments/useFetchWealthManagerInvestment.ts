import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useFetchWealthManagerInvestments = () => {
  const route = useRoute()
  const loading = ref(false);
  const investmentsList = ref<any>(null);

  const fetchWealthManagerInvestments = async () => {
    loading.value = true;
    const response = await investment_api.$_fetch_wealth_managers_investment(route.params.id) as any
    console.log(response, 'response here')
    loading.value = false;

    if (response.type !== "ERROR") {
      investmentsList.value = response?.data?.data?.activeInvestments || [];
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error fetching investments"}`,
        toastType: "error",
        duration: 3000,
      });
    }
  };

  onMounted(() => {
    if(route.params.id){
        fetchWealthManagerInvestments()
    }
  })

  return {
    investmentsList,
    fetchWealthManagerInvestments,
    loading,
  };
};
