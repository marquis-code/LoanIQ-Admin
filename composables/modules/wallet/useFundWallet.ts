import { wallet_api } from '@/api_factory/modules/wallet'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useFundWallet = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()
  const { $_fund_wallet } = wallet_api

  const fundWallet = async (payload: any) => {
    loading.value = true
    try {
      const response = await $_fund_wallet(payload)
      if (response.status === 200 || response.statusText === 'OK') {
        showToast({
          title: "Success",
          message: 'Wallet funded successfully.',
          toastType: "success",
          duration: 3000
        })
        return response.data
      } else {
        const errorMessage = response.error || 'Failed to fund wallet';
        showToast({
          title: "Error",
          message: `Error funding wallet: ${errorMessage}`,
          toastType: "error",
          duration: 3000
        })
        return { error: errorMessage }
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: `Error funding wallet: ${error.message}`,
        toastType: "error",
        duration: 3000
      })
      return { error: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    fundWallet,
    loading
  }
}