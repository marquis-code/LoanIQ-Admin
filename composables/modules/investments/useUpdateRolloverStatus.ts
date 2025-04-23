import { investment_api } from '@/api_factory/modules/investment'

export const useUpdateRolloverStatus = () => {
    const loading = ref(false);
    const approvalResult = ref<any>(null);
    const { $_approve_reject_rollover_investment } = investment_api;
  
    const updateRolloverStatus = async (actionId: string, status: any) => {
      loading.value = true;
      try {
        const res = await $_approve_reject_rollover_investment(actionId, { status: status.status === 'completed' ? 'approved' : 'rejected' }) as any
        if (res.type !== 'ERROR') {
          approvalResult.value = res?.data?.result;
        }
      } catch (error) {
        console.error('Error approving/rejecting ollover:', error);
      } finally {
        loading.value = false;
      }
    };
  
    return { updateRolloverStatus, approvalResult, loading };
  };