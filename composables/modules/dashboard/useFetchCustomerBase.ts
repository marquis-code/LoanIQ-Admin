import { dashboard_api } from '@/api_factory/modules/dashboard';
import { ref, onMounted } from 'vue';

export const useFetchCustomerBase = () => {
    const loading = ref(false);
    const customers = ref({} as any);
    const { $_get_dashboard_total_customer_base } = dashboard_api;
    
    const filter = ref<'YTD' | 'MTD' | 'WTD' | 'Today' | null>(null);
    
    const getCustomerBase = async () => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_total_customer_base(filter.value ? filter.value : undefined) as any;
    
            if (res.type !== 'ERROR') {
                customers.value = res?.data?.data?.totalCustomers;
            }
        } catch (error) {
            console.error('Error fetching customer base:', error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getCustomerBase();
    });

        
    // Watch for changes in filter and refetch data
    watch(filter, () => {
        getCustomerBase();
    });

    return {
        getCustomerBase,
        loading,
        customers,
        filter, // Expose filter to change dynamically
    };
};