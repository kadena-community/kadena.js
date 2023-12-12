import AppKda from '@ledgerhq/hw-app-kda';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { listen } from '@ledgerhq/logs';
import { useState } from 'react';

const useLedgerApp = (): {
  connect: () => void;
  // isConnected: boolean;
  app?: AppKda;
} => {
  // const [isConnected, setIsConnected] = useState(false);
  const [app, setApp] = useState<AppKda>();

  const connect = async () => {
    try {
      const transport = await TransportWebHID.create();

      //listen to the events which are sent by the Ledger packages in order to debug the app
      listen((log) => console.log('Ledger listen:', log));

      const appKda = new AppKda(transport);

      setApp(appKda);
    } catch (error) {
      console.log(
        'Something went wrong with the Ledger device connection',
        error,
      );
    }
  };

  return {
    // isConnected,
    app,
    connect,
  };
};

export default useLedgerApp;
