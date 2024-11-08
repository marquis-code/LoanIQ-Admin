import { ref } from 'vue';
import { investment_products_api } from '@/api_factory/modules/investments_products';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

export const useFetchInvestmentProduct = () => {
    const loading = ref(false);
    const investmentProduct = ref(null);
    const { $_get_investment_product } = investment_products_api

    const fetchInvestmentProduct = async (id: string) => {
        loading.value = true;
        try {
            const res = await $_get_investment_product(id);
            investmentProduct.value = res?.data || null;
        } catch (error) {
            showToast({
                title: "Error",
                message: `Error fetching investment product, ${error}`,
                toastType: "error",
                duration: 3000
              });
        } finally {
            loading.value = false;
        }
    };

    return {
        fetchInvestmentProduct,
        loading,
        investmentProduct,
    };
};
