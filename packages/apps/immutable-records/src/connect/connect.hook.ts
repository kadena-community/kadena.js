'use client';

import { createClient } from './connect.client';

import { useEffect, useContext } from 'react';
import { useEvt } from 'evt/hooks';
import { WalletConnectContext } from './connect.context';
import { useRenderhook } from './connect.utils';

export const useWalletConnect = () => {
  const { client, setClient, projectId, relayUrl } =
    useContext(WalletConnectContext);
  const render = useRenderhook();

  useEvt(
    (ctx) => {
      if (!client) return;
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
    (async () => {
      if (client) {
        if (process.env.NODE_ENV !== 'development') {
          console.warn('Client already initialized');
        }
        return;
      }

      console.log('init useWalletConnect');
      const _client = createClient();
      setClient(_client);
      await _client.init({ projectId, relayUrl });
    })();

    return () => client?.unmount();
  }, []);

  const connect = async () => {
    await client?.connect();
  };

  const disconnect = async () => {
    await client?.disconnect();
  };

  const getKadenaAccounts = async (account: string) => {
    await client?.getKadenaAccounts(account);
    render();
  };

  return {
    initialized: !!client,
    sessionTopic: client?.sessionTopic() ?? null,
    likelyInvalidSession: client?.likelyInvalidSession ?? null,
    connect,
    disconnect,
    getKadenaAccounts,
    accounts: client?.getAccounts() ?? [],
    kadenaAccounts: client?.kadenaAccounts ?? {},
  };
};
