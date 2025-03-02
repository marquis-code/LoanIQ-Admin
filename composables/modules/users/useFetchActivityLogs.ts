import { ref } from "vue";
import { users_api } from "~/api_factory/modules/customer-mgt";
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useGetActivitiesLogs = () => {
    const loading = ref(false);
    const activitiesLogs = ref([]);
    const metadata = ref({
        page: 1,
        pageSize: 7,
        total: 0,
        pages: 0,
    });
    const { $_get_user_session_activity_logs } = users_api;
    const { showToast } = useCustomToast();
    // const route = useRoute()
    // const id = route.params.id as string
  
    const getActivitiesLogs = async (id: string) => {
      loading.value = true;
      try {
        // Ensure page and pageSize are always defined with fallback values
        const params = {
          page: metadata.value.page || 1,
          pageSize: metadata.value.pageSize || 7,
          total: metadata.value.total,
          pages: metadata.value.pages
        };
        
        const response = await $_get_user_session_activity_logs(id, params) as any;
        
        if (response.type !== "ERROR") {
          console.log(response?.data, 'Activity logs');
          // Update metadata with response values or keep current values if undefined
          const { page, pageSize, total, pages } = response?.data || {};
          metadata.value = { 
            page: page || metadata.value.page, 
            pageSize: pageSize || metadata.value.pageSize, 
            total: total || 0, 
            pages: pages || 0 
          };
          activitiesLogs.value = response?.data?.data?.activities ?? [];
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
          message: "An unexpected error occurred while retrieving activitiesLogs details.",
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };

    // onMounted(() => {
    //   getActivitiesLogs()
    // })

    // watch( [metadata.value.page, metadata.value.pageSize], // Watch only page and pageSize
    //     () => {
    //         getActivitiesLogs()
    //     }
    // );
  
    return {
      getActivitiesLogs,
      activitiesLogs,
      loading,
      metadata, // Exposing metadata so it can be used outside
    };
};