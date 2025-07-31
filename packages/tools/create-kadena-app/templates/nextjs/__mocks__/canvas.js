// Mock canvas module to avoid native compilation issues
function MockImage() {
  this.onload = null;
  this.onerror = null;
  this.src = '';
  this.width = 0;
  this.height = 0;
}

module.exports = {
  createCanvas: () => ({
    getContext: () => ({
      fillRect: () => {},
      clearRect: () => {},
      getImageData: (x, y, w, h) => ({
        data: new Array(w * h * 4)
      }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {},
    }),
    width: 0,
    height: 0,
    toDataURL: () => '',
    toBuffer: () => Buffer.alloc(0),
  }),
  Image: MockImage,
  loadImage: () => Promise.resolve(new MockImage()),
  registerFont: () => {},
};