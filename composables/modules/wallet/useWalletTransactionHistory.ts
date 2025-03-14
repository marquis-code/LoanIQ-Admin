import { wallet_api } from '@/api_factory/modules/wallet'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useWalletTransactionHistory = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()
  const { $_fetch_wallet_transaction_history } = wallet_api

  const transactionHistory = ref([])
  const fetchTransactionHistory = async () => {
    loading.value = true
    try {
      const response = await $_fetch_wallet_transaction_history() as any
      if (response.status === 200 || response.statusText === 'OK') {
        showToast({
          title: "Success",
          message: 'Transaction history fetched successfully.',
          toastType: "success",
          duration: 3000
        })
        transactionHistory.value = response.data
        return response.data
      } else {
        throw new Error(response.error || 'Failed to fetch transaction history')
      }
    } catch (error: any) {
      showToast({
        title: "Error",
        message: `Error fetching transaction history: ${error.message}`,
        toastType: "error",
        duration: 3000
      })
      return { error: error.message }
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchTransactionHistory()
  })

  return {
    fetchTransactionHistory,
    loading,
    transactionHistory
  }
}