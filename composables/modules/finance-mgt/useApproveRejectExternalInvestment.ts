import { finance_api } from '@/api_factory/modules/finance-mgt'

export const useApproveRejectExternalInvestment = () => {
    const loading = ref(false);
    const approvalResult = ref<any>(null);
    const { $_approve_reject_external_investment } = finance_api;
  
    const approveRejectExternalInvestment = async (investmentId: string, payload: any) => {
      loading.value = true;
      const payloadObj = { action: payload.action, comment: payload.comment } as any
      try {
        const res = await $_approve_reject_external_investment(investmentId, payloadObj) as any
        if (res.type !== 'ERROR') {
          approvalResult.value = res?.data?.result;
        }
        return res.data
      } catch (error) {
        console.error('Error approving/rejecting external investment:', error);
      } finally {
        loading.value = false;
      }
    };
  
    return { approveRejectExternalInvestment, approvalResult, loading };
  };