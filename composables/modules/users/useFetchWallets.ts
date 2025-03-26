import { ref } from 'vue';
import { users_api } from '@/api_factory/modules/customer-mgt'

export const useFetchWallets = () => {
  const loading = ref(false);
  const walletList = ref<any>(null);
  const { $_get_wallets } = users_api;

  const fetchWallets = async () => {
    loading.value = true;
    try {
      const res = await $_get_wallets() as any
      console.log(res, 'analytice')
      if (res.type !== 'ERROR') {
        walletList.value = res?.data?.data;
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchWallets()
  })

  return { fetchWallets, walletList, loading };
};