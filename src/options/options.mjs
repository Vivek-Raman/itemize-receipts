import { loadSettings, saveSettings } from './storage.mjs';
import { handleChangeToApiUrlSelect, handleLinks, populateSettings } from './view.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  const settings = await loadSettings();
  await populateSettings(settings);

  handleLinks();

  const refreshModelsButton = document.getElementById('refresh-models');
  refreshModelsButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const settings = await loadSettings();
    await populateSettings(settings);
  });
});

const form = document.getElementById('settings');
form.addEventListener('change', (event) => {
  const formKey = event.target.name;
  const formValue = event.target.value;

  if (formKey === 'apiUrlSelect') {
    handleChangeToApiUrlSelect(formValue);
  }

  saveSettings(form);
});
