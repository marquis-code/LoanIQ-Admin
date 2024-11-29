import { ref } from 'vue';
import { permissions_api } from '@/api_factory/modules/permissions';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

const payload = ref([])

export const useAssignPermissionToRole = () => {
    const loading = ref(false);
    const route = useRoute()
    const { $_assign_permission_to_role } = permissions_api;

    // const roleId = route.query.roleKey as any

    const assignPermissionToRole = async () => {
        loading.value = true;
        const roleId = localStorage.getItem('selected-role') as any
        try {
            await $_assign_permission_to_role(roleId, payload.value);
            showToast({
                title: "Success",
                message: 'Permissions was successfully assigned to role.',
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

    const setPayload = (item: any) => {
        payload.value = item
    }

    return {
        assignPermissionToRole,
        loading,
        payload,
        setPayload
    };
};
