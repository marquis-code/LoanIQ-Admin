import { dashboard_api } from '@/api_factory/modules/dashboard'

const dashboardAnalytics = ref({} as any);
export const useFetchDashboardAnalytics = () => {
    const loading = ref(false);
    const { $_get_dashboard_analytics } = dashboard_api;
    const getDashboardAnalytics = async () => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_analytics() as any;
            if (res.type !== 'ERROR') {
                console.log(res?.data?.data, 'res here')
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
