

const scanReceipt = async (formData) => {
  const apiKey = formData.get('apiKey');
  const receiptFile = formData.get('receipt');

  console.debug("Scanning receipt");
  const response = await submitPrompt(apiKey, receiptFile);
  console.debug("Receipt scanned");

};

/**
 * Submits a receipt image to the OpenRouter API for analysis
 * @param {File} image - The receipt image file from the HTML form input
 */

const submitPrompt = async (apiKey, image) => {
  const base64Image = await fileToBase64(image);

  const systemPrompt = `
    You are a concise and structured tool that will look at a receipt and return a JSON object that contains:
    - 'storeName' (string) : The name of the store
    - 'date' (ISO 8601 formatted string) : The date of the receipt
    - 'tax' (number) : The tax amount of the receipt
    - 'tip' (number) : The tip amount of the receipt
    - 'items' (array) : An array of items on the receipt. Each item should have the following properties:
      - 'name' (string) : The name of the item
      - 'price' (number) : The price of the item
    - 'total' (number) : The final total price of the receipt, including tax and tips.
  `;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://itemize.vivekraman.dev",
      "X-Title": "Itemize Receipts",
    },
    body: JSON.stringify({
      "model": "google/gemma-3-12b-it:free",
      "messages": [
        {
          "role": "system",
          "content": systemPrompt,
        },
        {
          "role": "user",
          "content": [
            {
              type: 'image_url',
              image_url: {
                url: `data:${image.type};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    })
  });

  const data = await response.json();
  console.trace("Response", data);
  return data;
}

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extract base64 part from data URL (remove "data:image/jpeg;base64," prefix)
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    scanReceipt(formData);
  });
});
