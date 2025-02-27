import { dashboard_api } from '@/api_factory/modules/dashboard'

export const useFetchLiquidatedInvestments = () => {
    const loading = ref(false);
    const liquidatedInvestments = ref({} as any);
    const { $_get_dashboard_liquidatd_investments } = dashboard_api;
    const getLiquidatedInvestments = async () => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_liquidatd_investments() as any;
    
            if (res.type !== 'ERROR') {
                liquidatedInvestments.value = res?.data?.result
            }
        } catch (error) {
            // console.error('Error getting profile object', error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getLiquidatedInvestments()
    })

    return {
        getLiquidatedInvestments,
        loading,
        liquidatedInvestments
    };
};
