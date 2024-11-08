import { ref } from 'vue';
import { roles_api } from '@/api_factory/modules/roles';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

export const useFetchRoles = () => {
    const loading = ref(false);
    const roles = ref([] as any[]);
    const { $_get_roles } = roles_api;

    const fetchRoles = async () => {
        loading.value = true;
        try {
            const res = await $_get_roles();
            roles.value = res?.data || [];
        } catch (error) {
            showToast({
                title: "Error",
                message: `Error fetching roles, ${error}`,
                toastType: "error",
                duration: 3000
              });
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        fetchRoles()
    })

    return {
        fetchRoles,
        loading,
        roles,
    };
};
