import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment";
import { useCustomToast } from "@/composables/core/useCustomToast";
// import router from "#app/plugins/router";

export const useTopupInvestment = () => {
  const { showToast } = useCustomToast();
  const loading = ref(false);
  
  const payload = ref({
    principal: 0,
    interestRate: "",
  });

  const topupInvestment = async (investmentId: string) => {
    loading.value = true;
    const route = useRoute()
    const router = useRouter()
    
    try {
      const response = await investment_api.$_topup_investment(route.params.id, payload.value);

      if (response.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Investment was topped up successfully.",
          toastType: "success",
          duration: 3000,
        });
        router.push(`/dashboard/investment-mgt/clients`);
        return response.data;
      } else {
        showToast({
          title: "Error",
          message: `${response.data?.message || "Error topping up investment"}`,
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

  const setTopupPayload = (data: { principal: number, interestRate: string }) => {
    payload.value.principal = data.principal;
    payload.value.interestRate = data.interestRate;
  };

  return {
    topupInvestment,
    loading,
    payload,
    setTopupPayload
  };
};