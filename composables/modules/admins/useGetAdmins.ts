import { ref } from "vue";
import { admin_api } from "@/api_factory/modules/admin";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useGetAdmins = () => {
  const loading = ref(false);
  const admins = ref([]);
  const metadata = ref({
    page: 1,
    pageSize: 7,
    total: 0,
    pages: 0,
  });
  const { $_get_admins } = admin_api;

  const getAdmins = async () => {
    loading.value = true;
    const response = (await $_get_admins(metadata.value)) as any;
    console.log(response, 'res')
    if (response.statusText === "OK") {
      const { page, pageSize, total, pages } = response?.data?.data || {};
      admins.value = response?.data?.data|| [];
      metadata.value = { page, pageSize, total, pages };
      // showToast({
      //   title: "Success",
      //   message: "Admins retrieved successfully.",
      //   toastType: "success",
      //   duration: 3000,
      // });
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

  watch( [metadata.value.page, metadata.value.pageSize], // Watch only page and pageSize
    () => {
        // debouncedGetProperties(); // Use the debounced version here
        getAdmins();
    }
);

  onMounted(() => {
    getAdmins();
  });

  return {
    getAdmins,
    admins,
    loading,
    metadata
  };
};
