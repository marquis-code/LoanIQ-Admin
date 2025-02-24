import { finance_api } from '@/api_factory/modules/finance-mgt'

export const useUnflagWallet = () => {
    const loading = ref(false);
    const unflagResult = ref<any>(null);
    const { $_unflag_wallet } = finance_api;
  
    const unflagWallet = async (walletId: string) => {
      loading.value = true;
      try {
        const res = await $_unflag_wallet(walletId) as any
        if (res.type !== 'ERROR') {
          unflagResult.value = res?.data?.result;
        }
      } catch (error) {
        console.error('Error unflagging wallet:', error);
      } finally {
        loading.value = false;
      }
    };
  
    return { unflagWallet, unflagResult, loading };
  };
  