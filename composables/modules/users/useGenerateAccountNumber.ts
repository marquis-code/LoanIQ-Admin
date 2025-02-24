import { ref } from 'vue';
import { users_api } from "~/api_factory/modules/customer-mgt";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useGenerateAccountNumber = () => {
    const loading = ref(false);

    const generateAccountNumber = async (id: string) => {
        loading.value = true;
        try {
            const response = await users_api.$_generate_account_number(id) as any
            if (response.statusText === "OK") {
                showToast({
                    title: "Success",
                    message: response?.data?.message,
                    toastType: "success",
                    duration: 3000,
                });
                localStorage.setItem('createUserObj', JSON.stringify(response?.data?.data));
                return response?.data?.status
            } else {
                showToast({
                    title: "Error",
                    message: `${response.data.message || 'Error generating account number'}`,
                    toastType: "error",
                    duration: 3000,
                });
            }
        } catch (error) {
            showToast({
                title: "Error",
                message: "An unexpected error occurred while generating account number..",
                toastType: "error",
                duration: 3000,
            });
        }
        loading.value = false;
    };

    return {
        loading,
        generateAccountNumber,
    };
}
