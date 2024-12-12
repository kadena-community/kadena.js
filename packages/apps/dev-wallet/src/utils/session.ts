import { config } from '@/config';
import { UUID } from '@/modules/types';
import { getErrorMessage } from './getErrorMessage';
import { createEventEmitter, throttle } from './helpers';

type SessionValue = {
  expiration?: string;
  creationDate?: string;
  sessionId?: UUID;
} & Record<string, unknown>;

const serialization = {
  serialize: async (session: SessionValue) => JSON.stringify(session),
  deserialize: async (session: string) => JSON.parse(session) as SessionValue,
};
const isExpired = (session: SessionValue) =>
  Date.now() >= Number(session.expiration);

export function createSession(key: string = 'session') {
  let loaded = false;
  let session: SessionValue = {
    creationDate: `${Date.now()}`,
    expiration: `${Date.now() + config.SESSION.TTL}`,
    sessionId: crypto.randomUUID(),
  };

  const eventEmitter = createEventEmitter<{
    loaded: SessionValue;
    renewed: SessionValue;
    expired: undefined;
    cleared: undefined;
  }>();

  let expireTimeout: NodeJS.Timeout | null = null;

  const renewData = async () => {
    session.expiration = `${Date.now() + config.SESSION.TTL}`;
    localStorage.setItem('session', await serialization.serialize(session));
    eventEmitter.emit('renewed', session);
  };

  const renew = async () => {
    // console.log('Renewing session', session);
    if (expireTimeout) {
      clearTimeout(expireTimeout);
    }
    if (isExpired(session)) {
      localStorage.removeItem(key);
      eventEmitter.emit('expired', undefined);
      return;
    }

    expireTimeout = setTimeout(async () => {
      if (isExpired(session)) {
        localStorage.removeItem(key);
        eventEmitter.emit('expired', undefined);
      }
    }, config.SESSION.TTL);

    renewData();
  };

  return {
    ListenToExternalChanges: () => {
      const listener = async (event: StorageEvent) => {
        if (event.key === key) {
          if (event.newValue) {
            session = await serialization.deserialize(event.newValue);
            loaded = true;
          } else {
            session = {};
            loaded = false;
            eventEmitter.emit('cleared', undefined);
          }
        }
      };
      // Add a storage event listener
      window.addEventListener('storage', listener);
      return () => window.removeEventListener('storage', listener);
    },
    load: async () => {
      const current = localStorage.getItem(key);

      if (current) {
        try {
          session = await serialization.deserialize(current);
          if (isExpired(session)) {
            throw new Error('Session expired!');
          }
        } catch (e) {
          console.log(
            getErrorMessage(e, 'Error loading session from local storage'),
          );
          localStorage.removeItem(key);
          console.log('Resetting session');
          session = {
            creationDate: `${Date.now()}`,
            expiration: `${Date.now() + config.SESSION.TTL}`,
            sessionId: crypto.randomUUID(),
          };
        }
      }

      await renew();
      eventEmitter.emit('loaded', session);
      loaded = true;
    },
    renew: throttle(renew, 1000 * 1), // 1 minute
    set: async (key: string, value: unknown) => {
      session[key] = value;
      await renew();
    },
    get: (key: keyof SessionValue) => session[key],
    clear: () => {
      localStorage.removeItem('session');
      session = {};
      loaded = false;
      eventEmitter.emit('cleared', undefined);
    },
    reset: () => {
      session = {
        creationDate: `${Date.now()}`,
        sessionId: crypto.randomUUID(),
      };
      return renew();
    },
    isLoaded: () => loaded,
    subscribe: eventEmitter.subscribe,
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
