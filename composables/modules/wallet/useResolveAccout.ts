import { wallet_api } from '@/api_factory/modules/wallet'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useResolveAccount = () => {
  const loading = ref(false)
  const accountDetails = ref(null)
  const { showToast } = useCustomToast()
  const { $_resolve_account_number } = wallet_api

  const resolveAccountNumber = async () => {
    loading.value = true
    try {
      const response = await $_resolve_account_number() as any
      if (response.status === 200 || response.statusText === 'OK') {
        accountDetails.value = response.data
        return response.data
      } else {
        throw new Error(response.error || 'Failed to resolve account number')
      }
    } catch (error) {
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
    resolveAccountNumber,
    accountDetails,
    loading
  }
}