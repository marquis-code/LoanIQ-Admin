import { ref } from "vue";
import { users_api } from "@/api_factory/modules/users";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useBlockUser = () => {
    const loading = ref(false);
    const { $_block_user } = users_api;
  
    const blockUser = async (id: string) => {
      loading.value = true;
      try {
        const response = await $_block_user(id) as any
        if (response.type !== "ERROR") {
          showToast({
            title: "Success",
            message: "User blocked successfully.",
            toastType: "success",
            duration: 3000,
          });
        } else {
          showToast({
            title: "Error",
            message: `${response.data.message || 'Error blocking user'}`,
            toastType: "error",
            duration: 3000,
          });
        }
      } catch (error) {
        showToast({
          title: "Error",
          message: "An unexpected error occurred while blocking the user.",
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };
  
    return {
      blockUser,
      loading,
    };
  };
  