export const loadSettings = async () => {
  // FIXME: Not secure!
  const doc = await chrome.storage.sync.get(['apiUrlSelect', 'apiUrl', 'apiKey']);
  return doc;
};

export const saveSettings = async (form) => {
  // FIXME: Not secure!
  const doc = {
    apiUrlSelect: form.apiUrlSelect.value,
    apiUrl: form.apiUrl.value,
    apiKey: form.apiKey.value,
  }
  await chrome.storage.sync.set(doc);
}

export const saveApiKey = async (apiKey) => {
  if (!apiKey) return;

  try {
    await chrome.storage.sync.set({ openrouterApiKey: apiKey });
  } catch (error) {
    console.error('Error saving API key:', error);
  }
};
