import { BootContent } from '@/Components/BootContent/BootContent';
import { sleep } from '@/utils/helpers';
import { Stack, Text } from '@kadena/kode-ui';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { addDefaultFungibles } from '../account/account.repository';
import { addDefaultNetworks } from '../network/network.repository';
import { setupDatabase } from './db.service';

const renderDefaultError = ({ message }: Error) => (
  <Stack
    textAlign="left"
    justifyContent={'flex-start'}
    alignItems={'flex-start'}
  >
    <Stack flexDirection={'column'} gap={'xxs'}>
      <Text color="emphasize">DataBase Error!</Text>
      <Text>{message}</Text>
    </Stack>
  </Stack>
);

export const DatabaseProvider: FC<{
  children?: ReactNode;
  fallback?: ReactNode;
  renderError?: (error: Error) => ReactNode;
}> = ({
  children,
  fallback = <Text>initializing database ...</Text>,
  renderError = renderDefaultError,
}) => {
  const setupRef = useRef(false);
  const [initialized, setInitialized] = useState(false);
  const [errorObject, setErrorObject] = useState<Error>();

  useEffect(() => {
    if (setupRef.current) return;
    setupRef.current = true;
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

    setupDataBase().catch((e) => {
      console.log(e);
      setErrorObject(e);
    });
  }, []);

  if (errorObject) {
    return <BootContent> {renderError(errorObject)}</BootContent>;
  }

  return initialized ? children : <BootContent>{fallback}</BootContent>;
};
