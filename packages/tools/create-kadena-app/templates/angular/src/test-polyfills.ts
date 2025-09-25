// test-polyfills.ts - Polyfills for Angular testing (no jasmine dependencies)

// Polyfills required for WalletConnect and other wallet adapters
import { Buffer } from 'buffer';
import process from 'process';

// Make them available globally
(globalThis as any).Buffer = Buffer;
(globalThis as any).process = process;

// Additional polyfills that might be needed for wallet connections
if (typeof (globalThis as any).global === 'undefined') {
  (globalThis as any).global = globalThis;
}

// Mock canvas to avoid native binary issues
(window as any).HTMLCanvasElement.prototype.getContext = () => ({
  fillRect: () => {},
  clearRect: () => {},
  getImageData: (x: number, y: number, w: number, h: number) => ({
    data: new Array(w * h * 4),
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
});

// Mock Image constructor
(window as any).Image = function () {
  this.onload = null;
  this.onerror = null;
  this.src = '';
  this.width = 0;
  this.height = 0;
};