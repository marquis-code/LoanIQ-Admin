import { wallet_api } from '@/api_factory/modules/wallet'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useDebitWallet = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()
  const { $_debit_wallet } = wallet_api

  const debitWallet = async (payload) => {
    loading.value = true
    try {
      const response = await $_debit_wallet(payload)
      if (response.status === 200 || response.statusText === 'OK') {
        showToast({
          title: "Success",
          message: 'Wallet debited successfully.',
          toastType: "success",
          duration: 3000
        })
        return response.data
      } else {
        throw new Error(response.error || 'Failed to debit wallet')
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: `Error debiting wallet: ${error.message}`,
        toastType: "error",
        duration: 3000
      })
      return { error: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    debitWallet,
    loading
  }
}