import { ref } from "vue";
import { users_api } from "@/api_factory/modules/users";
import { useCustomToast } from "@/composables/core/useCustomToast";

const { showToast } = useCustomToast();

export const useGetUsers = () => {
  const loading = ref(false);
  const users = ref(
    [],
  );
  const { $_get_users } = users_api;

  const getUsers = async () => {
    loading.value = true;
    try {
      const response = (await $_get_users()) as any;
      console.log(response, 'response')
      if (response.statusText !== "ERROR") {
        users.value = response.data.data;
        // showToast({
        //   title: "Success",
        //   message: "Users retrieved successfully.",
        //   toastType: "success",
        //   duration: 3000,
        // });
      } else {
        showToast({
          title: "Error",
          message: `${response.data.message || "Error retrieving users"}`,
          toastType: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: "An unexpected error occurred while retrieving users.",
        toastType: "error",
        duration: 3000,
      });
    }
    loading.value = false;
  };

  onMounted(() => {
    getUsers();
  });

  return {
    getUsers,
    users,
    loading,
  };
};
