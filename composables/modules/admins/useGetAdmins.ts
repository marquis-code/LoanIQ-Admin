import { ref } from "vue";
import { admin_api } from "@/api_factory/modules/admin";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useGetAdmins = () => {
  const loading = ref(false);
  const admins = ref([]);
  const { $_get_admins } = admin_api;

  const getAdmins = async () => {
    loading.value = true;
    const response = (await $_get_admins()) as any;
    console.log(response, 'tes')
    if (response.statusText === "OK") {
      admins.value = response?.data?.data || [];
      showToast({
        title: "Success",
        message: "Admins retrieved successfully.",
        toastType: "success",
        duration: 3000,
      });
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error retrieving admins"}`,
        toastType: "error",
        duration: 3000,
      });
    }
    loading.value = false;
  };

  onMounted(() => {
    getAdmins();
  });

  return {
    getAdmins,
    admins,
    loading,
  };
};
