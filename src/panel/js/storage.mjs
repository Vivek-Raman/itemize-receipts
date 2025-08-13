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
  const result = await chrome.storage.sync.get(['apiUrl']);
  const { apiKeyEnc } = await chrome.storage.local.get(['apiKeyEnc']);

  if (!apiKeyEnc) {
    throw new Error('No encrypted API key found. Please save your API key in Settings.');
  }
  if (!passphrase) {
    throw new Error('Passphrase is required to decrypt the API key.');
  }

  const apiKey = await decryptStringWithPassphrase({
    encrypted: apiKeyEnc,
    passphrase,
  });

  const doc = {
    apiUrl: result.apiUrl,
    apiKey,
  };
  return doc;
};
