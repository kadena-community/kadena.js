import { Session } from '@/utils/session';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useLayoutEffect,
} from 'react';

const sessionContext = createContext<Session | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => {
  const context = useContext(sessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
  useLayoutEffect(() => {
    Session.load();
    console.log('Session is loaded', Session.get('profileId'));
    const events = ['visibilitychange', 'touchstart', 'keydown', 'click'];
    events.forEach((event) => {
      document.addEventListener(event, Session.renew);
    });
    return () => {
      console.log('Session is unloaded', Session.renew);
      events.forEach((event) => {
        console.log(`document.removeEventListener("${event}", renew);`);
        document.removeEventListener(event, Session.renew);
      });
    };
  }, []);

  return (
    <sessionContext.Provider value={Session}>
      {children}
    </sessionContext.Provider>
  );
};
