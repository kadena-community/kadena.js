import type AppKda from '@ledgerhq/hw-app-kda';
import { useAsync } from 'react-use';
import useLedgerApp from './use-ledger-app';

export const derivationModes = [
  'current',
  'legacy',
  // 'kip26'
] as const;
export type DerivationMode = (typeof derivationModes)[number];

interface IParams {
  keyId: number;
  derivationMode?: DerivationMode;
}

function bufferToHex(buffer: Uint8Array) {
  return [...buffer]
    .map((b) => {
      return b.toString(16).padStart(2, '0');
    })
    .join('');
}

const getDerivationPath = (keyId: number, derivationMode: DerivationMode) => {
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
}: IParams & { app: AppKda | null }): Promise<string | undefined> => {
  if (app === null) {
    console.log("Make sure you've connected the Ledger device");
    return undefined;
  }

  const kdaAddress = await app.getPublicKey(
    getDerivationPath(keyId, derivationMode),
  );
  return bufferToHex(kdaAddress.publicKey);
};

const useLedgerPublicKey = ({ keyId, derivationMode }: IParams) => {
  const app = useLedgerApp();

  return useAsync(
    () => fetchPublicKey({ keyId, app, derivationMode }),
    [app, derivationMode, keyId],
  );
};

export default useLedgerPublicKey;
