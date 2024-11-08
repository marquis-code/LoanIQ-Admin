import { ref } from 'vue';
import { permissions_api } from '@/api_factory/modules/permissions';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

export const useDeletePermission = () => {
    const loading = ref(false);
    const { $_delete_permissions } = permissions_api;

    const deletePermission = async (id: string) => {
        loading.value = true;
        try {
            await $_delete_permissions(id);
            showToast({
                title: "Success",
                message: 'Permission was deleted successfully.',
                toastType: "success",
                duration: 3000
              });
        } catch (error) {
            showToast({
                title: "Error",
                message: `Error deleting permission, ${error}`,
                toastType: "error",
                duration: 3000
              });
        } finally {
            loading.value = false;
        }
    };

    return {
        deletePermission,
        loading,
    };
};
