import { wallet_api } from '@/api_factory/modules/wallet'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useCheckTransferStatus = () => {
  const loading = ref(false)
  const transferStatus = ref(null)
  const { showToast } = useCustomToast()
  const { $_check_transfer_status } = wallet_api

  const checkTransferStatus = async () => {
    loading.value = true
    try {
      const response = await $_check_transfer_status()
      if (response.status === 200 || response.statusText === 'OK') {
        transferStatus.value = response.data
        return response.data
      } else {
        throw new Error(response.error || 'Failed to check transfer status')
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: `Error checking transfer status: ${error.message}`,
        toastType: "error",
        duration: 3000
      })
      return { error: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    checkTransferStatus,
    transferStatus,
    loading
  }
}