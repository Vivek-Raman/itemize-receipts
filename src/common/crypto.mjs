export const getRandomBytes = (length = 12) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const base64Encode = (arrayBuffer) => {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

const base64Decode = (base64) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

export const deriveKeyFromPassphrase = async ({
  passphrase,
  salt,
  iterations = 150000,
}) => {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  return aesKey;
};

export const encryptStringWithPassphrase = async ({
  plaintext,
  passphrase,
  iterations = 150000,
}) => {
  const salt = getRandomBytes(16);
  const iv = getRandomBytes(12);
  const key = await deriveKeyFromPassphrase({ passphrase, salt, iterations });
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    textEncoder.encode(plaintext)
  );

  return {
    version: 1,
    algorithm: "AES-GCM",
    kdf: "PBKDF2-SHA256",
    iterations,
    iv: base64Encode(iv),
    salt: base64Encode(salt),
    ciphertext: base64Encode(ciphertextBuffer),
  };
};

export const decryptStringWithPassphrase = async ({
  encrypted,
  passphrase,
}) => {
  const salt = new Uint8Array(base64Decode(encrypted.salt));
  const iv = new Uint8Array(base64Decode(encrypted.iv));
  const key = await deriveKeyFromPassphrase({
    passphrase,
    salt,
    iterations: encrypted.iterations ?? 150000,
  });

  const plaintextBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    base64Decode(encrypted.ciphertext)
  );

  return textDecoder.decode(plaintextBuffer);
};
