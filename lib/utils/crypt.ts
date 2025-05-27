export async function encryptNote(content: string, password: string) {
    // Generate a random salt and IV for encryption
    const salt = window.crypto.getRandomValues(new Uint8Array(16));  // 16-byte salt
    const iv = window.crypto.getRandomValues(new Uint8Array(12));   // 12-byte IV (AES-GCM standard)
  
    // Derive the encryption key from the password using PBKDF2
    const key = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
  
    const derivedKey = await window.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      key,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );
  
    // Encrypt the content
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      derivedKey,
      data
    );
  
    // Convert the encrypted content, salt, and IV to base64 for storage
    const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    const saltBase64 = btoa(String.fromCharCode(...salt));
    const ivBase64 = btoa(String.fromCharCode(...iv));
  
    return {
      ciphertext: encryptedBase64,
      salt: saltBase64,
      iv: ivBase64,
    };
  }
  

export async function decryptNote(
    ciphertext: string,
    password: string,
    salt: string,
    iv: string
  ) {
    // Convert the base64 encoded strings back to binary data
    const ciphertextBytes = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const saltBytes = Uint8Array.from(atob(salt), c => c.charCodeAt(0));
    const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
  
    // Derive the encryption key using PBKDF2 with salt
    const key = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
  
    const derivedKey = await window.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: saltBytes, iterations: 100000, hash: "SHA-256" },
      key,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
  
    // Decrypt the data
    try {
      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBytes },
        derivedKey,
        ciphertextBytes
      );
  
      // Convert decrypted data to text (assuming UTF-8 encoding)
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error("Decryption failed", error);
      throw new Error("Decryption failed. Invalid or corrupted ciphertext.");
    }
  }
  

// async function getKeyMaterial(password: string) {
//     const enc = new TextEncoder()
//     return crypto.subtle.importKey(
//         "raw",
//         enc.encode(password),
//         { name: "PBKDF2" },
//         false,
//         ["deriveKey"]
//     )
// }

// async function deriveKey(keyMaterial: CryptoKey, salt: Uint8Array) {
//     return crypto.subtle.deriveKey(
//         {
//             name: "PBKDF2",
//             salt,
//             iterations: 100000,
//             hash: "SHA-256"
//         },
//         keyMaterial,
//         { name: "AES-GCM", length: 256 },
//         false,
//         ["encrypt", "decrypt"]
//     )
// }
