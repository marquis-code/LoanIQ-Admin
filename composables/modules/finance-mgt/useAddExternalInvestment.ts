import { finance_api } from '@/api_factory/modules/finance-mgt'
export const useAddExternalInvestment = () => {
    const loading = ref(false);
    const { $_add_external_investments } = finance_api;
  
    const addExternalInvestment = async (investment: any) => {
      loading.value = true;
      try {
        const res = await $_add_external_investments(investment) as any
        console.log(res,'tes ')
        if (res.status === 201 || res.status === 200) {
          window.location.reload()
          return res
        }
      } catch (error) {
        console.error('Error adding external investment:', error);
      } finally {
        loading.value = false;
      }
    };
  
    return { addExternalInvestment,  loading };
  };
  