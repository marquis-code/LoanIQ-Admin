import { ref } from "vue";
import { users_api } from "~/api_factory/modules/customer-mgt";
import { useCustomToast } from "@/composables/core/useCustomToast";

const { showToast } = useCustomToast();

export const useGetUsers = () => {
  const loading = ref(false);
  const users = ref(
    [],
  );
  const metadata = ref({
    page: 1,
    pageSize: 7,
    total: 0,
    pages: 0,
  });
  const { $_get_users } = users_api;

  const getUsers = async () => {
    loading.value = true;
    try {
      const response = (await $_get_users(metadata.value)) as any;
  
      if (response.statusText !== "ERROR") {
        const { page, pageSize, total, pages } = response?.data?.data || {};
        metadata.value = { page, pageSize, total, pages };
        users.value = response.data.data.users;
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

  watch( [metadata.value.page, metadata.value.pageSize], // Watch only page and pageSize
    () => {
        getUsers()
    }
);

  return {
    getUsers,
    users,
    loading,
    metadata
  };
};
