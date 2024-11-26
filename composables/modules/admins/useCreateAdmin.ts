import { ref } from "vue";
import { admin_api } from "@/api_factory/modules/admin";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

const payload = ref({
  firstName: "",
  lastName: "",
  email: "",
  roleId: "",
});

export const useCreateAdmin = () => {
  const loading = ref(false);
  const { $_create_admin } = admin_api;
  const router = useRouter()

  const createAdmin = async () => {
    loading.value = true;
    const response = (await $_create_admin(payload.value)) as any;
    if (response.statusText === "OK") {
      showToast({
        title: "Success",
        message: "Admin created successfully.",
        toastType: "success",
        duration: 3000,
      });
      router.push('/dashboard/admin')
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error creating admin"}`,
        toastType: "error",
        duration: 3000,
      });
    }
    loading.value = false;
  };

  return {
    createAdmin,
    loading,
    payload
  };
};
