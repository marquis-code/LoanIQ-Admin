import { ref } from 'vue';
import { users_api } from "~/api_factory/modules/customer-mgt";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

const payload = ref({
    email: "",
    bvn: "",
    phoneNumber: ""
})

export const useCreateUser = () => {
    const loading = ref(false);
    
    const createUser = async (payloadItem: any) => {
        const payloadObj = payloadItem || payload.value
        loading.value = true;
        try {
           const response = await users_api.$_create_user(payloadObj) as any
            if (response.type !== "ERROR") {
                showToast({
                    title: "Success",
                    message: "User account created successfully.",
                    toastType: "success",
                    duration: 3000,
                });
            } else {
                showToast({
                    title: "Error",
                    message: `${response.data.message || 'Error creating user account'}`,
                    toastType: "error",
                    duration: 3000,
                });
            }
        } catch (error) {
            showToast({
                title: "Error",
                message: "An unexpected error occurred while creating the user account.",
                toastType: "error",
                duration: 3000,
            });
        }
        loading.value = false;
    };

    const setPayload = (data: any) => {
      payload.value.email = data.email
      payload.value.bvn = data.bvn
    }

    return {
        loading,
        payload,
        createUser,
        setPayload
    };
}
