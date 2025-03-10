import { BootContent } from '@/Components/BootContent/BootContent';
import { Session } from '@/utils/session';
import { Text } from '@kadena/kode-ui';
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useLayoutEffect,
  useState,
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
  const [loaded, setLoaded] = useState(false);
  useLayoutEffect(() => {
    const events = ['visibilitychange', 'touchstart', 'keydown', 'click'];
    let removeListener = () => {};
    const run = async () => {
      await Session.load();
      removeListener = Session.ListenToExternalChanges();
      // console.log('Session is loaded', Session.get('profileId'));
      events.forEach((event) => {
        document.addEventListener(event, Session.renew);
      });
      setLoaded(true);
    };
    run();
    return () => {
      // console.log('Session is review', Session.renew);
      events.forEach((event) => {
        document.removeEventListener(event, Session.renew);
      });
      removeListener();
    };
  }, []);

  return (
    <sessionContext.Provider value={Session}>
      {loaded ? (
        children
      ) : (
        <BootContent>
          <Text>Loading session...</Text>
        </BootContent>
      )}
    </sessionContext.Provider>
  );
};
