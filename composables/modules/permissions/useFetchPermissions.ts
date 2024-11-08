import { ref } from 'vue';
import { permissions_api } from '@/api_factory/modules/permissions';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

export const useFetchPermissions = () => {
    const loading = ref(false);
    const permissions = ref([] as any[]);
    const { $_get_permissions } = permissions_api;

    const fetchPermissions = async () => {
        loading.value = true;
        try {
            const res = await $_get_permissions();
            permissions.value = res?.data || [];
        } catch (error) {
            showToast({
                title: "Error",
                message: `Error fething permissions, ${error}`,
                toastType: "error",
                duration: 3000
              });
        } finally {
            loading.value = false;
        }
    };

    return {
        fetchPermissions,
        loading,
        permissions,
    };
};
