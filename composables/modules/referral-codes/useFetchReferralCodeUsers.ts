import { referral_api } from '@/api_factory/modules/referrals';

export const useFetchReferralCodeUsers = () => {
  const loading = ref(false);
  const users = ref<any[]>([]);
  const { $_fetch_referral_code_users } = referral_api;

  const fetchReferralCodeUsers = async (id: string) => {
    loading.value = true;
    try {
      const res = await $_fetch_referral_code_users(id) as any
      if (res.type !== 'ERROR') {
        users.value = res?.data?.data || [];
      }
    } catch (error) {
      console.error('Error fetching referral code users:', error);
    } finally {
      loading.value = false;
    }
  };

  return { fetchReferralCodeUsers, users, loading };
};
