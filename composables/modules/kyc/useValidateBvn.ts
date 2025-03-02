import { ref } from "vue";
import { kyc_api } from "@/api_factory/modules/kyc";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

const validateReport = ref(null)

export const useValidateBvn = () => {
  const loading = ref(false);

  const validateBvn = async (payload: { bvn: string }) => {
    loading.value = true;
    const response = await kyc_api.$_validate_bvn(payload) as any
    loading.value = false;

    if (response.type !== "ERROR") {
        console.log(response.data, 'Here ooo')
        validateReport.value = response.data.data;
        showToast({
            title: "Success",
            message: `${response.data.message || "BVN was validated successfully"}`,
            toastType: "success",
            duration: 3000,
          });
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error validating BVN"}`,
        toastType: "error",
        duration: 3000,
      });
    }
  };

  return {
    validateBvn,
    validateReport,
    loading,
  };
};
