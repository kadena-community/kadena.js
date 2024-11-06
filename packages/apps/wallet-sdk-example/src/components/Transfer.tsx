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

    console.log('pendingTransfer', pendingTransfer);

    addPendingTransfer(pendingTransfer);
  };

  return (
    <div>
      <h3 className="text-2xl">Send</h3>
      <form
        className="flex flex-row gap-4 w-[250px]"
        onSubmit={onSubmitTransfer}
      >
        <table>
          <tbody>
            <tr>
              <td>From</td>
              <td>
                <input type="text" value={wallet.account?.name} disabled />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="to">To</label>
              </td>
              <td>
                <input
                  name="to"
                  placeholder="To"
                  // Default to first non-selected account for testing
                  defaultValue={
                    wallet.accounts.find(
                      (a) => a.index !== wallet.account?.index,
                    )?.name
                  }
                ></input>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="amount">Amount</label>
              </td>
              <td>
                <input
                  name="amount"
                  placeholder="Amount"
                  defaultValue="0.01"
                ></input>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="chain">Chain</label>
              </td>
              <td>
                <input
                  name="chain"
                  placeholder="Chain"
                  defaultValue="0"
                ></input>
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <button
            type="submit"
            className="bg-gray-700 text-white rounded p-2 hover:bg-gray-600 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
