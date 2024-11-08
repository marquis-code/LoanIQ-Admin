import { ref } from 'vue';
import { roles_api } from '@/api_factory/modules/roles';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

export const useEditRole = () => {
    const loading = ref(false);
    const { $_edit_roles } = roles_api;

    const editRole = async (id: string, payload: Record<string, any>) => {
        loading.value = true;
        try {
            await $_edit_roles(id, payload);
            showToast({
                title: "Success",
                message: 'Role was updated successfully.',
                toastType: "success",
                duration: 3000
              });
        } catch (error) {
            showToast({
                title: "Error",
                message: `Error editing role, ${error}`,
                toastType: "error",
                duration: 3000
              });
        } finally {
            loading.value = false;
        }
    };

    return {
        editRole,
        loading,
    };
};
