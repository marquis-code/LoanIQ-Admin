import { ref } from "vue";
import { investment_products_api } from "@/api_factory/modules/investments_products";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useDeleteInvestmentProduct = () => {
    const loading = ref(false);
    const { $_delete_investment_product } = investment_products_api;
  
    const deleteProduct = async (id: string) => {
      loading.value = true;
      const response = await $_delete_investment_product(id) as any
      if (response.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Investment product was deleted successfully.",
          toastType: "success",
          duration: 3000,
        });
      } else {
        showToast({
          title: "Error",
          message: `${response.data.message || 'Error deleting investment product'}`,
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };
  
    return {
      deleteProduct,
      loading,
    };
  };