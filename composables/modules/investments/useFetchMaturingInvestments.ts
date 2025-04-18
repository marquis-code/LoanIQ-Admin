import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useMaturingInvestments = () => {
  const route = useRoute()
  const loading = ref(false);
  const investmentsList = ref<any>(null);

  const fetchMaturingInvestments = async () => {
    loading.value = true;
    const response = await investment_api.$_get_maturing_investments() as any
    console.log(response, 'response here')
    loading.value = false;

    if (response.type !== "ERROR") {
      investmentsList.value = response?.data?.data?.investments || [];
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error fetching maturing investments"}`,
        toastType: "error",
        duration: 3000,
      });
    }
  };

  onMounted(() => {
    fetchMaturingInvestments()
  })

  return {
    investmentsList,
    fetchMaturingInvestments,
    loading,
  };
};
