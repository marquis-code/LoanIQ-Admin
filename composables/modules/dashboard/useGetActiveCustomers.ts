import { dashboard_api } from '@/api_factory/modules/dashboard'

export const useFetchActiveCustomers = () => {
    const loading = ref(false);
    const activeCustomers = ref({} as any);
    const { $_get_dashboard_pending_approvals } = dashboard_api;
    const getActiveCustomers = async (id: any) => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_pending_approvals() as any;
    
            if (res.type !== 'ERROR') {
                activeCustomers.value = res?.data?.result
            }
        } catch (error) {
            // console.error('Error getting profile object', error);
        } finally {
            loading.value = false;
        }
    };

    return {
        getActiveCustomers,
        loading,
        activeCustomers
    };
};
