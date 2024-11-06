import { ChainId } from '@kadena/client';
import { walletSdk } from '@kadena/wallet-sdk';
import { PendingTransfer, usePendingTransfers } from '../state/pending';
import { useWalletState } from '../state/wallet';

export const Transfer = () => {
  const wallet = useWalletState();
  const { addPendingTransfer } = usePendingTransfers();

  const onSubmitTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wallet.account) return;
    const formData = new FormData(e.currentTarget);
    const receiverAccount = formData.get('to') as string;
    const amount = formData.get('amount') as string;
    const chain = formData.get('chain') as ChainId;

    const transaction = walletSdk.createSimpleTransfer({
      amount: amount,
      sender: wallet.account.name,
      receiver: receiverAccount,
      chainId: chain,
      networkId: wallet.selectedNetwork,
    });

    const signed = await wallet.signTransaction(transaction);
    const result = await walletSdk.sendTransaction(
      signed,
      wallet.selectedNetwork,
      wallet.selectedChain,
    );

    const pendingTransfer: PendingTransfer = {
      requestKey: result.requestKey,
      networkId: result.networkId,
      chainId: result.chainId,
      senderAccount: wallet.account.name,
      receiverAccount,
      amount,
    };

    addPendingTransfer(pendingTransfer);
  };

  return (
    <div className="bg-dark-slate p-6 rounded-lg shadow-md w-full mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-4">Send</h3>
      <form onSubmit={onSubmitTransfer} className="space-y-4 w-full">
        <div className="flex flex-col w-full">
          <label className="text-text-secondary mb-1" htmlFor="from">
            From
          </label>
          <input
            type="text"
            value={wallet.account?.name}
            disabled
            className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-white w-full"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-text-secondary mb-1" htmlFor="to">
            To
          </label>
          <input
            name="to"
            placeholder="To"
            defaultValue={
              wallet.accounts.find((a) => a.index !== wallet.account?.index)
                ?.name
            }
            className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-white w-full"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-text-secondary mb-1" htmlFor="amount">
            Amount
          </label>
          <input
            name="amount"
            placeholder="Amount"
            defaultValue="0.01"
            className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-white w-full"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-text-secondary mb-1" htmlFor="chain">
            Chain
          </label>
          <input
            name="chain"
            placeholder="Chain"
            defaultValue="0"
            className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-white w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary-green text-white font-semibold rounded-md py-2 px-4 hover:bg-secondary-green transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};
