import { ref } from 'vue';
import { roles_api } from '@/api_factory/modules/roles';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

export const useEditRole = () => {
    const loading = ref(false);
    const { $_edit_roles } = roles_api;

    const editRole = async (id: string, payload: Record<string, any>) => {
        loading.value = true;
        const response = await $_edit_roles(id, payload) as any
        console.log(response, 'res here')
        if(response.status === 200 || response.statusText === 'OK'){
            showToast({
                title: "Success",
                message: 'Role was updated successfully.',
                toastType: "success",
                duration: 3000
              });
        } else {
            showToast({
                title: "Error",
                message: `Error editing role, ${response.error}`,
                toastType: "error",
                duration: 3000
              });
        }
        loading.value = false
        return response
    };

    return {
        editRole,
        loading,
    };
};
