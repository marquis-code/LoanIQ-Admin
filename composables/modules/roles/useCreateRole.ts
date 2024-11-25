import { ref } from "vue";
import { roles_api } from "@/api_factory/modules/roles";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

const payload = ref({
  name: "",
  description: ""
})

export const useCreateRole = () => {
  const loading = ref(false);
  const { $_create_roles } = roles_api;

  const createRole = async () => {
    loading.value = true;
    try {
      await $_create_roles(payload.value);
      showToast({
        title: "Success",
        message: "Role was created successfully.",
        toastType: "success",
        duration: 3000,
      });
    } catch (error) {
      showToast({
        title: "Error",
        message: `Error creating role, ${error}`,
        toastType: "error",
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return {
    createRole,
    loading,
    payload
  };
};
