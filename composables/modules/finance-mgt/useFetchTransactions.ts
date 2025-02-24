import { ref, onMounted } from "vue"
import { finance_api } from '@/api_factory/modules/finance-mgt'

export const useFetchTransactions = () => {
  const loading = ref(false);
  const transactions = ref<any[]>([]);
  const { $_get_transactions } = finance_api

  // Set a default value for total and totalPages
  const paginationObj = ref({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })

  const fetchTransactions = async () => {
    loading.value = true;
    try {
      const res = await $_get_transactions() as any;
      console.log(res, 'res here');
      if (res.type !== 'ERROR') {
        transactions.value = res?.data?.data?.transactions || [];
        const { page, pageSize, total, totalPages } = res?.data?.data;
        // Update the pagination object with the destructured values
        paginationObj.value = { page, pageSize, total, totalPages };
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchTransactions();
  });

  return { fetchTransactions, transactions, loading, paginationObj };
};
