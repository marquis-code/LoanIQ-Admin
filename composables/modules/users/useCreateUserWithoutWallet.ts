import { ref } from "vue";
import { users_api } from "~/api_factory/modules/customer-mgt";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useCreateUserWithoutWallet = () => {
    const loading = ref(false);
    const { $_create_user_without_wallet } = users_api;
  
    const createUserWithoutWallet = async (payload: any) => {
      loading.value = true;
      try {
        const response = await $_create_user_without_wallet(payload) as any
        if (response.type !== "ERROR") {
          showToast({
            title: "Success",
            message: "User created successfully.",
            toastType: "success",
            duration: 3000,
          });
        } else {
          showToast({
            title: "Error",
            message: `${response.data.message || 'Error creating user'}`,
            toastType: "error",
            duration: 3000,
          });
        }
      } catch (error) {
        showToast({
          title: "Error",
          message: "An unexpected error occurred while creating user.",
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };
  
    return {
      createUserWithoutWallet,
      loading,
    };
  };
  