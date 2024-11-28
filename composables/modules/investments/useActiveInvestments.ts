import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useActiveInvestments = () => {
  const loading = ref(false);
  const activeInvestments = ref<any[]>([]);

  const fetchActiveInvestments = async () => {
    loading.value = true;
    const response = await investment_api.$_active_investment() as any
    if (response.type !== "ERROR") {
      activeInvestments.value = response.data;
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error fetching active investments"}`,
        toastType: "error",
        duration: 3000,
      });
    }
    loading.value = false;
  };


  onMounted(() => {
    fetchActiveInvestments()
  })


  return {
    activeInvestments,
    loading,
  };
};
