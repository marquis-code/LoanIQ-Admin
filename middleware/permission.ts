import { usePermissions } from '@/composables/core/usePermissions'
export default defineNuxtRouteMiddleware((to) => {
    const { canView } = usePermissions()
    const moduleId = to.meta.moduleId as string
  
    if (moduleId && !canView(moduleId)) {
      return navigateTo('/dashboard')
    }
  })