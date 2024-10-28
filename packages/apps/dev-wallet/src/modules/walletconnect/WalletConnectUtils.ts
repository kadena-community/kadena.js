import { IWalletKit, WalletKit } from '@reown/walletkit';
import { Core } from '@walletconnect/core';

let walletkit: IWalletKit;

export async function getWalletKit() {
  if (!walletkit) {
    await createWalletKit();
  }

  return walletkit;
}

export async function createWalletKit(relayerRegionURL?: string) {
  const core = new Core({
    projectId: '1d8fe1e80daaaf10e5e793df2bffdaab',
    relayUrl: relayerRegionURL ?? undefined,
    // logger: 'trace',
  });
  walletkit = await WalletKit.init({
    core,
    metadata: {
      name: 'React Wallet Example',
      description: 'React Wallet for WalletConnect',
      url: window.location.origin || 'https://wallet.kadena.io',
      icons: ['https://avatars.githubusercontent.com/u/19830776'],
    },
  });

  try {
    const clientId =
      await walletkit.engine.signClient.core.crypto.getClientId();
    console.log('WalletConnect ClientID: ', clientId);
    localStorage.setItem('WALLETCONNECT_CLIENT_ID', clientId);
  } catch (error) {
    console.error(
      'Failed to set WalletConnect clientId in localStorage: ',
      error,
    );
  }
}

export async function updateSignClientChainId(
  chainId: string,
  address: string,
) {
  if (!walletkit) {
    await createWalletKit();
  }

  console.log('chainId', chainId, address);
  // get most recent session
  const sessions = walletkit.getActiveSessions();
  if (!sessions) return;
  const namespace = chainId.split(':')[0];
  Object.values(sessions).forEach(async (session) => {
    await walletkit.updateSession({
      topic: session.topic,
      namespaces: {
        ...session.namespaces,
        [namespace]: {
          ...session.namespaces[namespace],
          chains: [
            ...new Set(
              [chainId].concat(
                Array.from(session?.namespaces?.[namespace]?.chains || []),
              ),
            ),
          ],
          accounts: [
            ...new Set(
              [`${chainId}:${address}`].concat(
                Array.from(session?.namespaces?.[namespace]?.accounts || []),
              ),
            ),
          ],
        },
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const chainChanged = {
      topic: session.topic,
      event: {
        name: 'chainChanged',
        data: parseInt(chainId.split(':')[1]),
      },
      chainId: chainId,
    };

    const accountsChanged = {
      topic: session.topic,
      event: {
        name: 'accountsChanged',
        data: [`${chainId}:${address}`],
      },
      chainId,
    };
    await walletkit.emitSessionEvent(chainChanged);
    await walletkit.emitSessionEvent(accountsChanged);
  });
}
