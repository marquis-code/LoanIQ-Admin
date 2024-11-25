import { ref } from "vue";
import { app_api } from "@/api_factory/modules/app";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useEditRoles = () => {
    const loading = ref(false);
    const { $_edit_roles } = app_api;
  
    const editRoles = async (id: string, payload: Record<string, any>) => {
      loading.value = true;
      const response = await $_edit_roles(id, payload) as any
      if (response.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Roles updated successfully.",
          toastType: "success",
          duration: 3000,
        });
      } else {
        showToast({
          title: "Error",
          message: `${response.data.message || 'Error updating roles'}`,
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };
  
    return {
      editRoles,
      loading,
    };
  };