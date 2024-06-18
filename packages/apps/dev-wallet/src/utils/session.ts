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

export async function createSession(
  key: string = 'session',
  password: Uint8Array = SESSION_PASS,
) {
  return session(true, key, password);
}

export async function loadSession(
  key: string = 'session',
  password: Uint8Array = SESSION_PASS,
) {
  if (!localStorage.getItem(key)) return null;
  return session(false, key, password);
}

const throttle = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let lastCall = 0;
  let lastResult: ReturnType<T>;
  return (...args: Parameters<T>): ReturnType<T> => {
    console.log('throttle', { lastCall, lastResult });
    const now = Date.now();
    if (now - lastCall < delay) return lastResult;
    lastCall = now;
    lastResult = fn(...args);
    return lastResult;
  };
};

async function session(
  newSession: boolean = false,
  key: string = 'session',
  password: Uint8Array = SESSION_PASS,
) {
  const current = newSession ? null : localStorage.getItem(key);
  let session: { expiration?: string; creationDate?: string } & Record<
    string,
    unknown
  > = {
    creationDate: `${Date.now()}`,
    expiration: `${Date.now() + 1000 * 60 * 30}`,
  };
  if (current) {
    try {
      session = JSON.parse(
        new TextDecoder().decode(await kadenaDecrypt(password, current)),
      );
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
  const renew = async () => {
    console.log('Renewing session');
    session.expiration = `${Date.now() + 1000 * 60 * 30}`; // 30 minutes
    localStorage.setItem(
      'session',
      await kadenaEncrypt(password, JSON.stringify(session)),
    );
  };
  await renew();
  return {
    renew: throttle(renew, 1000 * 60 * 1), // 5 minutes
    set: async (key: string, value: any) => {
      session[key] = value;
      await renew();
    },
    get: (key: string) => session[key],
    clear: () => {
      localStorage.removeItem('session');
      session = {};
    },
  };
}

export type Session = Awaited<ReturnType<typeof loadSession>>;
