import { ref } from 'vue';
import { roles_api } from '@/api_factory/modules/roles';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

export const useDeleteRole = () => {
    const loading = ref(false);
    const { $_delete_roles } = roles_api;

    const deleteRole = async (id: string) => {
        loading.value = true;
        try {
            await $_delete_roles(id);
            showToast({
                title: "Success",
                message: 'Role was deleted successfully.',
                toastType: "success",
                duration: 3000
              });
        } catch (error) {
            showToast({
                title: "Error",
                message: `Error deleting role, ${error}`,
                toastType: "error",
                duration: 3000
              });
        } finally {
            loading.value = false;
        }
    };

    return {
        deleteRole,
        loading,
    };
};
