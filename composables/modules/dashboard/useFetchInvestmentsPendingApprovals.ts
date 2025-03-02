import { dashboard_api } from '@/api_factory/modules/dashboard'

export const useFetchInvestmentsPendingApprovals = () => {
    const loading = ref(false);
    const pendingApprovalsList = ref({} as any);
    const { $_get_dashboard_pending_approvals } = dashboard_api;
    
    const filter = ref<'YTD' | 'MTD' | 'WTD' | 'Today' | null>(null);
    
    const getInvestmentsPendingApprovals = async () => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_pending_approvals(filter.value ? filter.value : undefined) as any;
    
            if (res.type !== 'ERROR') {
                pendingApprovalsList.value = res?.data?.data?.pendingApprovalInvestment;
            }
        } catch (error) {
            console.error('Error fetching investments pending approvals:', error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getInvestmentsPendingApprovals();
    });

        
    // Watch for changes in filter and refetch data
    watch(filter, () => {
        getInvestmentsPendingApprovals();
    });

    return {
        getInvestmentsPendingApprovals,
        loading,
        pendingApprovalsList,
        filter, // Expose filter to change dynamically
    };
};