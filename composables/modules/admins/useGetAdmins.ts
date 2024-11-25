import { ref } from "vue";
import { admin_api } from "@/api_factory/modules/admin";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useGetAdmins = () => {
  const loading = ref(false);
  const admins = ref([
    {
      id: "900f092b-2e6b-4e35-aac2-fee1909de2e8",
      email: "aderinolasegun9@gmail.com",
      firstName: "Segun",
      lastName: "James",
      roleId: "super-admin",
      permissions: [
        {
          moduleId: "user-management",
          permissions: ["view", "delete", "edit", "create"],
        },
        {
          moduleId: "investment-product",
          permissions: ["view", "delete", "edit", "create"],
        },
      ],
      block: false,
      deleted: false,
    },
  ]);
  const { $_get_admins } = admin_api;

  const getAdmins = async () => {
    loading.value = true;
    const response = (await $_get_admins()) as any;
    if (response.type !== "ERROR") {
      admins.value = response.data;
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
