import { Dialog } from '@kadena/kode-ui';

import { useWallet } from '../wallet/wallet.hook';

import { usePrompt } from '@/Components/PromptProvider/Prompt';
import { IWalletKit } from '@reown/walletkit';
import { buildApprovedNamespaces } from '@walletconnect/utils';

import React, { createContext, useEffect, useState } from 'react';
import { getWalletKit } from './WalletConnectUtils';

interface IWalletConnectContext {
  isConnected: boolean;
  showConnectionModal: () => void;
}

export const WalletConnectContext = createContext<IWalletConnectContext>({
  isConnected: false,
  showConnectionModal: () => {
    throw new Error('use this inside WalletConnectProvider');
  },
});

export const WalletConnectProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const { networks, activeNetwork, keySources } = useWallet();
  const prompt = usePrompt();
  const [wcSession, setWcSession] = useState<Awaited<ReturnType<any>>>();
  const [walletKit, setWalletKit] = useState<IWalletKit>();

  useEffect(() => {
    (async () => {
      setWalletKit(await getWalletKit());
    })();
  }, []);

  useEffect(() => {
    if (!walletKit) {
      return;
    }
    const chains = 'kadena:mainnet01,kadena:testnet04,kadena:development'.split(
      ',',
    );
    walletKit.on('session_proposal', async (proposal) => {
      console.log('session_proposal', JSON.stringify(proposal.params, null, 2));
      const namespaces = {
        proposal: proposal.params,
        supportedNamespaces: {
          kadena: {
            // chains: networks.map((n) => `kadena:${n.networkId}`),
            chains,
            methods: [
              'kadena_getAccounts_v1',
              'kadena_sign_v1',
              'kadena_sign',
              'kadena_quicksign_v1',
            ],
            events: ['kadena_transaction_updated'],
            // We're not sending accounts but public keys.
            // The acounts are retrieved using kadena_getAccounts_v1
            // TODO show modal to let the user choose the keys/accounts
            //   (from which we take the keys to share)
            // accounts: [],
            accounts: keySources!
              .map((keySource) =>
                keySource.keys
                  .map((k) => chains.map((chain) => `${chain}:${k.publicKey}`))
                  .flat(),
              )
              .flat(),
          },
        },
      };
      console.log('accounts', namespaces.supportedNamespaces.kadena.accounts);
      const approvedNamespaces = buildApprovedNamespaces(namespaces);

      console.log(
        'approvedNamespaces',
        JSON.stringify(approvedNamespaces, null, 2),
      );
      const session = await walletKit.approveSession({
        id: proposal.id,
        namespaces,
      });
      setWcSession(session);
    });
  }, [walletKit]);

  const showConnectionModal = async () => {
    const uri = (await prompt((resolve) => {
      return (
        <Dialog isOpen>
          <div>
            <h1>Connect Wallet</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                resolve(new FormData(e.currentTarget).get('uri'));
              }}
            >
              <label htmlFor="uri">URI</label>
              <input name="uri" id="uri" type="text" />
              <button type="submit">Connect</button>
            </form>
          </div>
        </Dialog>
      );
    })) as string;
    try {
      if (!walletKit) {
        throw new Error('WalletKit not initialized');
      }
      const res = await walletKit.core.pairing.pair({ uri });
      console.log(res);
    } catch (e) {
      console.log('error in showConnectionModal', e);
      console.error(e);
    }
  };

  return (
    <WalletConnectContext.Provider
      value={{
        isConnected: wcSession !== undefined,
        showConnectionModal,
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
};
