import { ref } from 'vue';
import { permissions_api } from '@/api_factory/modules/permissions';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

export const useCreatePermission = () => {
    const loading = ref(false);
    const { $_create_permissions } = permissions_api;

    const createPermission = async (payload: Record<string, any>) => {
        loading.value = true;
        try {
            await $_create_permissions(payload);
            showToast({
                title: "Success",
                message: 'Permission was created successfully.',
                toastType: "success",
                duration: 3000
              });
        } catch (error) {
            showToast({
                title: "Error",
                message: `Error creating permission, ${error}`,
                toastType: "error",
                duration: 3000
              });
        } finally {
            loading.value = false;
        }
    };

    return {
        createPermission,
        loading,
    };
};
