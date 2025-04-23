import { referral_api } from '@/api_factory/modules/referrals';

export const useUpdateReferralCode = () => {
  const loading = ref(false);
  const response = ref<any>(null);
  const { $_update_referral_code } = referral_api;

  const updateReferralCode = async (id: string, payload: { name: string }) => {
    loading.value = true;
    try {
      const res = await $_update_referral_code(id, payload) as any
      if (res.type !== 'ERROR') {
        response.value = res?.data || null;
      }
    } catch (error) {
      console.error('Error updating referral code:', error);
    } finally {
      loading.value = false;
    }
  };

  return { updateReferralCode, response, loading };
};
