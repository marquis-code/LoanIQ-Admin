import { investment_api } from '@/api_factory/modules/investment'

export const useUpdateTopupStatus = () => {
    const loading = ref(false);
    const approvalResult = ref<any>(null);
    const { $_approve__reject_topup_investment } = investment_api;
  
    const updateTopupStatus = async (actionId: string, payload: any) => {
      const payloadObj = { action: payload.action, comment: payload.comment }
      loading.value = true;
      try {
        const res = await $_approve__reject_topup_investment(actionId, payloadObj) as any
        if (res.type !== 'ERROR') {
          approvalResult.value = res?.data?.result;
        }
        return res.data
      } catch (error) {
        console.error('Error approving/rejecting topup:', error);
      } finally {
        loading.value = false;
      }
    };
  
    return { updateTopupStatus, approvalResult, loading };
  };