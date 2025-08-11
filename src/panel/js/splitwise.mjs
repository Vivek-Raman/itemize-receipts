export const trySplitwise = async () => {
  if (await isSplitwiseOpen()) {
    const container = document.getElementById('splitwise-container');
    if (container) {
      container.innerHTML = `
        <button id="insertToSplitwise">Insert to Splitwise</button>
      `.trim();
    }
  }
}

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
