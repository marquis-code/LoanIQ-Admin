import { finance_api } from '@/api_factory/modules/finance-mgt'
export const useUpdateFlaggingStatus = () => {
    const loading = ref(false);
    const updateResult = ref<any>(null);
    const { $_update_flagging_status } = finance_api;
  
    const updateFlaggingStatus = async (walletId: string, status: string) => {
      loading.value = true;
      try {
        const res = await $_update_flagging_status(walletId, { status }) as any
        if (res.type !== 'ERROR') {
          updateResult.value = res?.data?.result;
        }
      } catch (error) {
        console.error('Error updating flagging status:', error);
      } finally {
        loading.value = false;
      }
    };
  
    return { updateFlaggingStatus, updateResult, loading };
  };