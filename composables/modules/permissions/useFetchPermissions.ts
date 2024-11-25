import { ref } from "vue";
import { permissions_api } from "@/api_factory/modules/permissions";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useFetchPermissions = () => {
  const loading = ref(false);
  const permissions = ref([
    {
      id: "ea71fa53-5604-4d89-8803-8953cf270898",
      name: "Edit",
      slug: "edit",
      description: "",
    },
    {
      id: "0312eedf-6289-41d8-9926-ee2ed418fbff",
      name: "Delete",
      slug: "delete",
      description: "",
    },
    {
      id: "1d3651a1-501e-4b48-91fa-73879d54bd02",
      name: "View",
      slug: "view",
      description: "",
    },
    {
      id: "2a4b027f-5b8b-4fa2-815e-0eb5760a07dc",
      name: "Create",
      slug: "create",
      description: "",
    },
  ]);
  const { $_get_permissions } = permissions_api;

  const fetchPermissions = async () => {
    loading.value = true;
    try {
      const res = await $_get_permissions();
      permissions.value = res?.data?.data || [];
    } catch (error) {
      showToast({
        title: "Error",
        message: `Error fething permissions, ${error}`,
        toastType: "error",
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchPermissions();
  });

  return {
    fetchPermissions,
    loading,
    permissions,
  };
};
