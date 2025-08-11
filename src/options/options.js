// Load saved API key when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadApiKey();
});

// Load API key from Chrome storage
const loadApiKey = async () => {
  try {
    const result = await chrome.storage.sync.get(['openrouterApiKey']);
    if (result.openrouterApiKey) {
      document.getElementById('apiKey').value = result.openrouterApiKey;
    }
  } catch (error) {
    console.error('Error loading API key:', error);
    showStatus('Error loading settings', 'error');
  }
};

// Save API key to Chrome storage
const saveApiKey = async (apiKey) => {
  try {
    await chrome.storage.sync.set({ openrouterApiKey: apiKey });
    showStatus('Settings saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving API key:', error);
    showStatus('Error saving settings', 'error');
  }
};

// Show status message
const showStatus = (message, type) => {
  const statusElement = document.getElementById('status');
  statusElement.textContent = message;
  statusElement.className = `status ${type}`;
  statusElement.style.display = 'block';

  // Hide status after 3 seconds
  setTimeout(() => {
    statusElement.style.display = 'none';
  }, 3000);
};

// Handle form submission
document.getElementById('settingsForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const apiKey = document.getElementById('apiKey').value.trim();

  if (!apiKey) {
    showStatus('Please enter an API key', 'error');
    return;
  }

  saveApiKey(apiKey);
});