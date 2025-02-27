import { dashboard_api } from '@/api_factory/modules/dashboard'

export const useFetchInvestmentsPendingApprovals = () => {
    const loading = ref(false);
    const pendingApprovalsList = ref({} as any);
    const { $_get_dashboard_pending_approvals } = dashboard_api;
    const getInvestmentsPendingApprovals = async () => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_pending_approvals() as any;
    
            if (res.type !== 'ERROR') {
                pendingApprovalsList.value = res?.data?.result
            }
        } catch (error) {
            // console.error('Error getting profile object', error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getInvestmentsPendingApprovals()
    })
    return {
        getInvestmentsPendingApprovals,
        loading,
        pendingApprovalsList
    };
};
