import { useUser } from '@/composables/auth/user'

export const usePermissions = () => {
  const { permissions } = useUser()

  const hasPermission = (moduleId: string): boolean => {
    console.log(moduleId, 'module id here', permissions.value)
    if (!permissions.value || permissions.value.length === 0) {
      return false // Or handle the case where permissions are empty
    }
    return permissions.value.some(p => p.moduleId === moduleId)
  }

  const hasSpecificPermission = (moduleId: string, permission: string): boolean => {
    const module = permissions.value.find(p => p.moduleId === moduleId)
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
