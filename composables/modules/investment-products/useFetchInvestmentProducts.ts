import { ref } from 'vue';
import { investment_products_api } from '@/api_factory/modules/investments_products';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

export const useFetchInvestmentProducts = () => {
    const loading = ref(false);
    const investmentProducts = ref([] as any[]);
    const { $_get_investment_products } = investment_products_api

    const fetchInvestmentProducts = async () => {
        loading.value = true;
        try {
            const res = await $_get_investment_products();
            investmentProducts.value = res?.data || [];
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
        fetchInvestmentProducts,
        loading,
        investmentProducts,
    };
};
