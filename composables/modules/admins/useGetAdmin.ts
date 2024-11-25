import { ref } from "vue";
import { admin_api } from "@/api_factory/modules/admin";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useGetAdmin = () => {
    const loading = ref(false);
    const admin = ref(null);
    const { $_get_admin } = admin_api;
  
    const getAdmin = async (id: string) => {
      loading.value = true;
      const response = await $_get_admin(id) as any
      if (response.type !== "ERROR") {
        admin.value = response.data;
        showToast({
          title: "Success",
          message: "Admin details retrieved successfully.",
          toastType: "success",
          duration: 3000,
        });
      } else {
        showToast({
          title: "Error",
          message: `${response.data.message || 'Error retrieving admin details'}`,
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };
  
    return {
      getAdmin,
      admin,
      loading,
    };
  };