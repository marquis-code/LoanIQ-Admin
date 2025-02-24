import { ref } from "vue";
import { users_api } from "~/api_factory/modules/customer-mgt";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useUnblockUser = () => {
    const loading = ref(false);
    const { $_unblock_user } = users_api;
  
    const unblockUser = async (id: string) => {
      loading.value = true;
      try {
        const response = await $_unblock_user(id) as any
        if (response.type !== "ERROR") {
          showToast({
            title: "Success",
            message: "User unblocked successfully.",
            toastType: "success",
            duration: 3000,
          });
        } else {
          showToast({
            title: "Error",
            message: `${response.data.message || 'Error unblocking user'}`,
            toastType: "error",
            duration: 3000,
          });
        }
      } catch (error) {
        showToast({
          title: "Error",
          message: "An unexpected error occurred while unblocking the user.",
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };
  
    return {
      unblockUser,
      loading,
    };
  };
  