import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment";
import { useCustomToast } from "@/composables/core/useCustomToast";


export const useLiquidateInvestment = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false);
  const router = useRouter()
  
  const payload = ref({
    pre_liquidation_charge: "",
  });

  const liquidateInvestment = async (investmentId: string) => {
    loading.value = true;
    const route = useRoute()
    
    try {
      const response = await investment_api.$_liquidate_investment(investmentId, payload.value) as any

      if (response.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Investment was liquidated successfully.",
          toastType: "success",
          duration: 3000,
        });
        // router.push(`/investments`);
        return response.data;
      } else {
        showToast({
          title: "Error",
          message: `${response.data?.message || "Error liquidating investment"}`,
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

  const setLiquidatePayload = (data: { pre_liquidation_charge: string }) => {
    payload.value.pre_liquidation_charge = data.pre_liquidation_charge;
  };

  return {
    liquidateInvestment,
    loading,
    payload,
    setLiquidatePayload
  };
};