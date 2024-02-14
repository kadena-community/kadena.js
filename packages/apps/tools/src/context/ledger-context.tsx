import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import type { FC } from 'react';
import React, { createContext, useContext, useEffect } from 'react';

import type Transport from '@ledgerhq/hw-transport';
import { useMutation } from '@tanstack/react-query';

const LedgerContext = createContext<{
  transport?: Transport;
  connect: () => void;
  error: Error | null;
  loading: boolean;
}>({ connect: () => {}, loading: false, error: null });

const LedgerContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, reset, mutateAsync, isLoading } = useMutation({
    mutationFn: async () => {
      return await TransportWebHID.create();
    },
  });

  useEffect(() => {
    if (!data) return;
    data.on('disconnect', reset);
    return () => {
      data.off('disconnect', reset);
    };
  }, [data, reset]);

  const mutation = useMutation<Transport, Error>({
    mutationFn: async () => {
      if (data) {
        return data;
      }

      return await mutateAsync();
    },
  });

  return (
    <LedgerContext.Provider
      value={{
        transport: mutation.data,
        connect: mutation.mutate,
        error: mutation.error,
        loading: isLoading || mutation.isLoading,
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
