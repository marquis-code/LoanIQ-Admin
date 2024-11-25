import { ref } from "vue";
import { app_api } from "@/api_factory/modules/app";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useFetchModules = () => {
  const loading = ref(false);
  const modules = ref([]);
  const { $_get_app_modules } = app_api;

  const fetchModules = async () => {
    loading.value = true;
    try {
      const res = await $_get_app_modules();
      modules.value = res?.data?.data || [];
    } catch (error) {
      showToast({
        title: "Error",
        message: `Error fething module, ${error}`,
        toastType: "error",
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchModules();
  });

  return {
    fetchModules,
    loading,
    modules,
  };
};
