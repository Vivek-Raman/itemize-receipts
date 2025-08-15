import { loadSettings, saveSettings } from './storage.mjs';
import { handleLinks, populateSettings } from './view.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  const settings = await loadSettings();
  await populateSettings(settings);

  handleLinks();

  const refreshModelsButton = document.getElementById('refresh-models');
  refreshModelsButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await reloadSettings();
  });
});

const form = document.getElementById('settings');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  await reloadSettings(form);
});

const reloadSettings = async () => {
  await saveSettings(form);
  const settings = await loadSettings();
  await populateSettings(settings);
};
