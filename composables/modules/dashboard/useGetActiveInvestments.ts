import { dashboard_api } from '@/api_factory/modules/dashboard'

export const useFetchActiveInvestments = () => {
    const loading = ref(false);
    const activeInvestments = ref({} as any);
    const { $_get_dashboard_active_investments } = dashboard_api;
    
    const filter = ref<'YTD' | 'MTD' | 'WTD' | 'Today' | null>(null);
    
    const getActiveInvestments = async () => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_active_investments(filter.value ? filter.value : undefined) as any;
            console.log(res?.data?.data, 'res here')
            if (res.type !== 'ERROR') {
                activeInvestments.value = res?.data?.data?.activeInvestments;
            }
        } catch (error) {
            console.error('Error fetching active investments:', error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getActiveInvestments();
    });


            // Watch for changes in filter and refetch data
            watch(filter, () => {
                getActiveInvestments();
            });

    return {
        getActiveInvestments,
        loading,
        activeInvestments,
        filter, // Expose filter to change dynamically
    };
};
