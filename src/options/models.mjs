import { decryptStringWithPassphrase } from "../common/crypto.mjs";

export const loadAvailableModels = async (settings) => {
  let apiKey = settings?.apiKey;

  if (!apiKey) {
    const passphrase = passphraseInput?.value?.trim();
    if (passphrase) {
      const { apiKeyEnc } = await chrome.storage.local.get(['apiKeyEnc']);
      if (apiKeyEnc) {
        try {
          apiKey = await decryptStringWithPassphrase({ encrypted: apiKeyEnc, passphrase });
        } catch (e) {
          console.warn('Failed to decrypt API key for model loading:', e?.message ?? e);
          return [];
        }
      }
    }
  }

  if (!apiKey) {
    console.log('No API key found');
    return [];
  }

  const response = await fetch(`${settings.apiUrl}/models`, {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
    }
  });

  const models = await response.json();
  console.log(models);

  return models.data.filter(model => {
    const supportsImage = model?.architecture?.input_modalities?.includes("image");
    return supportsImage;
  }).map(model => {
    return {
      id: model.id,
      name: model.name,
      price: getPrice(model),
    }
  }).sort((a, b) => a.price - b.price);
}

const getPrice = (model) => {
  return model.pricing ?
    parseFloat(model.pricing.prompt)
    + parseFloat(model.pricing.completion)
    + parseFloat(model.pricing.image)
    : undefined;
}
