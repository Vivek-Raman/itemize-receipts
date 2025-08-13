import { parseResponse, submitPrompt } from "./js/ai.mjs";
import { Logger } from "./js/logger.mjs";
import { loadPersistedContents, persistContents } from "./js/storage.mjs";
import { drawContents, handleLinks } from "./js/view.mjs";

const scanReceipt = async (logger, formData) => {
  const receiptFile = formData.get('receipt');
  const passphrase = formData.get('passphrase');

  try {
    logger.log("Scanning receipt...");
    const response = await submitPrompt(receiptFile, passphrase);

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
  await drawContents(contents);
  logger.log("Loaded previous scan from storage.");

  handleLinks();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    scanReceipt(logger, formData);
  });
});
