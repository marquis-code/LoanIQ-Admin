import forge from "node-forge";

// Sample RSA public key (PEM format)
// const publicKeyPem = `-----BEGIN PUBLIC KEY-----
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7j2K3FwYJ8V9F9d9EmjDD
// YO4tsQfHGwkjbAsn0nsYW1lH4rAnjXhWBsU2u1kN0jvLO3f9z6b9c9z2ZWKmc4yKz
// pI0aH0F6IWZ0MP2T03etqGZT5z7yTS0DQ8ZXmwF0FJhEoAURrZX1F32cldp6xt6r
// j+LzQXohqSuVbr4vn5n5fFwdy19S5t1nDpxOveF5WrgGZ4r+nsz8HTYRU8GPl/J2
// hVY9M3nAeyT7XwZobVcjpYcG1B5yy9e8XtQXtReRm2mwktbA1GrfReBvmXglHeGZ
// 1p0y9ImuOd7qB3HvAPrPGKv9ECQgA5lpdIMWL0XU0aVpeOVgBE6NSHPO8VtJK9pL
// XwIDAQAB
// -----END PUBLIC KEY-----`;

const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvfxfIYJUobaYDLCbwo7o
fI078SCuwEZ71BoDZYnDLfgn6ojEiWlpF2cnLyecWz9AkesykI3JEjweQuR+/Vwu
pWjIPkfE/IdJ/Qvyhojifo5lsk7CWpb+O/nlwiEHz3bkF5gvPzv56f5AW9eUe6Q5
633nrzagPEKpEhZ3hVk2zLxcLwLmm4dzO6pyriaFxKX1Uqm3l+BEBDZ7eZGw7b+3
Erv6SK6L/N4kHDCxNSIOwJTH6E3Wn2XEuRkmiHzEIDcJLPtwx0OIzvjrHxgbt21t
cRQvRQa9Mc88RYyIKHZzIDVhqLuF7wX39Zg8kamFUuifgVJAj84zk7ODAxig6QjK
BwIDAQAB
-----END PUBLIC KEY-----`

const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

export function encryptData(data: string): string {
  const encryptedData = publicKey.encrypt(forge.util.encodeUtf8(data), "RSA-OAEP");
  return forge.util.encode64(encryptedData); // Return the encrypted data as base64 encoded string
}
