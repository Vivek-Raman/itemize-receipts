import { parseResponse, submitPrompt } from "./ai.js";
import { Logger } from "./logger.js";
import { loadPersistedContents, persistContents } from "./storage.js";
import { drawContents } from "./view.js";

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
  const form = document.querySelector("form");

  loadPersistedContents();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    scanReceipt(logger, formData);
  });
});
