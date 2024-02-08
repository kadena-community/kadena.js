import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { listen } from '@ledgerhq/logs';
import type { FC } from 'react';
import React, { createContext, useContext } from 'react';
import { useAsyncCallback } from 'react-async-hook';

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
  const connectLedger = async (verboseLogging = false) => {
    const transport = await TransportWebHID.create();

    // listen to the events which are sent by the Ledger packages in order to debug the app
    if (verboseLogging) {
      listen((log) => console.log('Ledger listen:', log));
    }

    transport.on('disconnect', () => {
      console.log('useLedgerTransport disconnected');
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      reset();
    });

    return transport;
  };

  const {
    result,
    execute: connect,
    error,
    loading,
    reset,
  } = useAsyncCallback(connectLedger);

  return (
    <LedgerContext.Provider
      value={{ transport: result || null, connect, error, loading }}
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
