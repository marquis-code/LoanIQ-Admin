import { finance_api } from '@/api_factory/modules/finance-mgt'
export const useUpdateFlaggingStatus = () => {
    const loading = ref(false);
    const updateResult = ref<any>(null);
    const { $_update_flagging_status } = finance_api;
  
    const updateFlaggingStatus = async (walletId: string, payload: any) => {
      loading.value = true;
      const payloadObj = { action: payload.action, comment: payload.comment } as any
      const res = await $_update_flagging_status(walletId, payloadObj) as any
      if (res.type !== 'ERROR') {
          updateResult.value = res?.data?.result;
        }
        
        loading.value = false
        return res.data
    };
  
    return { updateFlaggingStatus, updateResult, loading };
  };