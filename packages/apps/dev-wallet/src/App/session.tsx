import { Session, createSession, loadSession } from '@/utils/session';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

const sessionContext = createContext<
  | (Session & {
      createSession: () => Promise<void>;
      isLoaded: boolean;
    })
  | null
>(null);

export const useSession = () => {
  const context = useContext(sessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const create = useCallback(async () => {
    const newSession = await createSession();
    setSession(newSession);
  }, []);

  useEffect(() => {
    loadSession().then(setSession);
  }, []);

  useLayoutEffect(() => {
    if (session) {
      const events = ['visibilitychange', 'touchstart', 'keydown', 'click'];
      events.forEach((event) => {
        document.addEventListener(event, session.renew);
      });
      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, session.renew);
        });
      };
    }
  }, [session]);

  return (
    <sessionContext.Provider
      value={useMemo(
        () => ({
          set: () => {
            throw new Error('Session is not loaded');
          },
          get: () => {
            throw new Error('Session is not loaded');
          },
          renew: () => {
            throw new Error('Session is not loaded');
          },
          clear: () => {
            throw new Error('Session is not loaded');
          },
          ...session,
          isLoaded: Boolean(session),
          createSession: create,
        }),
        [session, create],
      )}
    >
      {children}
    </sessionContext.Provider>
  );
};
