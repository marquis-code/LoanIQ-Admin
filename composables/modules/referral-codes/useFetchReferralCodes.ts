import { referral_api } from '@/api_factory/modules/referrals';

export const useFetchReferralCodes = () => {
  const loading = ref(false);
  const referralCodes = ref<any[]>([]);
  const { $_fetch_referral_codes } = referral_api;

  const fetchReferralCodes = async () => {
    loading.value = true;
    try {
      const res = await $_fetch_referral_codes() as any
      console.log(res, 'codes')
      if (res.type !== 'ERROR') {
        referralCodes.value = res?.data?.data?.codesWithUserCounts || [];
      }
    } catch (error) {
      console.error('Error fetching referral codes:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchReferralCodes();
  });

  return { fetchReferralCodes, referralCodes, loading };
};
