import { decryptData } from "@/api_factory/encrypt-data"
import forge from "node-forge"

/**
 * Generates a 32-bit complicated hash for session token
 * @returns {string} A 32-character hexadecimal hash
 */
export const generateSessionToken = (): string => {
  try {
    // Generate random bytes for entropy
    const randomBytes = forge.random.getBytesSync(32)

    // Add timestamp for uniqueness
    const timestamp = Date.now().toString()

    // Add additional entropy from crypto random
    const additionalEntropy = forge.random.getBytesSync(16)

    // Combine all entropy sources
    const combinedData = randomBytes + timestamp + additionalEntropy

    // Create SHA-256 hash
    const md = forge.md.sha256.create()
    md.update(combinedData)
    const hash = md.digest().toHex()

    // Take first 32 characters to ensure 32-bit length
    const sessionToken = hash.substring(0, 32)

    console.log("Generated session token length:", sessionToken.length)
    return sessionToken
  } catch (error) {
    console.error("Error generating session token:", error)
    throw new Error("Failed to generate session token")
  }
}

/**
 * Stores encrypted session token in session storage
 * @param {string} encryptedSessionToken - The encrypted session token
 */
export const storeSessionToken = (encryptedSessionToken: string): void => {
  try {
    sessionStorage.setItem("encrypted_session_token", encryptedSessionToken)
    console.log("Session token stored in session storage")
  } catch (error) {
    console.error("Error storing session token:", error)
    throw new Error("Failed to store session token")
  }
}

export const storeSessionJwtToken = (jwtSessionToken: string): void => {
  try {
    sessionStorage.setItem("jwt_session_token", jwtSessionToken)
    console.log("Session token stored in session storage")
  } catch (error) {
    console.error("Error storing session token:", error)
    throw new Error("Failed to store session token")
  }
}

export const storeSessionInfoObj = (sessionInfo: Record<string, any>): void => {
  try {
    sessionStorage.setItem("session_info", sessionInfo)
    console.log("Session token stored in session storage")
  } catch (error) {
    console.error("Error storing session token:", error)
    throw new Error("Failed to store session token")
  }
}

/**
 * Retrieves encrypted session token from session storage
 * @returns {string | null} The encrypted session token or null if not found
 */
export const getSessionToken = (): string | null => {
  try {
    const encryptedToken = sessionStorage.getItem("encrypted_session_token")
    return encryptedToken
  } catch (error) {
    console.error("Error retrieving session token:", error)
    return null
  }
}

/**
 * Decrypts and returns the session token
 * @returns {string | null} The decrypted session token or null if not found/invalid
 */
export const getDecryptedSessionToken = (): string | null => {
  try {
    const encryptedToken = getSessionToken()
    if (!encryptedToken) {
      return null
    }

    const decryptedToken = decryptData(encryptedToken)
    return decryptedToken
  } catch (error) {
    console.error("Error decrypting session token:", error)
    return null
  }
}

/**
 * Clears session token from session storage
 */
// export const clearSessionToken = (): void => {
//   try {
//     sessionStorage.removeItem("encrypted_session_token")
//     console.log("Session token cleared from session storage")
//   } catch (error) {
//     console.error("Error clearing session token:", error)
//   }
// }

/**
 * Validates if session token exists and is valid
 * @returns {boolean} True if session token is valid
 */
export const isSessionTokenValid = (): boolean => {
  try {
    const decryptedToken = getDecryptedSessionToken()
    return decryptedToken !== null && decryptedToken.length === 32
  } catch (error) {
    console.error("Error validating session token:", error)
    return false
  }
}
