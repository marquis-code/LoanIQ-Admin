import { ref } from "vue";
import { users_api } from "~/api_factory/modules/customer-mgt";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useGetUserDetails = () => {
    const loading = ref(false);
    const user = ref(null);
    const wallet = ref(null)
    const investmentBalance = ref(null)
    const { $_get_user_details } = users_api;
    const route = useRoute()
  
    const getUserDetails = async () => {
      const id = route.params.id as string
      loading.value = true;
      try {
        const response = await $_get_user_details(id) as any
        if (response.type !== "ERROR") {
          console.log(response?.data, 'respknse here')
          user.value = response?.data?.data?.profile ?? {};
          wallet.value = response?.data?.data?.wallet ?? {}
          investmentBalance.value = response.data.data.investmentBalance ?? {}
          showToast({
            title: "Success",
            message: "User details retrieved successfully.",
            toastType: "success",
            duration: 3000,
          });
        } else {
          showToast({
            title: "Error",
            message: `${response.data.message || 'Error retrieving user details'}`,
            toastType: "error",
            duration: 3000,
          });
        }
      } catch (error) {
        showToast({
          title: "Error",
          message: "An unexpected error occurred while retrieving user details.",
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };

    onMounted(() => {
      getUserDetails()
    })
  
    return {
      getUserDetails,
      user,
      wallet,
      loading,
      investmentBalance
    };
  };
  