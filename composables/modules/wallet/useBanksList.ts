import { wallet_api } from '@/api_factory/modules/wallet'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useBankList = () => {
  const loading = ref(false)
  const banks = ref([])
  const { showToast } = useCustomToast()
  const { $_get_bank_list } = wallet_api

  const getBankList = async () => {
    loading.value = true
    try {
      const response = await $_get_bank_list()
      if (response.status === 200 || response.statusText === 'OK') {
        banks.value = response.data
        return response.data
      } else {
        throw new Error(response.error || 'Failed to fetch bank list')
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: `Error fetching bank list: ${error.message}`,
        toastType: "error",
        duration: 3000
      })
      return { error: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    getBankList,
    banks,
    loading
  }
}