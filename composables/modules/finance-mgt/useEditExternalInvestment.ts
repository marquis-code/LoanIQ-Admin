import { finance_api } from '@/api_factory/modules/finance-mgt'

export const useEditExternalInvestment = () => {
    const loading = ref(false);
    const editInvestmentResult = ref<any>(null);
    const { $_edit_external_investments } = finance_api;
  
    const editExternalInvestment = async (investmentId: string, payload: any) => {
      loading.value = true;
      try {
        const res = await $_edit_external_investments(investmentId, payload) as any
        if (res.type !== 'ERROR') {
          editInvestmentResult.value = res?.data?.result;
        }
      } catch (error) {
        console.error('Error editing external investment:', error);
      } finally {
        loading.value = false;
      }
    };
  
    return { editExternalInvestment, editInvestmentResult, loading };
  };
  