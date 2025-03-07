import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment";
import { useCustomToast } from "@/composables/core/useCustomToast";
import router from "#app/plugins/router";

export const useRolloverInvestment = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false);
  
  const payload = ref({
    newTenor: 3,
    rolloverAmount: "",
    interestRate: ""
  });

  const rolloverInvestment = async () => {
    loading.value = true;
    const route = useRoute()
    
    try {
      const response = await investment_api.$_rollover_investment(route.params.id, payload.value);

      if (response.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Investment was rolled over successfully.",
          toastType: "success",
          duration: 3000,
        });
        router.push(`/investments`);
        return response.data;
      } else {
        showToast({
          title: "Error",
          message: `${response.data?.message || "Error rolling over investment"}`,
          toastType: "error",
          duration: 3000,
        });
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: error.message || "An unexpected error occurred",
        toastType: "error",
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  const setRolloverPayload = (data: { newTenor: number,  interestRate: string, rolloverAmount: string }) => {
    payload.value.newTenor = data.newTenor;
    payload.value.rolloverAmount = data.rolloverAmount;
    payload.value.interestRate = data.interestRate;
  };

  return {
    rolloverInvestment,
    loading,
    payload,
    setRolloverPayload
  };
};