import AppKda from '@ledgerhq/hw-app-kda';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import useLedgerApp from './use-ledger-app';

interface IParams {
  keyId: number;
}

function bufferToHex(buffer: Uint8Array) {
  return [...buffer]
    .map((b) => {
      return b.toString(16).padStart(2, '0');
    })
    .join('');
}

const fetchPublicKey = async ({
  keyId,
  app,
}: IParams & { app: AppKda }): Promise<string> => {
  const kdaAddress = await app.getPublicKey(`m/44'/626'/${keyId}'/0/0`);
  return bufferToHex(kdaAddress.publicKey);
};

const useLedgerPublicKey = ({ keyId }: IParams) => {
  const app = useLedgerApp();
  console.log('useLedgerPublicKey', { keyId, app });

  return useQuery({
    queryKey: ['ledger-public-key', keyId, app],
    queryFn: () => fetchPublicKey({ keyId, app: app! }),
    enabled: !!keyId && !!app,
  });
};

export default useLedgerPublicKey;
