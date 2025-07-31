/**
 * Polyfills required for WalletConnect and other wallet adapters
 */

// Import required polyfills
import { Buffer } from 'buffer';
import process from 'process';

// Make them available globally
(globalThis as any).Buffer = Buffer;
(globalThis as any).process = process;

// Additional polyfills that might be needed for wallet connections
if (typeof (globalThis as any).global === 'undefined') {
  (globalThis as any).global = globalThis;
}