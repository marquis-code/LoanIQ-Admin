import { investment_api } from '@/api_factory/modules/investment'

export const useApproveRejectCreateInvestment = () => {
    const loading = ref(false);
    const approvalResult = ref<any>(null);
    const { $_approve_reject_create_investment } = investment_api;
  
    const updateInvestmentCreationStatus = async (investmentId: string, status: any) => {
      loading.value = true;
      try {
        const res = await $_approve_reject_create_investment(investmentId, { status: status.status === 'completed' ? 'approved' : 'rejected' }) as any
        if (res.type !== 'ERROR') {
          approvalResult.value = res?.data?.result;
        }
      } catch (error) {
        console.error('Error approving/rejecting investment liquidation:', error);
      } finally {
        loading.value = false;
      }
    };
  
    return { updateInvestmentCreationStatus, approvalResult, loading };
  };