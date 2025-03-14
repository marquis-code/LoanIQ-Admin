import { wallet_api } from '@/api_factory/modules/wallet'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useAuthenticateTransfer = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()
  const { $_authenticate_transfer } = wallet_api

  const authenticateTransfer = async (payload: any) => {
    loading.value = true
    try {
      const response = await $_authenticate_transfer(payload) as any
      if (response.status === 200 || response.statusText === 'OK') {
        showToast({
          title: "Success",
          message: 'Transfer authenticated successfully.',
          toastType: "success",
          duration: 3000
        })
        return response.data
      } else {
        throw new Error(response.error || 'Failed to authenticate transfer')
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: `Error authenticating transfer: ${error.message}`,
        toastType: "error",
        duration: 3000
      })
      return { error: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    authenticateTransfer,
    loading
  }
}