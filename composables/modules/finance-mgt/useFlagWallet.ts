import { finance_api } from '@/api_factory/modules/finance-mgt'
export const useFlagWallet = () => {
  const loading = ref(false);
  const flagResult = ref<any>(null);
  const { $_flag_wallet } = finance_api

  const flagWallet = async (walletId: string) => {
    loading.value = true;
    try {
      const res = await $_flag_wallet(walletId) as any
      if (res.type !== 'ERROR') {
        flagResult.value = res?.data?.result;
      }
    } catch (error) {
      console.error('Error flagging wallet:', error);
    } finally {
      loading.value = false;
    }
  };

  return { flagWallet, flagResult, loading };
};