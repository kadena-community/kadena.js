import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { listen } from '@ledgerhq/logs';
import type { FC } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAsyncFn } from 'react-use';

import type Transport from '@ledgerhq/hw-transport';

const LedgerContext = createContext<{
  transport: Transport | null;
  connect: (verboseLogging?: boolean) => void;
  error?: Error;
  loading: boolean;
}>({ transport: null, connect: () => {}, loading: false });

const LedgerContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transport, setTransport] = useState<Transport | null>(null);

  const connectLedger = useCallback(async (verboseLogging = false) => {
    const transport = await TransportWebHID.create();

    // listen to the events which are sent by the Ledger packages in order to debug the app
    if (verboseLogging) {
      listen((log) => console.log('Ledger listen:', log));
    }

    transport.on('disconnect', () => {
      console.log('useLedgerTransport disconnected');
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      // reset(null);
      setTransport(null);
    });

    return transport;
  }, []);

  const [{ value, error, loading }, connect] = useAsyncFn(connectLedger);

  useEffect(() => {
    setTransport(value || null);
  }, [value]);

  console.log('useLedgerTransport', { value, error, loading });

  return (
    <LedgerContext.Provider
      value={{
        transport,
        connect,
        error,
        loading,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};

const useLedgerTransport = () => {
  const context = useContext(LedgerContext);

  if (context === undefined) {
    throw new Error('Please use LedgerContextProvider in parent component');
  }

  return context;
};

export { LedgerContext, LedgerContextProvider, useLedgerTransport };
