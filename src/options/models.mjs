export const loadAvailableModels = async (settings, freeOnly = false) => {
  const response = await fetch(`${settings.apiUrl}/models`, {
    headers: {
      "Authorization": `Bearer ${settings.apiKey}`,
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
