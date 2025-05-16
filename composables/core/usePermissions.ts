// import { useUser } from '@/composables/auth/user'
// import { decryptData } from "@/api_factory/encrypt-data";
// import { getDecryptedAuthData } from "@/composables/auth/user"
import { useUser } from "@/composables/auth/user"

export const usePermissions = () => {
  // const { permissions } = useUser()
  // const decrypted = decryptData(encryptedAuthData.value);
  const { getDecryptedAuthData } = useUser()

  const { permission: permissionsList } = getDecryptedAuthData()
  // console.log(permissionsList)

  const hasPermission = (moduleId: string): boolean => {
    if (!permissionsList || permissionsList.length === 0) {
      return false // Or handle the case where permissions are empty
    }
    return permissionsList.some(p => p.moduleId === moduleId)
  }

  const hasSpecificPermission = (moduleId: string, permission: string): boolean => {
    const module = permissionsList.find(p => p.moduleId === moduleId)
    return module?.permissions.includes(permission) ?? false
  }

  const canView = (moduleId: string): boolean => {
    return hasSpecificPermission(moduleId, 'view')
  }

  const canCreate = (moduleId: string): boolean => {
    return hasSpecificPermission(moduleId, 'create')
  }

  const canEdit = (moduleId: string): boolean => {
    return hasSpecificPermission(moduleId, 'edit')
  }

  const canDelete = (moduleId: string): boolean => {
    return hasSpecificPermission(moduleId, 'delete')
  }

  return {
    hasPermission,
    hasSpecificPermission,
    canView,
    canCreate,
    canEdit,
    canDelete
  }
}
