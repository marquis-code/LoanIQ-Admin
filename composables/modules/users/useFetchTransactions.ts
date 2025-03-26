import { ref } from "vue";
import { users_api } from "~/api_factory/modules/customer-mgt";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useGetTransactions = () => {
    const loading = ref(false);
    const transactions = ref([]);
    const metadata = ref({
        page: 1,
        pageSize: 7,
        total: 0,
        pages: 0,
      });
    const { $_get_user_transactions } = users_api;
    const route = useRoute()
  
    const getTransactions = async (userId?: any) => {
      const id = route.params.id || userId
      loading.value = true;
      try {
        const response = await $_get_user_transactions(id, metadata.value) as any
        if (response.type !== "ERROR") {
          const { page, pageSize, total, pages } = response?.data?.data || {};
          metadata.value = { page, pageSize, total, pages };
          transactions.value = response?.data?.data?.data ?? [];
        } else {
          showToast({
            title: "Error",
            message: `${response.data.message || 'Error retrieving user details'}`,
            toastType: "error",
            duration: 3000,
          });
        }
      } catch (error) {
        showToast({
          title: "Error",
          message: "An unexpected error occurred while retrieving transactions details.",
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };

    onMounted(() => {
      getTransactions()
    })

    watch( [metadata.value.page, metadata.value.pageSize], // Watch only page and pageSize
        () => {
            getTransactions()
        }
    );
  
    return {
      getTransactions,
      transactions,
      loading,
    };
  };
  