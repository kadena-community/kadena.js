import { sleep } from '@/utils/helpers';
import { FC, ReactNode, useEffect, useState } from 'react';
import { addDefaultFungibles } from '../account/account.repository';
import { addDefaultNetworks } from '../network/network.repository';
import { closeDatabaseConnections, setupDatabase } from './db.service';

const renderDefaultError = ({ message }: Error) => (
  <div>
    DataBase Error happens; <br /> {message}
  </div>
);

export const DatabaseProvider: FC<{
  children?: ReactNode;
  fallback?: ReactNode;
  renderError?: (error: Error) => ReactNode;
}> = ({
  children,
  fallback = 'initializing database',
  renderError = renderDefaultError,
}) => {
  const [initialized, setInitialized] = useState(false);
  const [errorObject, setErrorObject] = useState<Error>();

  useEffect(() => {
    const setupDataBase = async () => {
      console.log('setting up database');
      const db = await setupDatabase();
      await sleep(10);
      try {
        await addDefaultNetworks();
        await addDefaultFungibles();
        db.close();
        setInitialized(true);
      } catch (e) {
        db.close();
        throw e instanceof Error ? e : new Error('error in addDefaultNetworks');
      }
    };

    const closeConnectionsCallback = () => {
      if (document.hidden) {
        // close all connections when app is hidden; since open connections will block other tabs from accessing the database
        closeDatabaseConnections();
      }
    };

    document.addEventListener('visibilitychange', closeConnectionsCallback);

    setupDataBase().catch((e) => {
      console.log(e);
      setErrorObject(e);
    });

    return () => {
      document.removeEventListener(
        'visibilitychange',
        closeConnectionsCallback,
      );
    };
  }, []);

  if (errorObject) {
    return renderError(errorObject);
  }

  return initialized ? children : fallback;
};
