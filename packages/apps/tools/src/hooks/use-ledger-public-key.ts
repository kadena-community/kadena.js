import AppKda from '@ledgerhq/hw-app-kda';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { useEffect, useState } from 'react';
import useLedgerApp from './use-ledger-app';

function bufferToHex(buffer: Uint8Array) {
  return [...buffer]
    .map((b) => {
      return b.toString(16).padStart(2, '0');
    })
    .join('');
}

export const useLedgerPublicKey = (keyId = 0) => {
  const [publicKey, setPublicKey] = useState<string>();
  const { isConnected, app } = useLedgerApp();

  console.log('useLedgerPublicKey', { isConnected, app });

  useEffect(() => {
    const getAddress = async () => {
      if (!isConnected) {
        console.info('Ledger app not connected');
        return;
      }
      const transport = await TransportWebHID.create();

      try {
        const app = new AppKda(transport);

        // if (!app) {
        //   console.info('Ledger app not connected');
        //   return;
        // }

        console.log('Getting address for keyId:', keyId);
        const kdaAddress = await app.getPublicKey(`m/44'/626'/${keyId}'/0/0`);

        console.log('kdaAddress:', bufferToHex(kdaAddress.publicKey));

        setPublicKey(bufferToHex(kdaAddress.publicKey));
      } catch (error) {
        console.log(
          'Something went wrong with the Ledger device connection',
          error,
        );
      } finally {
        // eslint-disable-next-line no-void
        void transport.close();
      }
    };

    // eslint-disable-next-line no-void
    void getAddress();
  }, [isConnected, keyId]);

  return publicKey;
};
