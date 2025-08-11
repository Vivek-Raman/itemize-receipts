chrome.sidePanel.setPanelBehavior({
  openPanelOnActionClick: true,
}).catch(err => console.error(err));

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    const settings = await chrome.storage.sync.get(['apiUrlSelect', 'apiUrl', 'apiKey']);
    const hasSettings = Object.values(settings).some(value => value);

    if (!hasSettings) {
      await chrome.runtime.openOptionsPage();
    }
  }
});
