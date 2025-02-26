import { dashboard_api } from '@/api_factory/modules/dashboard'

export const useFetchLiquidatedInvestments = () => {
    const loading = ref(false);
    const liquidatedInvestments = ref({} as any);
    const { $_get_dashboard_pending_approvals } = dashboard_api;
    const getLiquidatedInvestments = async (id: any) => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_pending_approvals() as any;
    
            if (res.type !== 'ERROR') {
                liquidatedInvestments.value = res?.data?.result
            }
        } catch (error) {
            // console.error('Error getting profile object', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        getLiquidatedInvestments,
        loading,
        liquidatedInvestments
    };
};
