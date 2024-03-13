import type { AppKdaLike } from '@/utils/ledger';
import { bufferToHex, getKadenaLedgerApp } from '@/utils/ledger';

import { useAsyncFn } from 'react-use';

export const derivationModes = [
  'current',
  'legacy',
  // 'kip26'
] as const;
export type DerivationMode = (typeof derivationModes)[number];

export const predicates = ['keys-all', 'keys-any', 'keys-2'] as const;
export type Predicate = (typeof predicates)[number];

export interface ILedgerKeyParams {
  keyId: number;
  derivationMode?: DerivationMode;
}

export const getDerivationPath = (
  keyId: number,
  derivationMode: DerivationMode,
) => {
  switch (derivationMode) {
    case 'legacy':
      return `m/44'/626'/0'/0/${keyId}`;
  }
  return `m/44'/626'/${keyId}'/0/0`;
};

const fetchPublicKey = async ({
  keyId,
  derivationMode = 'current',
  app,
}: ILedgerKeyParams & { app: AppKdaLike }): Promise<string | undefined> => {
  const kdaAddress = await app.getPublicKey(
    getDerivationPath(keyId, derivationMode),
  );
  console.log('kdaAddress', kdaAddress);
  return bufferToHex(kdaAddress.publicKey);
};

const useLedgerPublicKey = () => {
  return useAsyncFn(async ({ keyId, derivationMode }: ILedgerKeyParams) => {
    // const transport = await getTransport();
    // const app = new AppKda(transport);
    const app = await getKadenaLedgerApp();
    return fetchPublicKey({ keyId, app, derivationMode });
  });
};

export default useLedgerPublicKey;
