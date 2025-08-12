import { drawContents } from "./view.mjs";

export const persistContents = async (contents) => {
  const doc = {
    contents: contents,
  };
  await chrome.storage.session.set(doc);
}

export const clearContents = async () => {
  await chrome.storage.session.remove('contents');
}

export const loadPersistedContents = async (logger) => {
  const doc = await chrome.storage.session.get(['contents']);
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
