import { ref } from "vue";
import { users_api } from "~/api_factory/modules/customer-mgt";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useGetSessionLogs = () => {
    const loading = ref(false);
    const sessionLogs = ref([]);
    const metadata = ref({
        page: 1,
        pageSize: 7,
        total: 0,
        pages: 0,
      });
    const { $_get_user_session_logs } = users_api;
    const route = useRoute()
  
    const getSessionLogs = async () => {
      const id = route.params.id as string
      loading.value = true;
      try {
        const response = await $_get_user_session_logs(id, metadata.value) as any
        if (response.type !== "ERROR") {
          console.log(response?.data, 'Session logs')
          const { page, pageSize, total, pages } = response?.data || {};
          metadata.value = { page, pageSize, total, pages };
          sessionLogs.value = response?.data?.data?.sessions ?? [];
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
          message: "An unexpected error occurred while retrieving sessionLogs details.",
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };

    onMounted(() => {
      getSessionLogs()
    })

    watch( [metadata.value.page, metadata.value.pageSize], // Watch only page and pageSize
        () => {
            getSessionLogs()
        }
    );
  
    return {
      getSessionLogs,
      sessionLogs,
      loading,
    };
  };
  