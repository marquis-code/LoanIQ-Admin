import axios, { type AxiosResponse } from "axios"
import { useCustomToast } from "@/composables/core/useCustomToast"
import { encryptData, decryptData } from "@/api_factory/encrypt-data"

const $GATEWAY_ENDPOINT_WITHOUT_VERSION = import.meta.env.VITE_BASE_URL as string
const $GATEWAY_ENDPOINT = import.meta.env.VITE_BASE_URL
const $GATEWAY_ENDPOINT_V2 = import.meta.env.VITE_BASE_URL + "/v2"
const $IMAGE_UPLOAD_ENDPOINT = import.meta.env.VITE_IMAGE_UPLOAD_BASE_URL as string

// Initialize toast outside the interceptors to avoid hook call issues
const { showToast } = useCustomToast()

// Function to get auth data from local storage and decrypt it
const getAuthData = () => {
  try {
    const encryptedAuthData = localStorage.getItem('user-auth-data')
    if (!encryptedAuthData) return { token: null, user: null }
    
    const decryptedData = decryptData(encryptedAuthData)
    return {
      token: decryptedData.token,
      user: decryptedData.user
    }
  } catch (error) {
    console.error("Error getting auth data:", error)
    return { token: null, user: null }
  }
}

// Function to log out user
const logOut = () => {
  localStorage.removeItem('auth-data')
  window.location.href = '/' // Redirect to login page
}

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    "x-api-key": "bwt2r25gw1hw9WdGWSryW626Th2AHF836dGr",
  },
})

export const GATEWAY_ENDPOINT_V2 = axios.create({
  baseURL: $GATEWAY_ENDPOINT_V2,
})

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    "x-api-key": "bwt2r25gw1hw9WdGWSryW626Th2AHF836dGr",
  },
})

export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    "x-api-key": "bwt2r25gw1hw9WdGWSryW626Th2AHF836dGr",
    "Content-Type": "multipart/form-data",
  },
})

export const GATEWAY_ENDPOINT_WITHOUT_VERSION = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
})

export const GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
  headers: {
    "x-api-key": "bwt2r25gw1hw9WdGWSryW626Th2AHF836dGr",
  },
})

export const IMAGE_UPLOAD_ENDPOINT = axios.create({
  baseURL: $IMAGE_UPLOAD_ENDPOINT,
})

export interface CustomAxiosResponse extends AxiosResponse {
  value?: any
  type?: string
}

const instanceArray = [
  GATEWAY_ENDPOINT,
  GATEWAY_ENDPOINT_V2,
  GATEWAY_ENDPOINT_WITH_AUTH,
  GATEWAY_ENDPOINT_WITHOUT_VERSION,
  GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH,
]

instanceArray.forEach((instance) => {
  // Request interceptor - handles encryption of outgoing data
  instance.interceptors.request.use(
    async (config: any) => {
      // Get auth data from local storage and decrypt it
      const { token } = getAuthData()
      
      // Add authorization token if available
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Only encrypt data for POST and PUT requests with JSON content
      if (
        config.data &&
        typeof config.data === "object" &&
        ["post", "put", "patch"].includes(config.method?.toLowerCase() || "") &&
        config.headers["Content-Type"] !== "multipart/form-data"
      ) {
        // Encrypt the data
        config.data = {
          data: encryptData(config.data),
        }
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  // Response interceptor - handles decryption of incoming data
  instance.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      // Note: Decryption is handled on the server side
      // We're not implementing client-side decryption since it would require the private key
      return response
    },
    (err: any) => {
      console.log(err, 'config error')
      // if(err.response.data.message = "Unauthorized access"){
      //   logOut()
      // }

      // if (typeof err.response === "undefined") {
      //   showToast({
      //     title: "Error",
      //     message: "kindly check your network connection",
      //     toastType: "error",
      //     duration: 3000,
      //   })
      //   logOut()
      //   return {
      //     type: "ERROR",
      //     ...err.response,
      //   }
      // }

      // Handle error responses
      if (err.response?.status === 401) {
        // logOut()
        showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occurred",
          toastType: "error",
          duration: 3000,
        })
        return {
          type: "ERROR",
          ...err.response,
        }
      } else if(err.response?.status === 403) {
        window.localStorage.clear()
        router.push('/')
        window.location.href = "/"
      } else if(err.response?.status === 400) {
        // window.localStorage.clear()
        // router.push('/')
        // window.location.href = "/"
        if (err.response.data.message) {
          showToast({
            title: "Error",
            message: err?.response?.data?.message || err?.response?.data?.error || "An error occurred",
            toastType: "error",
            duration: 3000,
          })
        }
        return {
          type: "ERROR",
          ...err.response,
        }
      } else if (statusCodeStartsWith(err.response.status, 4)) {
        if (err.response.data.message) {
          showToast({
            title: "Error",
            message: err?.response?.data?.message || err?.response?.data?.error || "An error occurred",
            toastType: "error",
            duration: 3000,
          })
        }
        return {
          type: "ERROR",
          ...err.response,
        }
      } else if (err.response.status === 500) {
        showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occurred",
          toastType: "error",
          duration: 3000,
        })
        return {
          type: "ERROR",
          ...err.response,
        }
      } else if (err.response.status === 409) {
        showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occurred",
          toastType: "error",
          duration: 3000,
        })
      }

      return Promise.reject(err)
    },
  )
})

const statusCodeStartsWith = (statusCode: number, startNumber: number): boolean => {
  const statusCodeString = statusCode.toString()
  const startNumberString = startNumber.toString()

  return statusCodeString.startsWith(startNumberString)
}