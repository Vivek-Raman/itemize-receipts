import { encryptStringWithPassphrase } from "../common/crypto.mjs";

export const loadSettings = async () => {
  const doc = await chrome.storage.sync.get([
    'apiUrlSelect', 'apiUrl', 'models',
  ]);
  return doc;
};

export const saveSettings = async (form) => {
  const doc = {
    apiUrlSelect: form.apiUrlSelect.value,
    apiUrl: form.apiUrl.value,
    models: Array.from(form.models.selectedOptions).map(option => option.value),
  };

  await chrome.storage.sync.set(doc);

  const apiKey = form.apiKey?.value?.trim();
  const passphrase = form.passphrase?.value?.trim();

  if (apiKey) {
    if (!passphrase) {
      console.warn("Passphrase is required to encrypt the API key. The API key was not stored.");
    } else {
      try {
        const encrypted = await encryptStringWithPassphrase({
          plaintext: apiKey,
          passphrase,
        });
        await chrome.storage.local.set({ apiKeyEnc: encrypted });
      } catch (err) {
        console.error("Failed to encrypt and store API key:", err);
      }
    }
  }
};
