import { createClient, type WalletConnectClient } from './connect.client';

import { useEffect, useState } from 'react';
import { useEvt } from 'evt/hooks';

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID!;
const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL!;

export const useWalletConnect = () => {
  const [client, setClient] = useState<WalletConnectClient | null>(null);
  // sessionTopic could be read directly from client, but we need state for force react to rerender
  const [sessionTopic, setSessionTopic] = useState<string | null>(
    () => client?.sessionTopic() ?? null,
  );

  useEvt(
    (ctx) => {
      client?.onEvent.attach(ctx, ([event, data]) => {
        console.log('onEvent evt', { event, data });
      });
      client?.onConnect.attach(ctx, (topic) => {
        console.log('onConnect evt');
        setSessionTopic(topic);
      });
      client?.onDisconnect.attach(ctx, () => {
        console.log('onDisconnect evt');
        setSessionTopic(client.sessionTopic());
      });
    },
    [client],
  );

  useEffect(() => {
    console.log('init useWalletConnect');
    (async () => {
      const client = await createClient();
      setClient(client);
      await client.init({
        projectId: PROJECT_ID,
        relayUrl: RELAY_URL,
      });
    })();

    return () => client?.unmount();
  }, []);

  const connect = async () => {
    await client?.connect();
  };

  const disconnect = async () => {
    await client?.disconnect();
  };

  return {
    initialized: !!client,
    sessionTopic,
    connect,
    disconnect,
    accounts: client?.getAccounts(),
  };
};
