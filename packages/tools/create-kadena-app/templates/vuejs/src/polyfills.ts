/**
 * Polyfills required for WalletConnect and other wallet adapters
 */

// Global polyfills for Node.js modules in browser environment
import { Buffer } from 'buffer';
import process from 'process/browser';

// Make them available globally
if (typeof (globalThis as any).Buffer === 'undefined') {
  (globalThis as any).Buffer = Buffer;
}

if (typeof (globalThis as any).process === 'undefined') {
  (globalThis as any).process = process;
}

// Additional polyfills that might be needed for wallet connections
if (typeof (globalThis as any).global === 'undefined') {
  (globalThis as any).global = globalThis;
}