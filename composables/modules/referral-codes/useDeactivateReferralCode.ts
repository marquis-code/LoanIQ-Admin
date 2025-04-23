import { referral_api } from '@/api_factory/modules/referrals';

export const useDeactivateReferralCode = () => {
  const loading = ref(false);
  const response = ref<any>(null);
  const { $_deactivate_referral_code } = referral_api;

  const deactivateReferralCode = async (id: string) => {
    loading.value = true;
    try {
      const res = await $_deactivate_referral_code(id) as any
      if (res.type !== 'ERROR') {
        response.value = res?.data || null;
      }
    } catch (error) {
      console.error('Error deactivating referral code:', error);
    } finally {
      loading.value = false;
    }
  };

  return { deactivateReferralCode, response, loading };
};
