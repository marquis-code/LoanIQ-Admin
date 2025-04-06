import { ref } from "vue";
import { wealth_managers_api } from "@/api_factory/modules/wealth-managers";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useFetchWealthManagers = () => {
  const loading = ref(false);
  const wealthManagersList = ref([
  ] as any[]);
  const { $_get_wealth_managers } = wealth_managers_api;

  const fetchWealthManagers = async () => {
    loading.value = true;
    try {
      const res = await $_get_wealth_managers();
      wealthManagersList.value = res?.data?.data || [];
    } catch (error) {
      showToast({
        title: "Error",
        message: `Error fetching wealth managers, ${error}`,
        toastType: "error",
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchWealthManagers();
  });

  return {
    fetchWealthManagers,
    loading,
    wealthManagersList,
  };
};
