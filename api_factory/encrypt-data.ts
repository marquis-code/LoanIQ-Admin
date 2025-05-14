"use client"

import axios, { type AxiosResponse } from "axios"
import { useUser } from "@/composables/auth/user"
import { useCustomToast } from "@/composables/core/useCustomToast"
// import * as forge from "node-forge"
import forge from "node-forge";
import path from "path"
import fs from "fs"

const $GATEWAY_ENDPOINT_WITHOUT_VERSION = import.meta.env.VITE_BASE_URL as string
const $GATEWAY_ENDPOINT = import.meta.env.VITE_BASE_URL + "/v1"
const $GATEWAY_ENDPOINT_V2 = import.meta.env.VITE_BASE_URL + "/v2"
const $IMAGE_UPLOAD_ENDPOINT = import.meta.env.VITE_IMAGE_UPLOAD_BASE_URL as string

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

// Public key should be stored as a string constant or fetched from an API
// instead of reading from the filesystem
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY
const DECRYPT_PUBLIC_KEY = import.meta.env.VITE_DECRYPT_KEY

// Function to encrypt data for requests
export function encryptData(rawData: any): string {
  try {
    const data = typeof rawData === "string" ? rawData : JSON.stringify(rawData)

    // 1. Generate random AES key and IV
    const aesKey = forge.random.getBytesSync(32) // 256-bit key
    const iv = forge.random.getBytesSync(16) // 128-bit IV

    // 2. Encrypt data with AES
    const cipher = forge.cipher.createCipher("AES-GCM", aesKey)
    cipher.start({ iv })
    cipher.update(forge.util.createBuffer(data))
    cipher.finish()
    const encrypted = cipher.output.getBytes()
    const tag = cipher.mode.tag.getBytes()

    // 3. Encrypt the AES key with RSA
    // Use the hardcoded public key instead of reading from filesystem
    const publicKey = forge.pki.publicKeyFromPem(PUBLIC_KEY)
    const encryptedKey = publicKey.encrypt(aesKey, "RSA-OAEP")

    // 4. Combine all components
    const payload = {
      iv: forge.util.encode64(iv),
      encrypted: forge.util.encode64(encrypted),
      tag: forge.util.encode64(tag),
      key: forge.util.encode64(encryptedKey),
    }

    return forge.util.encode64(JSON.stringify(payload))
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt data")
  }
}

// Function to check if response data is encrypted
export function isEncryptedData(data: any): boolean {
  if (!data || typeof data !== "string") return false

  try {
    const decoded = forge.util.decode64(data)
    const parsed = JSON.parse(decoded)
    return parsed.iv && parsed.encrypted && parsed.tag && parsed.key
  } catch (error) {
    return false
  }
}

// Function to decrypt response data
// export function decryptData(encryptedData: string): any {
//   try {
//     // 1. Decode the base64 payload
//     const decodedPayload = forge.util.decode64(encryptedData)
//     const payload = JSON.parse(decodedPayload)

//     // 2. Get the private key for decryption
//     // const rootDirectory = path.resolve(__dirname, "../..")
//     // const privateKeyPem = fs.readFileSync(rootDirectory + "/private_key.pem", "utf-8")
//     const privateKey = forge.pki.privateKeyFromPem(DECRYPT_PUBLIC_KEY)

//     // 3. Decrypt the AES key with RSA
//     const encryptedKey = forge.util.decode64(payload.key)
//     const aesKey = privateKey.decrypt(encryptedKey, "RSA-OAEP")

//     // 4. Decrypt the data with AES-GCM
//     const iv = forge.util.decode64(payload.iv)
//     const encrypted = forge.util.decode64(payload.encrypted)
//     const tag = forge.util.decode64(payload.tag)

//     const decipher = forge.cipher.createDecipher("AES-GCM", aesKey)
//     decipher.start({
//       iv: iv,
//       tag: forge.util.createBuffer(tag),
//     })
//     decipher.update(forge.util.createBuffer(encrypted))
//     const result = decipher.finish()

//     if (!result) {
//       throw new Error("Authentication failed - invalid tag")
//     }

//     // 5. Parse the decrypted data
//     const decryptedData = decipher.output.toString()
//     return JSON.parse(decryptedData)
//   } catch (error) {
//     console.error("Decryption error:", error)
//     throw new Error("Failed to decrypt data")
//   }
// }

