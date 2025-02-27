import { dashboard_api } from '@/api_factory/modules/dashboard'

export const useFetchActiveInvestments = () => {
    const loading = ref(false);
    const activeInvestments = ref({} as any);
    const { $_get_dashboard_active_investments } = dashboard_api;
    const getActiveInvestments = async () => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_active_investments() as any;
    
            if (res.type !== 'ERROR') {
                activeInvestments.value = res?.data?.result
            }
        } catch (error) {
            // console.error('Error getting profile object', error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getActiveInvestments()
    })

    return {
        getActiveInvestments,
        loading,
        activeInvestments
    };
};
