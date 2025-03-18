/**
 * Encryption utilities for end-to-end encrypted messaging
 * Uses Web Crypto API for secure encryption/decryption
 */

// Generate a new key pair for a user
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Export public key to share with other users
export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("spki", publicKey);
  return arrayBufferToBase64(exported);
}

// Import a public key from another user
export async function importPublicKey(
  publicKeyString: string
): Promise<CryptoKey> {
  const keyData = base64ToArrayBuffer(publicKeyString);
  return window.crypto.subtle.importKey(
    "spki",
    keyData,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

// Encrypt a message with recipient's public key
export async function encryptMessage(
  message: string,
  publicKey: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    data
  );

  return arrayBufferToBase64(encryptedData);
}

// Decrypt a message with your private key
export async function decryptMessage(
  encryptedMessage: string,
  privateKey: CryptoKey
): Promise<string> {
  const encryptedData = base64ToArrayBuffer(encryptedMessage);

  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encryptedData
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

// Helper function to convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper function to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Store keys securely in browser
export function storeKeyPair(userId: string, keyPair: CryptoKeyPair): void {
  // In a real app, you would store these more securely
  // This is a simplified example
  localStorage.setItem(
    `${userId}_publicKey`,
    JSON.stringify(keyPair.publicKey)
  );
  localStorage.setItem(
    `${userId}_privateKey`,
    JSON.stringify(keyPair.privateKey)
  );
}

// Retrieve keys from storage
export function getStoredKeyPair(userId: string): CryptoKeyPair | null {
  const publicKey = localStorage.getItem(`${userId}_publicKey`);
  const privateKey = localStorage.getItem(`${userId}_privateKey`);

  if (!publicKey || !privateKey) return null;

  return {
    publicKey: JSON.parse(publicKey),
    privateKey: JSON.parse(privateKey),
  };
}
