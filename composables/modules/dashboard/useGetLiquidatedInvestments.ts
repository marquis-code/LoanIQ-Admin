import { dashboard_api } from '@/api_factory/modules/dashboard';
import { ref, onMounted } from 'vue';

export const useFetchLiquidatedInvestments = () => {
    const loading = ref(false);
    const liquidatedInvestments = ref({} as any);
    const { $_get_dashboard_liquidatd_investments } = dashboard_api;
    
    const filter = ref<'YTD' | 'MTD' | 'WTD' | 'Today' | null>(null);
    
    const getLiquidatedInvestments = async () => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_liquidatd_investments(filter.value ? filter.value : undefined) as any;
           console.log(res?.data?.data?.liquidatedInvestments, 'fghjkl')
            if (res.type !== 'ERROR') {
                liquidatedInvestments.value = res?.data?.data?.liquidatedInvestments;
            }
        } catch (error) {
            console.error('Error fetching liquidated investments:', error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getLiquidatedInvestments();
    });

                // Watch for changes in filter and refetch data
                watch(filter, () => {
                    getLiquidatedInvestments();
                });

    return {
        getLiquidatedInvestments,
        loading,
        liquidatedInvestments,
        filter, // Expose filter to change dynamically
    };
};
