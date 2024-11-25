import { ref } from "vue";
import { app_api } from "@/api_factory/modules/app";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

const payload = ref({
  name: "",
  permissions: [],
});

export const useCreateAppModule = () => {
  const loading = ref(false);
  const { $_create_app_module } = app_api;

  const createAppModule = async () => {
    loading.value = true;
    const response = (await $_create_app_module(payload)) as any;
    if (response.type !== "ERROR") {
      showToast({
        title: "Success",
        message: "App module created successfully.",
        toastType: "success",
        duration: 3000,
      });
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error creating app module"}`,
        toastType: "error",
        duration: 3000,
      });
    }
    loading.value = false;
  };

  const setPayload = (data: any) => {
    payload.value.name = data.name
    payload.value.permissions  = data.permissions 
  }

  return {
    createAppModule,
    loading,
    payload,
    setPayload
  };
};
