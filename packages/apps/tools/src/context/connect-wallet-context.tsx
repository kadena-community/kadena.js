import type { ChainwebChainId } from '@kadena/chainweb-node-client';

import type { Network } from '@/constants/kadena';
import { useDidUpdateEffect } from '@/hooks';
import { env } from '@/utils/env';
import { getItem, setItem } from '@/utils/persist';
import { WalletConnectModal } from '@walletconnect/modal';
import Client from '@walletconnect/sign-client';
import type { PairingTypes, SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import type { FC, ReactNode } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

interface IWalletConnectClientContext {
  client: Client | undefined;
  session: SessionTypes.Struct | undefined;
  connect: (pairing?: { topic: string }) => Promise<void>;
  disconnect: () => Promise<void>;
  isInitializing: boolean;
  pairings: PairingTypes.Struct[];
  accounts: string[] | undefined;
  selectedNetwork: Network;
  setSelectedNetwork: (selectedNetwork: Network) => void;
  selectedChain: ChainwebChainId;
  setSelectedChain: (selectedChain: ChainwebChainId) => void;
  selectedAccount?: string;
  setSelectedAccount: (selectedAccount?: string) => void;
}

const StorageKeys: Record<'NETWORK' | 'CHAIN_ID', string> = {
  NETWORK: 'network',
  CHAIN_ID: 'chainID',
};

/**
 * Context
 */
export const WalletConnectClientContext =
  createContext<IWalletConnectClientContext>({} as IWalletConnectClientContext);

/**
 * walletConnectModal Config
 */
// eslint-disable-next-line @kadena-dev/typedef-var
const walletConnectModal = new WalletConnectModal({
  projectId: env('WALLET_CONNECT_PROJECT_ID', ''),
  themeMode: 'light',
});

interface IWalletConnectClientContextProviderProps {
  children: ReactNode;
}
/**
 * Provider
 */
export const WalletConnectClientContextProvider: FC<
  IWalletConnectClientContextProviderProps
> = ({ children }) => {
  const [client, setClient] = useState<Client>();
  const [pairings, setPairings] = useState<PairingTypes.Struct[]>([]);
  const [session, setSession] = useState<SessionTypes.Struct>();
  const [accounts, setAccounts] = useState<string[]>();
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('mainnet01');
  const [selectedChain, setSelectedChain] = useState<ChainwebChainId>('1');
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [isInitializing, setIsInitializing] = useState(false);

  useLayoutEffect(() => {
    const initialNetwork = getItem(StorageKeys.NETWORK) as Network;
    if (initialNetwork) {
      setSelectedNetwork(initialNetwork);
    }

    const initialChain = getItem(StorageKeys.CHAIN_ID) as ChainwebChainId;
    if (initialChain) {
      setSelectedChain(initialChain);
    }
  }, []);

  useDidUpdateEffect(() => {
    setItem(StorageKeys.NETWORK, selectedNetwork);
    setItem(StorageKeys.CHAIN_ID, selectedChain);
  }, [selectedNetwork, selectedChain]);

  useEffect(() => {
    setSelectedAccount(undefined as unknown as string);
  }, [selectedNetwork]);

  const reset = (): void => {
    setSession(undefined as unknown as SessionTypes.Struct);
    setAccounts(undefined as unknown as string[]);
  };

  const onSessionConnected = useCallback(
    async (clientSession: SessionTypes.Struct) => {
      setSession(clientSession);
      setAccounts(clientSession?.namespaces?.kadena?.accounts);
    },
    [],
  );

  const connect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (pairing: any) => {
      if (typeof client === 'undefined') {
        throw new Error('WalletConnect is not initialized');
      }

      try {
        const { uri, approval } = await client.connect({
          pairingTopic: pairing?.topic,

          requiredNamespaces: {
            kadena: {
              methods: [
                'kadena_getAccounts_v1',
                'kadena_sign_v1',
                'kadena_quicksign_v1',
              ],
              chains: [
                'kadena:mainnet01',
                'kadena:testnet04',
                'kadena:development',
              ],
              events: [],
            },
          },
        });

        // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
        if (uri) {
          await walletConnectModal.openModal({ uri });
        }

        const session = await approval();
        await onSessionConnected(session);
        // Update known pairings after session is connected.
        setPairings(client.pairing.getAll({ active: true }));
      } catch (e) {
        console.error(e);
        // ignore rejection
      } finally {
        // close modal in case it was open
        walletConnectModal.closeModal();
      }
    },
    [client, onSessionConnected],
  );

  const disconnect = useCallback(async () => {
    if (typeof client === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }
    if (typeof session === 'undefined') {
      throw new Error('Session is not connected');
    }

    try {
      await client.disconnect({
        topic: session.topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
    } catch (error) {
      console.error('SignClient.disconnect failed:', error);
    } finally {
      // Reset app state after disconnect.
      reset();
    }
  }, [client, session]);

  const subscribeToEvents = useCallback(
    async (signClient: Client) => {
      if (typeof signClient === 'undefined') {
        throw new Error('WalletConnect is not initialized');
      }

      signClient.on('session_update', ({ topic, params }) => {
        const { namespaces } = params;
        const clientSession = signClient.session.get(topic);
        const updatedSession = { ...clientSession, namespaces };
        onSessionConnected(updatedSession)
          .then(console.log)
          .catch(console.error);
      });

      signClient.on('session_delete', () => {
        reset();
      });
    },
    [onSessionConnected],
  );

  const checkPersistedState = useCallback(
    async (signClient: Client) => {
      if (typeof signClient === 'undefined') {
        throw new Error('WalletConnect is not initialized');
      }
      // populates existing pairings to state
      setPairings(signClient.pairing.getAll({ active: true }));

      if (typeof session !== 'undefined') return;
      // populates (the last) existing session to state
      if (signClient.session.length) {
        const lastKeyIndex = signClient.session.keys.length - 1;
        const clientSession = signClient.session.get(
          signClient.session.keys[lastKeyIndex],
        );
        await onSessionConnected(clientSession);
        return clientSession;
      }
    },
    [session, onSessionConnected],
  );

  const createClient = useCallback(async () => {
    try {
      setIsInitializing(true);

      const _client = await Client.init({
        relayUrl: env('WALLET_CONNECT_RELAY_URL', ''),
        projectId: env('WALLET_CONNECT_PROJECT_ID', ''),
      });

      setClient(_client);
      await subscribeToEvents(_client);
      await checkPersistedState(_client);
      // eslint-disable-next-line no-useless-catch
    } catch (err) {
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, [checkPersistedState, subscribeToEvents]);

  useEffect(() => {
    if (!client) {
      createClient().then(console.log).catch(console.error);
    }
  }, [client, createClient]);

  const value = useMemo(
    () => ({
      pairings,
      isInitializing,
      accounts,
      client,
      session,
      connect,
      disconnect,
      selectedNetwork,
      setSelectedNetwork,
      selectedChain,
      setSelectedChain,
      selectedAccount,
      setSelectedAccount,
    }),
    [
      pairings,
      isInitializing,
      accounts,
      client,
      session,
      connect,
      disconnect,
      selectedNetwork,
      setSelectedNetwork,
      selectedChain,
      setSelectedChain,
      selectedAccount,
      setSelectedAccount,
    ],
  );

  return (
    <WalletConnectClientContext.Provider
      value={{
        ...value,
      }}
    >
      {children}
    </WalletConnectClientContext.Provider>
  );
};

export const useWalletConnectClient = (): IWalletConnectClientContext => {
  const context = useContext(WalletConnectClientContext);
  if (!context) {
    throw new Error(
      'useWalletConnectClient must be used within a WalletConnectClientContextProvider',
    );
  }
  return context;
};
