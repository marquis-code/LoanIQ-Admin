import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useGetRemainingAmount = () => {
  const loading = ref(false);
  const remainingAmount = ref<any>(null);

  const fetchRemainingAmount = async (amount: any, payload: any) => {
    loading.value = true;
    const response = await investment_api.$_get_remaining_amount(amount, payload) as any
    loading.value = false;

    if (response.type !== "ERROR") {
      remainingAmount.value = response.data;
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error fetching remaining amount"}`,
        toastType: "error",
        duration: 3000,
      });
    }
  };

  return {
    remainingAmount,
    fetchRemainingAmount,
    loading,
  };
};
