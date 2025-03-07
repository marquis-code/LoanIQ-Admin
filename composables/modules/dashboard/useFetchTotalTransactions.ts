import { dashboard_api } from '@/api_factory/modules/dashboard';
import { ref, onMounted } from 'vue';

export const useFetchTotalTransactions = () => {
    const loading = ref(false);
    const totalTransactions = ref({} as any);
    const { $_get_dashboard_total_transactions } = dashboard_api;
    
    const filter = ref<'YTD' | 'MTD' | 'WTD' | 'Today' | null>(null);
    
    const getTotalTransactions = async () => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_total_transactions(filter.value ? filter.value : undefined) as any;
           console.log(res?.data?.data?.totalTransactions, 'fghjkl')
            if (res.type !== 'ERROR') {
                totalTransactions.value = res?.data?.data?.totalTransactions;
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getTotalTransactions();
    });

                // Watch for changes in filter and refetch data
                watch(filter, () => {
                    getTotalTransactions();
                });

    return {
        getTotalTransactions,
        loading,
        totalTransactions,
        filter, // Expose filter to change dynamically
    };
};
