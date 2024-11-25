import { ref } from "vue";
import { users_api } from "@/api_factory/modules/users";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useUnflagUserAccount = () => {
    const loading = ref(false);
    const { $_unflag_user_account } = users_api;
  
    const unflagUserAccount = async (id: string) => {
      loading.value = true;
      try {
        const response = await $_unflag_user_account(id) as any
        if (response.type !== "ERROR") {
          showToast({
            title: "Success",
            message: "User account unflagged successfully.",
            toastType: "success",
            duration: 3000,
          });
        } else {
          showToast({
            title: "Error",
            message: `${response.data.message || 'Error unflagging user account'}`,
            toastType: "error",
            duration: 3000,
          });
        }
      } catch (error) {
        showToast({
          title: "Error",
          message: "An unexpected error occurred while unflagging the user account.",
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };
  
    return {
      unflagUserAccount,
      loading,
    };
  };
  