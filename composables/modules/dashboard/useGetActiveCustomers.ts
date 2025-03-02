import { dashboard_api } from '@/api_factory/modules/dashboard'

export const useFetchActiveCustomers = () => {
    const loading = ref(false);
    const activeCustomers = ref({} as any);
    const { $_get_dashboard_active_users } = dashboard_api;
    
    const filter = ref<'YTD' | 'MTD' | 'WTD' | 'Today' | null>(null);
    
    const getActiveCustomers = async () => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_active_users(filter.value ? filter.value : undefined) as any;
    
            if (res.type !== 'ERROR') {
                activeCustomers.value = res?.data?.data?.activeCustomers;
            }
        } catch (error) {
            console.error('Error fetching active customers:', error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getActiveCustomers();
    });

        // Watch for changes in filter and refetch data
        watch(filter, () => {
            getActiveCustomers();
        });

    return {
        getActiveCustomers,
        loading,
        activeCustomers,
        filter, // Expose filter to change dynamically
    };
};
