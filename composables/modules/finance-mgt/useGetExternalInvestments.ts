
import { finance_api } from '@/api_factory/modules/finance-mgt'

export const useFetchExternalInvestments = () => {
    const loading = ref(false);
    const externalInvestments = ref<any[]>([]);
    const { $_get_external_investments } = finance_api
  
    const fetchExternalInvestments = async () => {
      loading.value = true;
      try {
        const res = await $_get_external_investments() as any
        if (res.type !== 'ERROR') {
          console.log(res?.data, 'Investments here')
          externalInvestments.value = res?.data?.data?.investments || [];
        }
      } catch (error) {
        console.error('Error fetching external investments:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchExternalInvestments()
    })
  
    return { fetchExternalInvestments, externalInvestments, loading };
  };