import axios, { type AxiosResponse } from "axios"
import { useCustomToast } from "@/composables/core/useCustomToast"
import { encryptData, decryptData } from "@/api_factory/encrypt-data"
import { useUser } from "@/composables/auth/user";

const $GATEWAY_ENDPOINT_WITHOUT_VERSION = import.meta.env.VITE_BASE_URL as string
const $GATEWAY_ENDPOINT = import.meta.env.VITE_BASE_URL
const $GATEWAY_ENDPOINT_V2 = import.meta.env.VITE_BASE_URL + "/v2"
const $IMAGE_UPLOAD_ENDPOINT = import.meta.env.VITE_IMAGE_UPLOAD_BASE_URL as string
const $X_API_KEY = import.meta.env.VITE_X_API_KEY as string

// Initialize toast outside the interceptors to avoid hook call issues
const { showToast } = useCustomToast()

// Error messages configuration
const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network connection failed. Please check your internet connection.",
  CORS_ERROR: "Cross-origin request blocked. Please contact support.",
  UNAUTHORIZED: "Your session has expired. Please log in again.",
  FORBIDDEN: "Access denied. You will be redirected to the login page.",
  SERVER_ERROR: "Server error occurred. Please try again later.",
  CONFLICT: "A conflict occurred with your request.",
  DEFAULT: "An unexpected error occurred. Please try again."
} as const

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

// Function to log out user (only called for 403 errors)
const logOut = () => {
  localStorage.clear()
  window.location.href = '/'
}

// Function to determine error type and message
const getErrorInfo = (error: any) => {
  // Network errors (no response from server)
  if (!error.response) {
    if (error.code === 'ERR_NETWORK') {
      return {
        type: 'NETWORK_ERROR',
        message: ERROR_MESSAGES.NETWORK_ERROR,
        shouldShowToast: true
      }
    }
    // CORS errors typically don't have a response
    if (error.message?.includes('CORS') || error.code === 'ERR_BLOCKED_BY_CLIENT') {
      return {
        type: 'CORS_ERROR',
        message: ERROR_MESSAGES.CORS_ERROR,
        shouldShowToast: true
      }
    }
    return {
      type: 'NETWORK_ERROR',
      message: ERROR_MESSAGES.NETWORK_ERROR,
      shouldShowToast: true
    }
  }

  const status = error.response.status
  const responseMessage = error.response?.data?.message || error.response?.data?.error

  // Handle specific status codes
  switch (status) {
    case 401:
      return {
        type: 'UNAUTHORIZED',
        message: responseMessage || ERROR_MESSAGES.UNAUTHORIZED,
        shouldShowToast: true,
        shouldLogout: false
      }
    
    case 403:
      return {
        type: 'FORBIDDEN',
        message: responseMessage || ERROR_MESSAGES.FORBIDDEN,
        shouldShowToast: true,
        shouldLogout: true
      }
    
    case 409:
      return {
        type: 'CONFLICT',
        message: responseMessage || ERROR_MESSAGES.CONFLICT,
        shouldShowToast: true
      }
    
    case 500:
      return {
        type: 'SERVER_ERROR',
        message: responseMessage || ERROR_MESSAGES.SERVER_ERROR,
        shouldShowToast: true
      }
    
    default:
      // Handle 4xx errors (client errors)
      if (status >= 400 && status < 500) {
        return {
          type: 'CLIENT_ERROR',
          message: responseMessage || ERROR_MESSAGES.DEFAULT,
          shouldShowToast: !!responseMessage // Only show toast if there's a specific message
        }
      }
      
      // Handle 5xx errors (server errors)
      if (status >= 500) {
        return {
          type: 'SERVER_ERROR',
          message: responseMessage || ERROR_MESSAGES.SERVER_ERROR,
          shouldShowToast: true
        }
      }
      
      return {
        type: 'UNKNOWN_ERROR',
        message: responseMessage || ERROR_MESSAGES.DEFAULT,
        shouldShowToast: !!responseMessage
      }
  }
}

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    "x-api-key": $X_API_KEY
  },
})

export const GATEWAY_ENDPOINT_V2 = axios.create({
  baseURL: $GATEWAY_ENDPOINT_V2,
})

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    "x-api-key": $X_API_KEY
  },
})

export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    "x-api-key": $X_API_KEY,
    "Content-Type": "multipart/form-data",
  },
})

export const GATEWAY_ENDPOINT_WITHOUT_VERSION = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
})

export const GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
  headers: {
    "x-api-key": $X_API_KEY
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
      // const { token } = useUser()
      const token = localStorage.getItem('token')
      
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
    (error: any) => {
      console.error('API Error:', error.response.data)
      console.error('API Error daat:', error.data)

      const errorInfo = getErrorInfo(error)

      // Handle logout for 403 errors only
      if (errorInfo.shouldLogout) {
        logOut()
        return Promise.reject(error)
      }

      // Show toast notification if needed
      if (errorInfo.shouldShowToast) {
        showToast({
          title: "Error",
          message: errorInfo.message,
          toastType: "error",
          duration: 3000,
        })
      }

      // Return error response for further handling if needed
      if (error.response) {
        return {
          type: "ERROR",
          ...error.response,
        }
      }

      // For network/CORS errors without response, reject the promise
      return Promise.reject(error)
    },
  )
})