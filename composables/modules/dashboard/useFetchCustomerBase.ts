import { dashboard_api } from '@/api_factory/modules/dashboard'

export const useFetchCustomerBase = () => {
    const loading = ref(false);
    const customers = ref({} as any);
    const { $_get_dashboard_total_customer_base } = dashboard_api;
    const filter = ref({
        date: 'Today'
    })
    const getCustomerBase = async () => {
        loading.value = true;
        try {
            const res = await $_get_dashboard_total_customer_base(filter.value.date) as any;
    
            if (res.type !== 'ERROR') {
                customers.value = res?.data?.result
            }
        } catch (error) {
            // console.error('Error getting profile object', error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getCustomerBase()
    })
    return {
        getCustomerBase,
        loading,
        customers
    };
};
