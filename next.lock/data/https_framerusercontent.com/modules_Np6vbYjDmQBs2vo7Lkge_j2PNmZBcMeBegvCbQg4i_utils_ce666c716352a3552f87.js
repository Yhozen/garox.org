const renderPathForWeight = (weight, color, pathsByWeight) => {
  const path = pathsByWeight.get(weight);
  if (!!path)
    return path(color);
  console.error('Unsupported icon weight. Choose from "thin", "light", "regular", "bold", "fill", or "duotone".');
  return null;
};
const __FramerMetadata__ = {
  exports: {default: {type: "reactComponent", slots: []}}
};
export {
  __FramerMetadata__,
  renderPathForWeight
};
