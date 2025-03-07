import { dashboard_api } from '@/api_factory/modules/dashboard';
import { ref, onMounted } from 'vue';

export const useFetchTotalWalletBalance = () => {
    const loading = ref(false);
    const totalWalletBalance = ref({} as any);
    const { $_get_dashboard_total_wallet_balance } = dashboard_api;
    
    const filter = ref<'YTD' | 'MTD' | 'WTD' | 'Today' | null>(null);
    
    const getTotalWalletBalance = async () => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_total_wallet_balance(filter.value ? filter.value : undefined) as any;
           console.log(res?.data?.data?.totalWalletBalance, 'fghjkl')
            if (res.type !== 'ERROR') {
                totalWalletBalance.value = res?.data?.data?.walletBalance;
            }
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getTotalWalletBalance();
    });

                // Watch for changes in filter and refetch data
                watch(filter, () => {
                    getTotalWalletBalance();
                });

    return {
        getTotalWalletBalance,
        loading,
        totalWalletBalance,
        filter, // Expose filter to change dynamically
    };
};
