import { finance_api } from '@/api_factory/modules/finance-mgt'
export const useUpdateFlaggingStatus = () => {
    const loading = ref(false);
    const updateResult = ref<any>(null);
    const { $_update_flagging_status } = finance_api;
  
    const updateFlaggingStatus = async (walletId: string, status: any) => {
      loading.value = true;
      const res = await $_update_flagging_status(walletId, { status: status.status === 'completed' ? 'approved' : 'rejected' }) as any
      if (res.type !== 'ERROR') {
          updateResult.value = res?.data?.result;
        }
        loading.value = false
        return res
    };
  
    return { updateFlaggingStatus, updateResult, loading };
  };