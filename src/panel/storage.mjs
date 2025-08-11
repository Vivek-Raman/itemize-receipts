import { drawContents } from "./view.js";

export const persistContents = async (contents) => {
  const doc = {
    contents: contents,
  };
  await chrome.storage.session.set(doc);
}

export const clearContents = async () => {
  await chrome.storage.session.remove('contents');
}

export const loadPersistedContents = async () => {
  const doc = await chrome.storage.session.get(['contents']);
  if (doc?.contents) {
    await drawContents(doc.contents);
  }
}

export const getApiKey = async () => {
  const result = await chrome.storage.sync.get(['openrouterApiKey']);
  return result.openrouterApiKey;
};
