import { ISetSecurityPhrase } from '@/service-worker/types';
import { kadenaDecrypt, kadenaEncrypt, randomBytes } from '@kadena/hd-wallet';

export interface SecureContext {
  encryptionKey: Uint8Array;
  encryptionPhrase: Uint8Array;
  keepPolicy: 'session' | 'short-time' | 'never';
  ttl?: number;
}

const getPassword = (sessionEntropy: string, encryptionKey: Uint8Array) => {
  const phrase = new TextEncoder().encode(sessionEntropy);
  const password = new Uint8Array(phrase.length + encryptionKey.length);
  password.set(phrase);
  password.set(encryptionKey, phrase.length);
  return password;
};

export function fallbackSecurityService() {
  let context: SecureContext | null = null;
  let clearTimer: NodeJS.Timeout | null = null;
  console.log('Service Worker is not available, using fallback service');

  async function setSecurityPhrase({
    sessionEntropy,
    phrase,
    keepPolicy,
    ttl,
  }: ISetSecurityPhrase['payload']) {
    if (clearTimer) {
      clearTimeout(clearTimer);
      clearTimer = null;
    }
    if (keepPolicy === 'never') {
      return { result: 'success' };
    }
    const encryptionKey = randomBytes(32);
    context = {
      encryptionKey,
      encryptionPhrase: await kadenaEncrypt(
        getPassword(sessionEntropy, encryptionKey),
        phrase,
        'buffer',
      ),
      keepPolicy: keepPolicy,
    };
    if (context.keepPolicy === 'short-time') {
      clearTimer = setTimeout(
        () => {
          context = null;
        },
        ttl || 5 * 60 * 1000,
      );
    }
    return { result: 'success' };
  }

  async function getSecurityPhrase(sessionEntropy: string) {
    if (!context) {
      return null;
    }
    return new TextDecoder().decode(
      await kadenaDecrypt(
        getPassword(sessionEntropy, context.encryptionKey),
        context.encryptionPhrase,
      ),
    );
  }

  async function clearSecurityPhrase() {
    context = null;
    return { result: 'success' };
  }

  return { setSecurityPhrase, getSecurityPhrase, clearSecurityPhrase };
}
