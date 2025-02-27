import { dashboard_api } from '@/api_factory/modules/dashboard'

export const useFetchDashboardAnalytics = () => {
    const loading = ref(false);
    const dashboardAnalytics = ref({} as any);
    const { $_get_dashboard_analytics } = dashboard_api;
    const getDashboardAnalytics = async () => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_analytics() as any;
    
            if (res.type !== 'ERROR') {
                dashboardAnalytics.value = res?.data?.data || {}
            }
        } catch (error) {
            // console.error('Error getting profile object', error);
        } finally {
            loading.value = false;
        }
    };


    onMounted(() => {
        getDashboardAnalytics()
    })
    return {
        getDashboardAnalytics,
        loading,
        dashboardAnalytics
    };
};
