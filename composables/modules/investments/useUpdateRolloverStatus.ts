import { investment_api } from '@/api_factory/modules/investment'

export const useUpdateRolloverStatus = () => {
    const loading = ref(false);
    const approvalResult = ref<any>(null);
    const { $_approve_reject_rollover_investment } = investment_api;
  
    const updateRolloverStatus = async (actionId: string, payload: any) => {
      loading.value = true;
      const payloadObj = { action: payload.action, comment: payload.comment }
      try {
        const res = await $_approve_reject_rollover_investment(actionId, payloadObj) as any
        if (res.type !== 'ERROR') {
          approvalResult.value = res?.data?.result;
        }
        return res.data
      } catch (error) {
        console.error('Error approving/rejecting ollover:', error);
      } finally {
        loading.value = false;
      }
    };
  
    return { updateRolloverStatus, approvalResult, loading };
  };