import { ref } from "vue";
import { useUser } from "@/composables/auth/user";

export const usePermissions = () => {
  const { getDecryptedAuthData, authObj } = useUser();
  
  // Get decrypted data first
  // const user.value = getDecryptedAuthData();
  const { user } = useUser()
  
  // Create a ref to store permissions
  const permissionsList = ref([]);
  
  // Safely extract permissions from decrypted data
  if (user.value && user.value.permission) {
    permissionsList.value = user.value.permission;
  } else if (user.value && user.value.permission) {
    // Fallback to authObj if it has permissions
    permissionsList.value = authObj.value.permission;
  }

  const hasPermission = (moduleId: string): boolean => {
    if (!permissionsList.value || permissionsList.value.length === 0) {
      return false; // Or handle the case where permissions are empty
    }
    return permissionsList.value.some(p => p.moduleId === moduleId);
  };

  const hasSpecificPermission = (moduleId: string, permission: string): boolean => {
    if (!permissionsList.value || permissionsList.value.length === 0) {
      return false;
    }
    const module = permissionsList.value.find(p => p.moduleId === moduleId);
    return module?.permissions?.includes(permission) ?? false;
  };

  const canView = (moduleId: string): boolean => {
    return hasSpecificPermission(moduleId, 'view');
  };

  const canCreate = (moduleId: string): boolean => {
    return hasSpecificPermission(moduleId, 'create');
  };

  const canEdit = (moduleId: string): boolean => {
    return hasSpecificPermission(moduleId, 'edit');
  };

  const canDelete = (moduleId: string): boolean => {
    return hasSpecificPermission(moduleId, 'delete');
  };

  return {
    hasPermission,
    hasSpecificPermission,
    canView,
    canCreate,
    canEdit,
    canDelete,
    permissionsList
  };
};