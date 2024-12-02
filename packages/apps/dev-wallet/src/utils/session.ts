import { config } from '@/config';
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

type SessionValue = { expiration?: string; creationDate?: string } & Record<
  string,
  unknown
>;

interface ISessionSerialization {
  serialize: (session: SessionValue) => Promise<string>;
  deserialize: (session: string) => Promise<SessionValue>;
}

const encryptSession: ISessionSerialization = {
  serialize: (session: SessionValue): Promise<string> =>
    kadenaEncrypt(SESSION_PASS, JSON.stringify(session)),
  deserialize: async (session: string) =>
    JSON.parse(
      new TextDecoder().decode(await kadenaDecrypt(SESSION_PASS, session)),
    ) as SessionValue,
};

const serializeSession: ISessionSerialization = {
  serialize: async (session: SessionValue) => JSON.stringify(session),
  deserialize: async (session: string) => JSON.parse(session) as SessionValue,
};
export function createSession(
  key: string = 'session',
  serialization = config.SESSION.ENCRYPT_SESSION
    ? encryptSession
    : serializeSession,
) {
  let loaded = false;
  let session: SessionValue = {
    creationDate: `${Date.now()}`,
    expiration: `${Date.now() + config.SESSION.TTL}`,
  };
  const isExpired = () => Date.now() >= Number(session.expiration);
  const listeners = [] as Array<
    (
      event: 'loaded' | 'renewed' | 'expired' | 'cleared',
      session?: SessionValue,
    ) => void
  >;
  let expireTimeout: NodeJS.Timeout | null = null;
  const renewData = async () => {
    session.expiration = `${Date.now() + config.SESSION.TTL}`;
    localStorage.setItem('session', await serialization.serialize(session));
    listeners.forEach((cb) => cb('renewed', session));
  };
  const renew = async () => {
    // console.log('Renewing session', session);
    if (expireTimeout) {
      clearTimeout(expireTimeout);
    }
    if (isExpired()) {
      localStorage.removeItem(key);
      listeners.forEach((cb) => cb('expired'));
      expireTimeout = null;
    }
    renewData();
    expireTimeout = setTimeout(async () => {
      if (isExpired()) {
        localStorage.removeItem(key);
        listeners.forEach((cb) => cb('expired'));
        renewData();
      }
    }, config.SESSION.TTL);
  };
  return {
    load: async () => {
      const current = localStorage.getItem(key);

      if (current) {
        try {
          session = await serialization.deserialize(current);
          // console.log('Loaded session', session);
          if (isExpired()) {
            throw new Error('Session expired!');
          }
        } catch (e) {
          console.log(
            e && typeof e === 'object' && `message` in e
              ? e.message
              : 'Error loading session',
          );
          console.log('Creating new session');
          localStorage.removeItem(key);
        }
      }

      await renew();
      listeners.forEach((cb) => cb('loaded', session));
      loaded = true;
    },
    renew: throttle(renew, 1000 * 1), // 1 minute
    set: async (key: string, value: unknown) => {
      session[key] = value;
      await renew();
    },
    get: (key: string) => session[key],
    clear: () => {
      localStorage.removeItem('session');
      session = {};
      loaded = false;
      listeners.forEach((cb) => cb('cleared'));
    },
    reset: () => {
      session = {
        creationDate: `${Date.now()}`,
      };
      return renew();
    },
    isLoaded: () => loaded,
    subscribe: (
      cb: (
        event: 'loaded' | 'renewed' | 'expired' | 'cleared',
        session?: SessionValue,
      ) => void,
    ) => {
      listeners.push(cb);
      return () => {
        const index = listeners.indexOf(cb);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },
  };
}

export const Session = createSession();

export type Session = typeof Session;

export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) => {
  const timer: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    if (timer) {
      clearTimeout(timer);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fn(...args));
      }, delay);
    });
  };
};
