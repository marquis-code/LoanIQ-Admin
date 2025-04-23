import { referral_api } from '@/api_factory/modules/referrals';

export const useCreateReferralCode = () => {
  const loading = ref(false);
  const response = ref<any>(null);
  const { $_create_referral_code } = referral_api;

  const createReferralCode = async (payload: { name: string, email: string, code: string }) => {
    loading.value = true;
    try {
      const res = await $_create_referral_code(payload) as any
      if (res.type !== 'ERROR') {
        response.value = res?.data || null;
      }
    } catch (error) {
      console.error('Error creating referral code:', error);
    } finally {
      loading.value = false;
    }
  };

  return { createReferralCode, response, loading };
};
