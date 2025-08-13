import { decryptStringWithPassphrase } from "../common/crypto.mjs";

export const loadAvailableModels = async (settings, freeOnly = false) => {
  let apiKey = settings?.apiKey;

  if (!apiKey) {
    const passphraseInput = document.getElementById('passphrase');
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
    const isFree = getPrice(model) === 0;
    return supportsImage && (freeOnly ? isFree : true);
  }).map(model => {
    return {
      id: model.id,
      name: model.name,
      price: getPrice(model),
    }
  });
}

const getPrice = (model) => {
  return model.pricing ?
    parseFloat(model.pricing.prompt)
    + parseFloat(model.pricing.completion)
    + parseFloat(model.pricing.image)
    : undefined;
}
