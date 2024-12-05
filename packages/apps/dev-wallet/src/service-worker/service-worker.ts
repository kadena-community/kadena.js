/// <reference lib="webworker" />
import { kadenaDecrypt, kadenaEncrypt, randomBytes } from './encryption';
import { SecureContext, ServiceWorkerMessage } from './types';

declare const self: ServiceWorkerGlobalScope;

let context: SecureContext | null = null;
let clearTimer: NodeJS.Timeout | null = null;

const version = 'v1';

console.log('Service Worker:', version);

self.addEventListener('install', () => {
  self.skipWaiting(); // Skip waiting and activate the new service worker immediately
});

self.addEventListener('activate', () => {
  self.clients.claim(); // Take control of open clients (pages)
});

self.addEventListener('message', async (event) => {
  const { action } = event.data as ServiceWorkerMessage;

  switch (action) {
    case 'setSecurityPhrase': {
      const { payload } = event.data;
      if (clearTimer) {
        clearTimeout(clearTimer);
        clearTimer = null;
      }
      if (payload.keepPolicy === 'never') {
        event.ports[0].postMessage({ result: 'success' });
        return;
      }
      const encryptionKey = randomBytes(32);
      context = {
        encryptionKey,
        encryptionPhrase: await kadenaEncrypt(encryptionKey, payload.phrase),
        keepPolicy: payload.keepPolicy,
      };
      if (context.keepPolicy === 'short-time') {
        clearTimer = setTimeout(
          () => {
            context = null;
          },
          payload.ttl || 5 * 60 * 1000,
        );
      }
      event.ports[0].postMessage({ result: 'success' });
      break;
    }

    case 'getSecurityPhrase':
      if (!context) {
        event.ports[0].postMessage({
          phrase: null,
        });
        break;
      }
      event.ports[0].postMessage({
        phrase: new TextDecoder().decode(
          await kadenaDecrypt(context.encryptionKey, context.encryptionPhrase),
        ),
      });
      break;

    case 'clearSecurityPhrase': {
      context = null;
      event.ports[0].postMessage({ result: 'success' });
      break;
    }

    default:
      console.error('Unknown action:', action);
  }
});
