const normalizeVector = (x, y) => {
  // Normalize vectors by getting magnitude and then dividing vectors by magnitude.
  // Magnitude = sqrt(x^2, y^2)
  const magnitude = Math.sqrt(x ** 2 + y ** 2);

  // Normalized value = V/magnitude. Round to three decimal points for good measure.
  const normalX = (x / magnitude).toFixed(3);
  const normalY = (y / magnitude).toFixed(3);

  return {
    x: normalX,
    y: normalY,
  };
};

module.exports = { normalizeVector };