// export function decryptData(encryptedData: string): any {
//   try {
//     // 1. Decode the base64 payload
//     const decodedPayload = forge.util.decode64(encryptedData)
//     const payload = JSON.parse(decodedPayload)

//     // 2. Get the private key for decryption
//     // Use the hardcoded private key instead of reading from filesystem
//     const privateKey = forge.pki.privateKeyFromPem(DECRYPT_PUBLIC_KEY)

//     // 3. Decrypt the AES key with RSA
//     const encryptedKey = forge.util.decode64(payload.key)
//     const aesKey = privateKey.decrypt(encryptedKey, "RSA-OAEP")

//     // 4. Decrypt the data with AES-GCM
//     const iv = forge.util.decode64(payload.iv)
//     const encrypted = forge.util.decode64(payload.encrypted)
//     const tag = forge.util.decode64(payload.tag)

//     const decipher = forge.cipher.createDecipher("AES-GCM", aesKey)
//     decipher.start({
//       iv: iv,
//       tag: forge.util.createBuffer(tag),
//     })
//     decipher.update(forge.util.createBuffer(encrypted))
//     const result = decipher.finish()

//     if (!result) {
//       throw new Error("Authentication failed - invalid tag")
//     }

//     // 5. Parse the decrypted data
//     const decryptedData = decipher.output.toString()
//     return JSON.parse(decryptedData)
//   } catch (error) {
//     console.error("Decryption error:", error)
//     throw new Error("Failed to decrypt data")
//   }
// }

export function decryptData(encryptedData: string): any {
  try {
    // Ensure encryptedData is a string
    if (typeof encryptedData !== 'string') {
      throw new Error('Encrypted data must be a string');
    }

    // 1. Decode the base64 payload
    // forge.util.decode64 returns a binary string, not a JSON string
    const decodedPayload = forge.util.decode64(encryptedData);
    
    // Convert binary string to regular string if needed
    const jsonString = typeof decodedPayload === 'string' 
      ? decodedPayload 
      : forge.util.decodeUtf8(decodedPayload);
    
    const payload = JSON.parse(jsonString);

    // 2. Get the private key for decryption
    const privateKey = forge.pki.privateKeyFromPem(DECRYPT_PUBLIC_KEY);

    // 3. Decrypt the AES key with RSA
    const encryptedKey = forge.util.decode64(payload.key);
    const aesKey = privateKey.decrypt(encryptedKey, "RSA-OAEP");

    // 4. Decrypt the data with AES-GCM
    const iv = forge.util.decode64(payload.iv);
    const encrypted = forge.util.decode64(payload.encrypted);
    const tag = forge.util.decode64(payload.tag);

    const decipher = forge.cipher.createDecipher("AES-GCM", aesKey);
    decipher.start({
      iv: iv,
      tag: forge.util.createBuffer(tag),
    });
    decipher.update(forge.util.createBuffer(encrypted));
    const result = decipher.finish();

    if (!result) {
      throw new Error("Authentication failed - invalid tag");
    }

    // 5. Parse the decrypted data
    const decryptedData = decipher.output.toString();
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error(`Failed to decrypt data: ${error.message}`);
  }
}

const useMemoizedUser = () => useUser()

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
      const { token } = useMemoizedUser()

      // Add authorization token if available
      if (token.value) {
        config.headers.Authorization = `Bearer ${token.value}`
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
      const { logOut } = useMemoizedUser()
      // Check if the response data needs to be decrypted
      if (response.data && response.data.data && isEncryptedData(response.data.data)) {
        try {
          // Decrypt the response data
          response.data = decryptData(response.data.data)
        } catch (error) {
          console.error("Failed to decrypt response:", error)
          // Return the original response if decryption fails
        }
      }
      return response
    },
    (err: any) => {
      const { logOut } = useMemoizedUser()
      const { showToast } = useCustomToast()
      if (typeof err.response === "undefined") {
        showToast({
          title: "Error",
          message: "kindly check your network connection",
          toastType: "error",
          duration: 3000,
        })
        logOut()
        return {
          type: "ERROR",
          ...err.response,
        }
      }

      // Handle error responses
      if (err.response?.status === 401) {
        logOut()
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
