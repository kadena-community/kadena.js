import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { addDefaultNetworks } from '../network/network.repository';
import { createDatabaseConnection } from './db.service';

export const DatabaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const setupDataBase = async () => {
      const db = await createDatabaseConnection();
      setTimeout(async () => {
        await addDefaultNetworks(db);
        setInitialized(true);
      }, 10);
    };

    setupDataBase().catch((e) => {
      console.log(e);
      setError(e);
    });
  }, []);

  if (error) {
    return <div>DataBase Error happens</div>;
  }

  return initialized ? children : null;
};
