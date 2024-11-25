import { ref } from "vue";
import { app_api } from "@/api_factory/modules/app";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useDeleteModule = () => {
    const loading = ref(false);
    const { $_delete_module } = app_api;
  
    const deleteModule = async (id: string) => {
      loading.value = true;
      const response = await $_delete_module(id) as any
      if (response.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Module deleted successfully.",
          toastType: "success",
          duration: 3000,
        });
      } else {
        showToast({
          title: "Error",
          message: `${response.data.message || 'Error deleting module'}`,
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };
  
    return {
      deleteModule,
      loading,
    };
  };
  