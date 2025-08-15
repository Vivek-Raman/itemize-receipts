import { parseResponse, submitPrompt } from "./js/ai.mjs";
import { Logger } from "./js/logger.mjs";
import { clearContents, fetchSettings, loadPersistedContents, persistContents } from "./js/storage.mjs";
import { drawContents, handleLinks } from "./js/view.mjs";

const scanReceipt = async (logger, formData) => {
  const receiptFile = formData.get('receipt');
  const passphrase = formData.get('passphrase');

  try {
    if (!receiptFile) {
      throw new Error('No receipt file provided.');
    }
    if (!passphrase) {
      throw new Error('No passphrase provided.');
    }

    const { apiUrl, apiKey, models } = await fetchSettings(passphrase);
    if (!apiUrl || !apiKey) {
      throw new Error('No API key found. Click on "Settings" below to configure.');
    }

    logger.log("Scanning receipt...");
    const response = await submitPrompt(receiptFile, apiUrl, apiKey, models);

    logger.log("Parsing generated response...");
    const contents = await parseResponse(response);

    logger.log("Persisting contents to session storage...");
    await persistContents(contents);

    logger.log("Drawing contents to panel...");
    await drawContents(contents);

    logger.log("All done!");
  } catch (error) {
    console.error(error);
    logger.log(error?.message ?? 'An error occurred.');
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const logger = new Logger();
  const form = document.getElementById("upload-form");

  const contents = await loadPersistedContents();
  if (contents) {
    logger.log("Loaded previous scan from storage.");
    await drawContents(contents);
  } else {
    logger.log("Upload a new receipt to get started.");
    await drawContents(null);
  }

  handleLinks();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    await scanReceipt(logger, formData);
  });

  form.addEventListener("reset", async (event) => {
    event.preventDefault();
    await clearContents();
    await drawContents(null);
    logger.log("Upload a new receipt to get started.");
  });
});
