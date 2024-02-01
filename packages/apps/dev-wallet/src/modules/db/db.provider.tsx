import { sleep } from '@/utils/helpers';
import { FC, ReactNode, useEffect, useState } from 'react';
import { addDefaultNetworks } from '../network/network.repository';
import { setupDatabase } from './db.service';

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
      console.log('database setup done');
      await sleep(10);
      await addDefaultNetworks(db);
      db.close();
      setInitialized(true);
    };

    setupDataBase().catch((e) => {
      console.log(e);
      setErrorObject(e);
    });
  }, []);

  if (errorObject) {
    return renderError(errorObject);
  }

  return initialized ? children : fallback;
};
