import { ref } from "vue";
import { investment_products_api } from "@/api_factory/modules/investments_products";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useArchiveInvestmentProduct = () => {
    const loading = ref(false);
    const { $_archive_investment_product } = investment_products_api;
  
    const archiveInvestmentProduct = async (id: string) => {
      loading.value = true;
      const response = await $_archive_investment_product(id) as any
      if (response.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Investment product was archived successfully.",
          toastType: "success",
          duration: 3000,
        });
      } else {
        showToast({
          title: "Error",
          message: `${response.data.message || 'Error archiving investment product'}`,
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };
  
    return {
      archiveInvestmentProduct,
      loading,
    };
  };