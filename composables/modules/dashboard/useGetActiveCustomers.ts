import { dashboard_api } from '@/api_factory/modules/dashboard'

export const useFetchActiveCustomers = () => {
    const loading = ref(false);
    const activeCustomers = ref({} as any);
    const { $_get_dashboard_active_users } = dashboard_api;
    const getActiveCustomers = async () => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_active_users() as any;
    
            if (res.type !== 'ERROR') {
                activeCustomers.value = res?.data?.result
            }
        } catch (error) {
            // console.error('Error getting profile object', error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getActiveCustomers()
    })
    return {
        getActiveCustomers,
        loading,
        activeCustomers
    };
};
