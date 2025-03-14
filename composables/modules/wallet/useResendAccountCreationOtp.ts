import { wallet_api } from '@/api_factory/modules/wallet'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useResendAccountCreationOtp = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()
  const { $_resend_accout_creation_otp } = wallet_api

  const resendAccountCreationOtp = async (payload: any) => {
    loading.value = true
    try {
      const response = await $_resend_accout_creation_otp(payload)
      if (response.status === 200 || response.statusText === 'OK') {
        showToast({
          title: "Success",
          message: 'OTP resent successfully.',
          toastType: "success",
          duration: 3000
        })
        return response.data
      } else {
        throw new Error(response.error || 'Failed to resend OTP')
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: `Error resending OTP: ${error.message}`,
        toastType: "error",
        duration: 3000
      })
      return { error: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    resendAccountCreationOtp,
    loading
  }
}
