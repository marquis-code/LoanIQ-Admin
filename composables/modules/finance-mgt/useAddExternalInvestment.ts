import { finance_api } from '@/api_factory/modules/finance-mgt'
export const useAddExternalInvestment = () => {
    const loading = ref(false);
    const addInvestmentResult = ref<any>(null);
    const { $_add_external_investments } = finance_api;
  
    const addExternalInvestment = async (investment: any) => {
      loading.value = true;
      try {
        const res = await $_add_external_investments(investment) as any
        if (res.type !== 'ERROR') {
          addInvestmentResult.value = res?.data?.result;
        }
      } catch (error) {
        console.error('Error adding external investment:', error);
      } finally {
        loading.value = false;
      }
    };
  
    return { addExternalInvestment, addInvestmentResult, loading };
  };
  