import { investment_api } from '@/api_factory/modules/investment'

export const useApproveRejectLiquidateInvestment = () => {
    const loading = ref(false);
    const approvalResult = ref<any>(null);
    const { $_approve_reject_liquidate_investment } = investment_api;
  
    const approveRejectLiquidateInvestment = async (investmentId: string, payload: any) => {
      loading.value = true;
      const payloadObj = { action: payload.action, comment: payload.comment }
      try {
        const res = await $_approve_reject_liquidate_investment(investmentId, payloadObj) as any
        if (res.type !== 'ERROR') {
          approvalResult.value = res?.data?.result;
        }
        return res.data
      } catch (error) {
        console.error('Error approving/rejecting investment liquidation:', error);
      } finally {
        loading.value = false;
      }
    };
  
    return { approveRejectLiquidateInvestment, approvalResult, loading };
  };