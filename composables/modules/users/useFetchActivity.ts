import { ref } from "vue";
import { users_api } from "~/api_factory/modules/customer-mgt";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useGetActivities = () => {
    const loading = ref(false);
    const activities = ref([]);
    const metadata = ref({
        page: 1,
        pageSize: 7,
        total: 0,
        pages: 0,
      });
    const { $_get_user_activity_logs } = users_api;
    const route = useRoute()
  
    const getActivities = async () => {
      const id = route.params.id as string
      loading.value = true;
      try {
        const response = await $_get_user_activity_logs(id, metadata.value) as any
        if (response.type !== "ERROR") {
          console.log(response?.data, 'Activity logs')
          const { page, pageSize, total, pages } = response?.data || {};
          metadata.value = { page, pageSize, total, pages };
          activities.value = response?.data?.data?.activities ?? [];
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
          message: "An unexpected error occurred while retrieving activities details.",
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };

    onMounted(() => {
      getActivities()
    })

    watch( [metadata.value.page, metadata.value.pageSize], // Watch only page and pageSize
        () => {
            getActivities()
        }
    );
  
    return {
      getActivities,
      activities,
      loading,
    };
  };
  