import { parseResponse, submitPrompt } from "./js/ai.mjs";
import { Logger } from "./js/logger.mjs";
import { loadPersistedContents, persistContents } from "./js/storage.mjs";
import { drawContents, handleLinks } from "./js/view.mjs";

const scanReceipt = async (logger, formData) => {
  const receiptFile = formData.get('receipt');

  logger.log("Scanning receipt...");
  const response = await submitPrompt(receiptFile);

  logger.log("Parsing generated response...");
  const contents = await parseResponse(response);

  logger.log("Persisting contents to session storage...");
  await persistContents(contents);

  logger.log("Drawing contents to panel...");
  await drawContents(contents);
  logger.log("All done!");

  // TODO: Handle errors
};

document.addEventListener("DOMContentLoaded", () => {
  const logger = new Logger();
  const form = document.getElementById("upload-form");

  loadPersistedContents(logger);
  handleLinks();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    scanReceipt(logger, formData);
  });
});
