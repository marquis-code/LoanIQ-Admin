import { wallet_api } from '@/api_factory/modules/wallet'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useCreditSettlement = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()
  const { $_credit_settlement } = wallet_api

  const creditSettlementAccount = async (payload) => {
    loading.value = true
    try {
      const response = await $_credit_settlement(payload)
      if (response.status === 200 || response.statusText === 'OK') {
        showToast({
          title: "Success",
          message: 'Settlement account credited successfully.',
          toastType: "success",
          duration: 3000
        })
        return response.data
      } else {
        throw new Error(response.error || 'Failed to credit settlement account')
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: `Error crediting settlement account: ${error.message}`,
        toastType: "error",
        duration: 3000
      })
      return { error: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    creditSettlementAccount,
    loading
  }
}