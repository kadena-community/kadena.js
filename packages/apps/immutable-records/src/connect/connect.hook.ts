'use client';

import { useEffect, useContext } from 'react';
import { useEvt } from 'evt/hooks';
import { WalletConnectContext } from './connect.context';
import { useRenderhook } from './connect.utils';

export const useWalletConnect = () => {
  const { client, projectId, relayUrl } = useContext(WalletConnectContext);
  const render = useRenderhook();

  useEvt(
    (ctx) => {
      client.onEvent.attach(ctx, ([event, data]) => {
        console.log('onEvent evt', { event, data });
      });
      client.onConnect.attach(ctx, () => {
        console.log('onConnect evt');
        render();
      });
      client.onDisconnect.attach(ctx, () => {
        console.log('onDisconnect evt');
        render();
      });
      client.onUpdate.attach(ctx, () => {
        console.log('onUpdate evt', client.likelyInvalidSession);
        render();
      });
    },
    [client],
  );

  useEffect(() => {
    client.init({ projectId, relayUrl });
    return () => client.unmount();
  }, []);

  const connect = async () => {
    await client.connect();
  };

  const disconnect = async () => {
    console.log('calling disconnect from hook');
    await client.disconnect();
  };

  const setNetwork = async (network: string) => {
    client.setNetwork(network);
  };

  const fetchKadenaAccounts = async (account: string) => {
    await client.fetchKadenaAccounts(account);
  };

  return {
    initialized: client.state === 'initialized',
    sessionTopic: client.sessionTopic(),
    likelyInvalidSession: client.likelyInvalidSession,
    connect,
    disconnect,
    setNetwork,
    network: client.network,
    fetchKadenaAccounts,
    networks: client.getNetworks(),
    accounts: client.getAccounts(),
    kadenaAccounts: client.kadenaAccounts,
  };
};
