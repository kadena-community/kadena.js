import { walletSdk } from '@kadena/wallet-sdk';
import { fundDifferentFungibleAccount } from '../domain/fund';
import { useWalletState } from '../state/wallet';

export const useFund = () => {
  const wallet = useWalletState();

  const onFundOtherFungible = async () => {
    if (!wallet.account) return;

    const transaction = fundDifferentFungibleAccount({
      networkId: wallet.selectedNetwork,
      chainId: wallet.selectedChain,
      account: {
        name: wallet.account.name,
        publicKeys: [wallet.account.publicKey],
        predicate: 'keys-all',
      },
    });

    const signedTransaction = await wallet.signTransaction(transaction);
    console.log(signedTransaction);
    const final = await walletSdk.sendTransaction(
      signedTransaction,
      wallet.selectedNetwork,
      wallet.selectedChain,
    );
    console.log(final);
  };
  return { onFundOtherFungible };
};
