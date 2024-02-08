import { useLedgerTransport } from '@/context';
import AppKda from '@ledgerhq/hw-app-kda';
import { useEffect, useState } from 'react';

const useLedgerApp = () => {
  const { transport } = useLedgerTransport();
  const [app, setApp] = useState<AppKda | null>(null);

  useEffect(() => {
    if (transport !== null) {
      setApp(new AppKda(transport));
    }
  }, [transport]);

  return app;
};

export default useLedgerApp;
