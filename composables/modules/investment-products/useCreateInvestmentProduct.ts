import { ref } from 'vue';
import { investment_products_api } from '@/api_factory/modules/investments_products';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

export const useCreateInvestmentProduct = () => {
    const loading = ref(false);
    const { $_create_investment_product } = investment_products_api;

    const createInvestmentProduct = async (payload: Record<string, any>) => {
        loading.value = true;
        try {
            await $_create_investment_product(payload);
            showToast({
                title: "Success",
                message: 'Investment product was created successfully.',
                toastType: "success",
                duration: 3000
              });
        } catch (error) {
            showToast({
                title: "Error",
                message: `Error creating investment product, ${error}`,
                toastType: "error",
                duration: 3000
              });
        } finally {
            loading.value = false;
        }
    };

    return {
        createInvestmentProduct,
        loading,
    };
};
