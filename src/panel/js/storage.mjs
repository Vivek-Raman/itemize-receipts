import { decryptStringWithPassphrase } from "../../common/crypto.mjs";

export const persistContents = async (contents) => {
  await chrome.storage.local.set({ contents });
}

export const clearContents = async () => {
  await chrome.storage.local.remove('contents');
}

export const loadPersistedContents = async () => {
  const { contents } = await chrome.storage.local.get(['contents']);
  return contents;
}

export const fetchSettings = async (passphrase) => {
  const { apiUrl, models } = await chrome.storage.sync.get(['apiUrl', 'models']);
  const { apiKeyEnc } = await chrome.storage.local.get(['apiKeyEnc']);

  if (!models) {
    throw new Error('No models found. Please select models in Settings.');
  }

  if (!apiKeyEnc) {
    throw new Error('No encrypted API key found. Please save your API key in Settings.');
  }
  if (!passphrase) {
    throw new Error('Passphrase is required to decrypt the API key.');
  }

  try {
    const apiKey = await decryptStringWithPassphrase({
      encrypted: apiKeyEnc,
      passphrase,
    });
    return {
      apiUrl,
      apiKey,
      models,
    };
  } catch (error) {
    throw new Error('Failed to decrypt the API key. Please check your passphrase and try again.');
  }
};
