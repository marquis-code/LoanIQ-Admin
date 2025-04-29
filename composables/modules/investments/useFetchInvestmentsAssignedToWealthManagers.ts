import { ref } from "vue";
import { investment_api } from "@/api_factory/modules/investment";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useFetchInvestmentsAssignedToWeaalthManagers = () => {
  const route = useRoute()
  const loading = ref(false);
  const assignedInvestmentsList = ref<any>(null);

  const fetchInvestmentsAssignedToWealthManagers = async () => {
    loading.value = true;
    const response = await investment_api.$_get_investment_assigned_to_wealth_managers(route.params.id) as any
    console.log(response, 'response here ahgain 0-000')
    loading.value = false;

    if (response.type !== "ERROR") {
        assignedInvestmentsList.value = response?.data?.data?.activeInvestments || [];
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error fetching investments"}`,
        toastType: "error",
        duration: 3000,
      });
    }
  };

  onMounted(() => {
    if(route.params.id){
        fetchInvestmentsAssignedToWealthManagers()
    }
  })

  return {
    assignedInvestmentsList,
    fetchInvestmentsAssignedToWealthManagers,
    loading,
  };
};
