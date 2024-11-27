import { ref } from 'vue';
import { users_api } from "@/api_factory/modules/users";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

const payload = ref({
    otp: "",
    userId: "",
    trackingId:""
})

export const useSubmitAccountNumberRequest = () => {
    const loading = ref(false);

    const submitAccountNumberRequest = async () => {
        loading.value = true;
        try {
            const response = await users_api.$_submit_account_number_request(payload.value) as any
            if (response.statusText === "OK") {
                showToast({
                    title: "Success",
                    message: response?.data?.message,
                    toastType: "success",
                    duration: 3000,
                });
            } else {
                showToast({
                    title: "Error",
                    message: `${response.data.message || 'Error submitting account number request'}`,
                    toastType: "error",
                    duration: 3000,
                });
            }
        } catch (error) {
            showToast({
                title: "Error",
                message: "An unexpected error occurred while submitting account number request.",
                toastType: "error",
                duration: 3000,
            });
        }
        loading.value = false;
    };

    const userObj = JSON.parse(localStorage.getItem('createUserObj')) as any

    const setPayload = (data: any) => {
        payload.value.otp = data.otp
        payload.value.userId = userObj.userId
        payload.value.trackingId = userObj.trackingId
    }

    return {
        loading,
        submitAccountNumberRequest,
        payload,
        setPayload
    };
}
