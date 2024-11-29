// Derive a key from the passphrase using the Web Crypto API
async function deriveKey(passphrase: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(16), // Fixed salt (16 bytes of zeros)
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

// Encrypt function
export async function encrypt(
  text: string,
  passphrase: string,
): Promise<string> {
  const key = await deriveKey(passphrase);
  const iv = new Uint8Array(16); // Static IV (16 bytes of zeros)
  const encoder = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    encoder.encode(text),
  );
  return btoa(String.fromCharCode(...new Uint8Array(ciphertext))); // Convert ArrayBuffer to Base64
}

// Decrypt function
export async function decrypt(
  encryptedText: string,
  passphrase: string,
): Promise<string> {
  const key = await deriveKey(passphrase);
  const iv = new Uint8Array(16); // Static IV (16 bytes of zeros)
  const decoder = new TextDecoder();
  const ciphertext = Uint8Array.from(atob(encryptedText), (c) =>
    c.charCodeAt(0),
  ); // Convert Base64 to ArrayBuffer
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    key,
    ciphertext,
  );
  return decoder.decode(plaintext);
}
