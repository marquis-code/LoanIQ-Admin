import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment"
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useDeactivatedInvestments = () => {
  const loading = ref(false);
  const deactivatedInvestments = ref<any[]>([]);

  const fetchDeactivatedInvestments = async () => {
    loading.value = true;
    const response = await investment_api.$_deactivated_investment() as any

    if (response.type !== "ERROR") {
      deactivatedInvestments.value = response.data;
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

  return {
    deactivatedInvestments,
    loading,
  };
};
