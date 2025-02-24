import { ref } from 'vue';
import { finance_api } from '@/api_factory/modules/finance-mgt'

export const useFetchAnalytics = () => {
  const loading = ref(false);
  const analyticsData = ref<any>(null);
  const { $_get_analytics } = finance_api;

  const fetchAnalytics = async () => {
    loading.value = true;
    try {
      const res = await $_get_analytics() as any
      console.log(res, 'analytice')
      if (res.type !== 'ERROR') {
        analyticsData.value = res?.data?.data;
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchAnalytics()
  })

  return { fetchAnalytics, analyticsData, loading };
};