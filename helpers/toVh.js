// Turns pixels into vh
const toVh = (pixels) => {
  return 100 * (pixels / window.innerHeight);
};

module.exports = { toVh };
