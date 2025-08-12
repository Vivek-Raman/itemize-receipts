import { drawContents } from "./view.mjs";

export const persistContents = async (contents) => {
  await chrome.storage.local.set({ contents });
}

export const clearContents = async () => {
  await chrome.storage.local.remove('contents');
}

export const loadPersistedContents = async (logger) => {
  const doc = await chrome.storage.local.get(['contents']);
  if (doc?.contents) {
    await drawContents(doc.contents);
    logger.log("Loaded previous scan from storage.");
  }
}

export const fetchSettings = async () => {
  const result = await chrome.storage.sync.get(['apiUrl', 'apiKey']);
  const doc = {
    apiUrl: result.apiUrl,
    apiKey: result.apiKey,
  };
  return doc;
};
