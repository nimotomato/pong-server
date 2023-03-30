// Turns pixels into vh
const toVw = (pixels) => {
  return 100 * (pixels / window.innerWidth);
};

module.exports = { toVw };
