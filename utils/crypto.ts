import forge from 'node-forge'
import { useRuntimeConfig } from '#app'

// Function to encrypt data for requests
export function encryptData(rawData: any): string {
  try {
    const config = useRuntimeConfig()
    let publicKeyPem = config.public.publicKey
    
    // Clean up the public key - ensure it's properly formatted
    if (!publicKeyPem.includes('-----BEGIN PUBLIC KEY-----')) {
      // If the key doesn't have proper PEM headers, try to format it
      publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${publicKeyPem}\n-----END PUBLIC KEY-----`;
    }
    
    // Normalize line breaks and remove extra whitespace
    publicKeyPem = publicKeyPem
      .replace(/\r\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
    
    const data = typeof rawData === 'string' ? rawData : JSON.stringify(rawData)

    // 1. Generate random AES key and IV
    const aesKey = forge.random.getBytesSync(32) // 256-bit key
    const iv = forge.random.getBytesSync(16) // 128-bit IV

    // 2. Encrypt data with AES
    const cipher = forge.cipher.createCipher('AES-GCM', aesKey)
    cipher.start({ iv })
    cipher.update(forge.util.createBuffer(data))
    cipher.finish()
    const encrypted = cipher.output.getBytes()
    const tag = cipher.mode.tag.getBytes()

    // 3. Encrypt the AES key with RSA
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem)
    const encryptedKey = publicKey.encrypt(aesKey, 'RSA-OAEP')

    // 4. Combine all components
    const payload = {
      iv: forge.util.encode64(iv),
      encrypted: forge.util.encode64(encrypted),
      tag: forge.util.encode64(tag),
      key: forge.util.encode64(encryptedKey)
    }

    return forge.util.encode64(JSON.stringify(payload))
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data: ' + (error instanceof Error ? error.message : String(error)))
  }
}

// Function to check if response data is encrypted
export function isEncryptedData(data: any): boolean {
  if (!data || typeof data !== 'string') return false

  try {
    const decoded = forge.util.decode64(data)
    const parsed = JSON.parse(decoded)
    return parsed.iv && parsed.encrypted && parsed.tag && parsed.key
  } catch (error) {
    return false
  }
}

// Function to decrypt response data
export function decryptData(encryptedData: string): any {
  try {
    const config = useRuntimeConfig()
    let privateKeyPem = config.decryptKey
    
    if (!privateKeyPem) {
      throw new Error('Decryption key not available')
    }
    
    // Clean up the private key - ensure it's properly formatted
    if (!privateKeyPem.includes('-----BEGIN PRIVATE KEY-----') && 
        !privateKeyPem.includes('-----BEGIN RSA PRIVATE KEY-----')) {
      // If the key doesn't have proper PEM headers, try to format it as RSA PRIVATE KEY
      privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----\n${privateKeyPem}\n-----END RSA PRIVATE KEY-----`;
    }
    
    // Normalize line breaks and remove extra whitespace
    privateKeyPem = privateKeyPem
      .replace(/\r\n/g, '\n')
      .trim();
    
    // 1. Decode the base64 payload
    const decodedPayload = forge.util.decode64(encryptedData)
    const payload = JSON.parse(decodedPayload)

    // 2. Use the private key from environment variables
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem)

    // 3. Decrypt the AES key with RSA
    const encryptedKey = forge.util.decode64(payload.key)
    const aesKey = privateKey.decrypt(encryptedKey, 'RSA-OAEP')

    // 4. Decrypt the data with AES-GCM
    const iv = forge.util.decode64(payload.iv)
    const encrypted = forge.util.decode64(payload.encrypted)
    const tag = forge.util.decode64(payload.tag)

    const decipher = forge.cipher.createDecipher('AES-GCM', aesKey)
    decipher.start({
      iv: iv,
      tag: forge.util.createBuffer(tag)
    })
    decipher.update(forge.util.createBuffer(encrypted))
    const result = decipher.finish()

    if (!result) {
      throw new Error('Authentication failed - invalid tag')
    }

    // 5. Parse the decrypted data
    const decryptedData = decipher.output.toString()
    return JSON.parse(decryptedData)
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data: ' + (error instanceof Error ? error.message : String(error)))
  }
}