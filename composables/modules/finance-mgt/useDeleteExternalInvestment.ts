import { finance_api } from '@/api_factory/modules/finance-mgt'

export const useDeleteExternalInvestment = () => {
    const loading = ref(false);
    const deleteInvestmentResult = ref<any>(null);
    const { $_delete_external_investment } = finance_api;
  
    const deleteExternalInvestment = async (investmentId: string) => {
      loading.value = true;
      try {
        const res = await $_delete_external_investment(investmentId) as any
        if (res.type !== 'ERROR') {
          deleteInvestmentResult.value = res?.data?.result;
        }
      } catch (error) {
        console.error('Error deleting external investment:', error);
      } finally {
        loading.value = false;
      }
    };
  
    return { deleteExternalInvestment, deleteInvestmentResult, loading };
  };