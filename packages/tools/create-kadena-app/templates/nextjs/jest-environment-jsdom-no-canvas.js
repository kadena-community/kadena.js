// Custom Jest environment that extends jsdom but prevents canvas from loading
const { TestEnvironment } = require('jest-environment-jsdom');

// Mock canvas before jsdom tries to load it
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(...args) {
  if (args[0] === 'canvas') {
    function MockImage() {
      this.onload = null;
      this.onerror = null;
      this.src = '';
      this.width = 0;
      this.height = 0;
    }
    
    return {
      createCanvas: () => ({
        getContext: () => ({
          fillRect: () => {},
          clearRect: () => {},
          getImageData: (x, y, w, h) => ({ data: new Array(w * h * 4) }),
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
  }
  return originalRequire.apply(this, args);
};

class JSDOMNoCanvasTestEnvironment extends TestEnvironment {
  constructor(config, context) {
    super(config, context);
  }
}

module.exports = JSDOMNoCanvasTestEnvironment;