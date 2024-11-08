import { ref } from 'vue';
import { permissions_api } from '@/api_factory/modules/permissions';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

export const useEditPermission = () => {
    const loading = ref(false);
    const { $_edit_permissions } = permissions_api;

    const editPermission = async (id: string, payload: Record<string, any>) => {
        loading.value = true;
        try {
            await $_edit_permissions(id, payload);
            showToast({
                title: "Success",
                message: 'Permission was updated successfully.',
                toastType: "success",
                duration: 3000
              });
        } catch (error) {
            showToast({
                title: "Error",
                message: `Error updating permission, ${error}`,
                toastType: "error",
                duration: 3000
              });
        } finally {
            loading.value = false;
        }
    };

    return {
        editPermission,
        loading,
    };
};
