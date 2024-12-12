/// <reference lib="webworker" />
import { kadenaDecrypt, kadenaEncrypt, randomBytes } from './encryption';
import { SecureContext, ServiceWorkerMessage } from './types';

declare const self: ServiceWorkerGlobalScope;

let clearTimer: NodeJS.Timeout | null = null;

const version = 'v1';

console.log('Service Worker:', version);

self.addEventListener('install', () => {
  self.skipWaiting(); // Skip waiting and activate the new service worker immediately
});

self.addEventListener('activate', () => {
  self.clients.claim(); // Take control of open clients (pages)
});

const setContext = async (context: SecureContext) => {
  caches.open('sec-context').then((cache) => {
    const buffer = new Uint8Array(
      4 +
        [
          context.encryptionKey.length,
          ...context.encryptionPhrase.map((b) => b.length),
        ].reduce((acc, cur) => acc + cur, 0),
    );
    buffer[0] = context.encryptionKey.length;
    buffer[1] = context.encryptionPhrase[0].length;
    buffer[2] = context.encryptionPhrase[1].length;
    buffer[3] = context.encryptionPhrase[2].length;
    let offset = 4;
    [context.encryptionKey, ...context.encryptionPhrase].forEach((phrase) => {
      buffer.set(phrase, offset);
      offset += phrase.length;
    });
    cache.put(
      'context',
      new Response(buffer, {
        headers: { 'Content-Type': 'application/octet-stream' },
      }),
    );
  });
};

const getContext = async () => {
  const cache = await caches.open('sec-context');
  const response = await cache.match('context');
  if (!response) return null;
  const buffer = await response.arrayBuffer();
  const view = new Uint8Array(buffer);
  const encryptionKey = view.subarray(4, 4 + view[0]);
  const encryptionPhrase = [
    view.subarray(4 + view[0], 4 + view[0] + view[1]),
    view.subarray(4 + view[0] + view[1], 4 + view[0] + view[1] + view[2]),
    view.subarray(
      4 + view[0] + view[1] + view[2],
      4 + view[0] + view[1] + view[2] + view[3],
    ),
  ] as [Uint8Array, Uint8Array, Uint8Array];
  return {
    encryptionKey,
    encryptionPhrase,
  };
};

const clearContext = async () => {
  const cache = await caches.open('sec-context');
  await cache.delete('context');
};

const getPassword = (sessionEntropy: string, encryptionKey: Uint8Array) => {
  const phrase = new TextEncoder().encode(sessionEntropy);
  const password = new Uint8Array(phrase.length + encryptionKey.length);
  password.set(phrase);
  password.set(encryptionKey, phrase.length);
  return password;
};

self.addEventListener('message', async (event) => {
  const { action, payload } = event.data as ServiceWorkerMessage;

  switch (action) {
    case 'setSecurityPhrase': {
      if (clearTimer) {
        clearTimeout(clearTimer);
        clearTimer = null;
      }
      if (payload.keepPolicy === 'never') {
        event.ports[0].postMessage({ result: 'success' });
        return;
      }
      const sessionEntropy = payload.sessionEntropy;
      if (!sessionEntropy) {
        throw new Error('Session entropy is required');
      }
      const encryptionKey = randomBytes(32);
      setContext({
        encryptionKey,
        encryptionPhrase: await kadenaEncrypt(
          getPassword(sessionEntropy, encryptionKey),
          payload.phrase,
        ),
        keepPolicy: payload.keepPolicy,
      });
      if (payload.keepPolicy === 'short-time') {
        clearTimer = setTimeout(clearContext, payload.ttl || 5 * 60 * 1000);
      }
      event.ports[0].postMessage({ result: 'success' });
      break;
    }

    case 'getSecurityPhrase': {
      const sessionEntropy: string = payload.sessionEntropy;
      if (!sessionEntropy) {
        throw new Error('Session entropy is required');
      }
      const context = await getContext();
      if (!context) {
        event.ports[0].postMessage({
          phrase: null,
        });
        break;
      }
      event.ports[0].postMessage({
        phrase: new TextDecoder().decode(
          await kadenaDecrypt(
            getPassword(sessionEntropy, context.encryptionKey),
            context.encryptionPhrase,
          ),
        ),
      });
      break;
    }

    case 'clearSecurityPhrase': {
      clearContext();
      event.ports[0].postMessage({ result: 'success' });
      break;
    }

    default:
      console.error('Unknown action:', action);
  }
});
