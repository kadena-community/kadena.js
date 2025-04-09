import { useEffect } from "react";
import { useKadenaWallet, KadenaWalletState } from "./context";

let activeEventListenerName: string | boolean = false;

export function useKadenaWalletState(): KadenaWalletState {
  const wallet = useKadenaWallet();

  useEffect(() => {
    (async () => {
      if (!wallet.currentAdapterName) {
        return;
      }
      wallet.setState({
        loading: true,
        accounts: [],
        activeAccount: null,
        networks: [],
        activeNetwork: null,
      });
      const [accounts, activeAccount, networks, activeNetwork] = await Promise.allSettled([
        wallet.client.getAccounts(wallet.currentAdapterName),
        wallet.client.getActiveAccount(wallet.currentAdapterName),
        wallet.client.getNetworks(wallet.currentAdapterName),
        wallet.client.getActiveNetwork(wallet.currentAdapterName),
      ]);
      wallet.setState({
        loading: false,
        accounts: accounts.status === "fulfilled" ? accounts.value : [],
        activeAccount: activeAccount.status === "fulfilled" ? activeAccount.value : null,
        networks: networks.status === "fulfilled" ? networks.value : [],
        activeNetwork: activeNetwork.status === "fulfilled" ? activeNetwork.value : null,
      });
    })();
  }, [wallet.currentAdapterName]);

  useEffect(() => {
    if (!wallet.currentAdapterName || activeEventListenerName === wallet.currentAdapterName) {
      return;
    }

    wallet.client.onAccountChange(wallet.currentAdapterName, (account) => {
      console.log("Account changed", account);
      wallet.setState({
        activeAccount: account,
      });
    });
    wallet.client.onNetworkChange(wallet.currentAdapterName, (network) => {
      console.log("Network changed", network);
      wallet.setState({
        activeNetwork: network,
      });
    });

    activeEventListenerName = wallet.currentAdapterName;

    return () => {
      activeEventListenerName = false;
    };
  }, [wallet.currentAdapterName]);

  return wallet.state;
}
