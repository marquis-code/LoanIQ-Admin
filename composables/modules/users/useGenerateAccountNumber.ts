import { ref } from 'vue';
import { users_api } from "@/api_factory/modules/users";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useGenerateAccountNumber = () => {
    const loading = ref(false);

    const generateAccountNumber = async (id: string) => {
        loading.value = true;
        try {
            const response = await users_api.$_generate_account_number(id) as any
            if (response.type !== "ERROR") {
                showToast({
                    title: "Success",
                    message: "Account number was generatd successfully.",
                    toastType: "success",
                    duration: 3000,
                });
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
