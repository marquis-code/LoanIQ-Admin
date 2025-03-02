import { ref } from "vue";
import { kyc_api } from "@/api_factory/modules/kyc";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

const validateReport = ref(null)

export const useValidatePhone = () => {
  const loading = ref(false);

  const validatePhone = async (payload: { phoneNumber: string }) => {
    loading.value = true;
    const response = await kyc_api.$_validate_phone(payload) as any
    loading.value = false;

    if (response.type !== "ERROR") {
        validateReport.value = response.data;
        showToast({
            title: "Error",
            message: `${response.data.message || "Phone nUMBER was validated successfully"}`,
            toastType: "error",
            duration: 3000,
          });
    } else {
      showToast({
        title: "Error",
        message: `${response.data.message || "Error validating Phone Number"}`,
        toastType: "error",
        duration: 3000,
      });
    }
  };

  return {
    validatePhone,
    loading,
    validateReport
  };
};
