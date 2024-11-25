import { ref } from "vue";
import { admin_api } from "@/api_factory/modules/admin";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useBlockAdmin = () => {
    const loading = ref(false);
    const { $_block_admins } = admin_api;
  
    const blockAdmin = async (id: string) => {
      loading.value = true;
      const response = await $_block_admins(id) as any
      if (response.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Admin blocked successfully.",
          toastType: "success",
          duration: 3000,
        });
      } else {
        showToast({
          title: "Error",
          message: `${response.data.message || 'Error blocking admin'}`,
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };
  
    return {
      blockAdmin,
      loading,
    };
  };