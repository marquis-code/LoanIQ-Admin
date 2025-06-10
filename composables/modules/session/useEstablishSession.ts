import { ref } from "vue"
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'
import { useUser } from "@/composables/auth/user"
import { readonly } from "vue"

const sessionObj = ref({})
const loading = ref(false)
const error = ref(null)

export const useCreateSession = () => {
  const createSession = async (payload: {
    encryptedSessionToken: string
    bearerToken: string
  }) => {
    loading.value = true
    error.value = null
    
    try {
      console.log("=== Session Establishment Started ===")
      console.log("Payload validation:", {
        hasEncryptedToken: !!payload.encryptedSessionToken,
        hasBearerToken: !!payload.bearerToken,
        encryptedTokenLength: payload.encryptedSessionToken?.length,
        bearerTokenPreview: payload.bearerToken?.substring(0, 20) + "..."
      })

      // Validate required parameters
      if (!payload.encryptedSessionToken) {
        throw new Error("Encrypted session token is required")
      }
      
      if (!payload.bearerToken) {
        throw new Error("Bearer token is required")
      }

      console.log("Making session establishment request...")
      console.log("Endpoint: /session/establish")
      console.log("Raw payload (will NOT be encrypted by axios):", {
        encryptedSessionKey: payload.encryptedSessionToken
      })

      // Create the session handshake request
      // This payload will NOT be encrypted by the axios interceptor due to shouldSkipEncryption()
      const response = await GATEWAY_ENDPOINT.post(
        "/session/establish",
        {
          encryptedSessionKey: payload.encryptedSessionToken,
        },
        {
          headers: {
            Authorization: `Bearer ${payload.bearerToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      console.log("=== Session Establishment Response ===")
      console.log("Status:", response.status)
      console.log("Status Text:", response.statusText)
      console.log("Response Data:", response.data)
      console.log("Response Headers:", response.headers)

      // Store the session response
      // console.log(response.data.data, 'sessssssssssssssssss')
      const parsedSessionData = JSON.parse(response?.data?.data?.sessionData)
      localStorage.setItem('sessionData', JSON.stringify(parsedSessionData))
      const userId = response?.data?.data?.userId
      // console.log(parsedSessionData, 'sessssssssssssssssss parsed')
      sessionObj.value = response.data.data
      localStorage.setItem('session0bjData', JSON.stringify({...parsedSessionData, userId }))
      // Validate response
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Session establishment failed with status: ${response.status}`)
      }
      
      // const storeObj = {
      //   user: JSON.stringify(response?.data),
      //   // token: jwtToken,
      //   // decrypt_key: encryptedSessionToken
      // }
      // useUser().createUser(storeObj)
      // console.log("✅ Session established successfully")
      return response

    } catch (err) {
      console.error("=== Session Establishment Error ===")
      console.error("Error type:", err.constructor.name)
      console.error("Error message:", err.message)
      
      if (err.response) {
        console.error("Response status:", err.response.status)
        console.error("Response data:", err.response.data)
        console.error("Response headers:", err.response.headers)
        
        // Extract meaningful error message from response
        const errorMessage = err.response.data?.message || 
                           err.response.data?.error || 
                           `HTTP ${err.response.status}: ${err.response.statusText}`
        
        error.value = errorMessage
        throw new Error(errorMessage)
      } else if (err.request) {
        console.error("Request made but no response received:", err.request)
        error.value = "Network error: No response from server"
        throw new Error("Network error: No response from server")
      } else {
        console.error("Error setting up request:", err.message)
        error.value = err.message
        throw err
      }
    } finally {
      loading.value = false
    }
  }

  // Helper function to reset session state
  const resetSession = () => {
    sessionObj.value = {}
    error.value = null
    loading.value = false
  }

  // Helper function to check if session is established
  const isSessionEstablished = () => {
    return Object.keys(sessionObj.value).length > 0
  }

  // Helper function to get session data
  const getSessionData = () => {
    return sessionObj.value
  }

  return {
    createSession,
    sessionObj: readonly(sessionObj),
    loading: readonly(loading),
    error: readonly(error),
    resetSession,
    isSessionEstablished,
    getSessionData,
  }
}

// Alternative function signature to match your login composable usage
export const useEstablishSession = () => {
  return useCreateSession()
}