import { loadSettings, saveSettings } from './storage.mjs';
import { handleChangeToApiUrlSelect, handleLinks, populateSettings } from './view.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  const settings = await loadSettings();
  populateSettings(settings);

  handleLinks();
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
