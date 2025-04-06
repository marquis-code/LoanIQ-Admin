import { wealth_managers_api } from '@/api_factory/modules/wealth-managers'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useAssignWealthManagerToInvestment = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()
  const { $_assign_wealth_managers_to_investment } = wealth_managers_api

  const assignWealthManagerToInvestment = async (id: string, payload: any) => {
    loading.value = true
    try {
      const response = await $_assign_wealth_managers_to_investment(id, payload) as any
      if (response.status === 200 || response.statusText === 'OK') {
        return response.data
      } else {
        throw new Error(response.error || 'Failed to resolve account number')
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: `Error resolving account: ${error.message}`,
        toastType: "error",
        duration: 3000
      })
      return { error: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    assignWealthManagerToInvestment,
    loading
  }
}