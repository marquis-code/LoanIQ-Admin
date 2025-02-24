import { finance_api } from '@/api_factory/modules/finance-mgt'

export const useFetchRevenueStreamAnalytics = () => {
    const loading = ref(false);
    const revenueAnalytics = ref<any>(null);
    const { $_get_revenue_stream_analytics } = finance_api
  
    const fetchRevenueStreamAnalytics = async () => {
      loading.value = true;
      try {
        const res = await $_get_revenue_stream_analytics() as any
        if (res.type !== 'ERROR') {
          revenueAnalytics.value = res?.data?.data;
        }
      } catch (error) {
        console.error('Error fetching revenue analytics:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchRevenueStreamAnalytics()
    })
  
    return { fetchRevenueStreamAnalytics, revenueAnalytics, loading };
  };
  