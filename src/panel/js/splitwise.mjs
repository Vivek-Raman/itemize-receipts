export const isSplitwiseOpen = async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true, currentWindow: true,
    });
    if (!tab || !tab.url) {
      return false;
    }
    return tab.url.startsWith('https://secure.splitwise.com/');

  } catch (error) {
    return false;
  }
};