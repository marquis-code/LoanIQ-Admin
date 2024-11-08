import { ref } from 'vue';
import { investment_products_api } from '@/api_factory/modules/investments_products';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

export const useDeleteInvestmentProduct = () => {
    const loading = ref(false);
    const { $_delete_investment_product } = investment_products_api;

    const deleteInvestmentProduct = async (id: string) => {
        loading.value = true;
        try {
            await $_delete_investment_product(id);
            showToast({
                title: "Success",
                message: 'Investment product was deleted successfully.',
                toastType: "success",
                duration: 3000
              });
        } catch (error) {
            showToast({
                title: "Error",
                message: `Error deleting investment product, ${error}`,
                toastType: "error",
                duration: 3000
              });
        } finally {
            loading.value = false;
        }
    };

    return {
        deleteInvestmentProduct,
        loading,
    };
};
