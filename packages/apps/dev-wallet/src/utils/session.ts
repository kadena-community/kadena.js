import { kadenaDecrypt, kadenaEncrypt } from '@kadena/hd-wallet';

export async function encryptRecord(
  sessionValue: Record<string, Uint8Array> | null,
) {
  if (!sessionValue) return;
  const encrypted: { key: string; value: string }[] = [];
  for (const [key, value] of Object.entries(sessionValue)) {
    encrypted.push({
      key: await kadenaEncrypt('key', key),
      value: await kadenaEncrypt(key, value),
    } as EncryptedRecord[number]);
  }
  return encrypted;
}

export type EncryptedRecord = {
  key: string;
  value: string;
}[];

export async function decryptRecord(encrypted: EncryptedRecord) {
  const decrypted: Record<string, Uint8Array> = {};
  for (const { key, value } of encrypted) {
    const decryptedKey = new TextDecoder().decode(
      await kadenaDecrypt('key', key),
    );
    decrypted[decryptedKey] = await kadenaDecrypt(decryptedKey, value);
  }
  return decrypted;
}

const SESSION_PASS = new TextEncoder().encode('7b_ksKD_M4D0jnd7_ZM');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) => {
  let lastCall = 0;
  let lastResult: ReturnType<T>;
  return (...args: Parameters<T>): ReturnType<T> => {
    const now = Date.now();
    if (now - lastCall < delay) return lastResult;
    lastCall = now;
    lastResult = fn(...args);
    return lastResult;
  };
};

export function createSession(
  key: string = 'session',
  password: Uint8Array = SESSION_PASS,
  useEncryption = true,
) {
  let loaded = false;
  let session: { expiration?: string; creationDate?: string } & Record<
    string,
    unknown
  > = {
    creationDate: `${Date.now()}`,
    expiration: `${Date.now() + 1000 * 60 * 30}`,
  };
  const renew = async () => {
    // console.log('Renewing session', session);
    session.expiration = `${Date.now() + 1000 * 60 * 30}`; // 30 minutes
    localStorage.setItem(
      'session',
      useEncryption
        ? await kadenaEncrypt(password, JSON.stringify(session))
        : JSON.stringify(session),
    );
  };
  return {
    load: async () => {
      const current = localStorage.getItem(key);

      if (current) {
        try {
          session = JSON.parse(
            useEncryption
              ? new TextDecoder().decode(await kadenaDecrypt(password, current))
              : current,
          );
          // console.log('Loaded session', session);
          if (Date.now() > Number(session.expiration)) {
            throw new Error('Session expired!');
          }
        } catch (e) {
          console.log(
            e && typeof e === 'object' && `message` in e
              ? e.message
              : 'Error loading session',
          );
          console.log('Creating new session');
        }
      }

      await renew();
      loaded = true;
    },
    renew: throttle(renew, 1000 * 60), // 1 minute
    set: async (key: string, value: unknown) => {
      session[key] = value;
      await renew();
    },
    get: (key: string) => session[key],
    clear: () => {
      localStorage.removeItem('session');
      session = {};
      loaded = false;
    },
    reset: () => {
      session = {
        creationDate: `${Date.now()}`,
      };
      return renew();
    },
    isLoaded: () => loaded,
  };
}

export const Session = createSession();

export type Session = typeof Session;
