import { ISetSecurityPhrase } from '@/service-worker/types';
import { kadenaDecrypt, kadenaEncrypt, randomBytes } from '@kadena/hd-wallet';

export interface SecureContext {
  encryptionKey: Uint8Array;
  encryptionPhrase: Uint8Array;
  keepPolicy: 'session' | 'short-time' | 'never';
  ttl?: number;
}

export function fallbackSecurityService() {
  let context: SecureContext | null = null;
  let clearTimer: NodeJS.Timeout | null = null;
  console.log('Service Worker is not available, using fallback service');

  async function setSecurityPhrase({
    phrase,
    keepPolicy,
    ttl,
  }: {
    phrase: string;
    keepPolicy: ISetSecurityPhrase['payload']['keepPolicy'];
    ttl?: number;
  }) {
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
      encryptionPhrase: await kadenaEncrypt(encryptionKey, phrase, 'buffer'),
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

  async function getSecurityPhrase() {
    if (!context) {
      return null;
    }
    return new TextDecoder().decode(
      await kadenaDecrypt(context.encryptionKey, context.encryptionPhrase),
    );
  }

  async function clearSecurityPhrase() {
    context = null;
    return { result: 'success' };
  }

  return { setSecurityPhrase, getSecurityPhrase, clearSecurityPhrase };
}
