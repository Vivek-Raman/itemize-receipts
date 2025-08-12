export const loadSettings = async () => {
  // FIXME: Not secure!
  const doc = await chrome.storage.sync.get([
    'apiUrlSelect', 'apiUrl', 'apiKey', "models",
  ]);
  return doc;
};

export const saveSettings = async (form) => {
  // FIXME: Not secure!
  const doc = {
    apiUrlSelect: form.apiUrlSelect.value,
    apiUrl: form.apiUrl.value,
    apiKey: form.apiKey.value,
    models: Array.from(form.models.selectedOptions).map(option => option.value),
  }
  await chrome.storage.sync.set(doc);
}
