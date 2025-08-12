import { loadAvailableModels } from "./models.mjs";

export const populateSettings = async (settings) => {
  const apiUrlSelect = document.getElementById('apiUrlSelect');
  apiUrlSelect.value = settings.apiUrlSelect;
  handleChangeToApiUrlSelect(settings.apiUrlSelect);

  const apiUrl = document.getElementById('apiUrl');
  apiUrl.value = settings.apiUrl ?? '';

  const apiKey = document.getElementById('apiKey');
  apiKey.value = settings.apiKey;

  const modelSelector = document.getElementById('available-models');
  const models = await loadAvailableModels(settings, true);
  models?.forEach(model => {
    const option = document.createElement('option');
    option.value = model.id;
    option.textContent = `${model.id} (${model.price})`;
    option.selected = settings.models?.includes(model.id);
    modelSelector.appendChild(option);
  });

}

export const handleChangeToApiUrlSelect = (formValue) => {
  const apiUrlInputField = document.getElementById('apiUrl');
  if (formValue === 'OTHER') {
    apiUrlInputField.value = '';
    apiUrlInputField.disabled = false;
  } else {
    apiUrlInputField.value = formValue;
    apiUrlInputField.disabled = true;
  }
}

export const handleLinks = () => {
  wireUpLink("openAbout", "https://vivekraman.dev/blog/itemize-receipts");
}

const wireUpLink = (linkId, url) => {
  const container = document.getElementById(linkId);
  if (container) {
    container.addEventListener("click", (event) => {
      event.preventDefault();
      if (typeof browser !== 'undefined' && browser.tabs) {
        browser.tabs.create({ url: url });
      } else if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url: url });
      } else {
        window.open(url, "_blank");
      }
    });
  }
}
