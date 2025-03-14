import { ref } from "vue";
import { admin_api } from "@/api_factory/modules/admin";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useDeleteAdmin = () => {
    const loading = ref(false);
    const { $_delete_admin } = admin_api;
  
    const deleteAdmin = async (id: string) => {
      loading.value = true;
      const response = await $_delete_admin(id) as any
      if (response.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Admin deleted successfully.",
          toastType: "success",
          duration: 3000,
        });
      } else {
        showToast({
          title: "Error",
          message: `${response.data.message || 'Error deleting admin'}`,
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
      return response
    };
  
    return {
      deleteAdmin,
      loading,
    };
  };