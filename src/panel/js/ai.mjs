import { fetchSettings } from "./storage.mjs";

export const submitPrompt = async (image) => {
  const { apiUrl, apiKey } = await fetchSettings();

  const systemPrompt = `
    You are a concise and structured tool that will look at a receipt and return a JSON object that contains:
    - 'storeName' (string) : The name of the store
    - 'date' (ISO 8601 formatted string) : The date of the receipt
    - 'tax' (number) : The amount of tax in the receipt. This is NOT the subtotal - just the tax amount.
    - 'tip' (number) : The tip amount of the receipt, if present.
    - 'items' (array) : An array of items on the receipt. Each item should have the following properties:
      - 'name' (string) : The name of the item
      - 'price' (number) : The price of the item
    - 'total' (number) : The final total price of the receipt, including tax and tips.
  `.trim();

  const base64Image = await fileToBase64(image);
  const userPrompt = [
    {
      type: 'image_url',
      image_url: {
        url: `data:${image.type};base64,${base64Image}`,
      },
    },
  ];

  const response = await fetch(`${apiUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://vivekraman.dev/work/itemize-receipts",
      "X-Title": "Itemize Receipts",
    },
    body: JSON.stringify({
      model: "google/gemma-3-12b-it:free",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    })
  });

  const data = await response.json();
  console.trace("Response", data);
  return data;
}

export const parseResponse = (response) => {
  const raw = response.choices[0].message.content;

  // Handle markdown-wrapped JSON responses
  let jsonString = raw;

  if (raw.includes('```json')) {
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) {
      jsonString = match[1].trim();
    }
  } else if (raw.includes('```')) {
    const match = raw.match(/```\s*([\s\S]*?)\s*```/);
    if (match) {
      jsonString = match[1].trim();
    }
  }

  const json = JSON.parse(jsonString);
  console.trace("Parsed JSON", json);
  return json;
}

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
