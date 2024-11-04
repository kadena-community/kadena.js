import { ChainId } from '@kadena/client';
import { kadenaGenMnemonic } from '@kadena/hd-wallet';
import { walletSdk } from '@kadena/wallet-sdk';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import {
  mnemonicWordsAtom,
  PendingTransfer,
  pendingTransfersAtom,
  selectedAccountAtom,
  selectedFungibleAtom,
  selectedNetworkAtom,
} from './state';

function App() {
  const [selectedAccount] = useAtom<string>(selectedAccountAtom);
  const [mnemonicWords, setMnemonicWords] = useAtom<string>(mnemonicWordsAtom);
  const [selectedFungible] = useAtom<string>(selectedFungibleAtom);
  const [selectedNetwork] = useAtom<string>(selectedNetworkAtom);
  const [pendingTransfers, setPendingTransfers] = useAtom(pendingTransfersAtom);

  const {
    data: transfers,
    error,
    refetch,
  } = useQuery({
    queryKey: ['transfers', selectedAccount],
    queryFn: () =>
      walletSdk.getTransfers(
        selectedAccount,
        selectedNetwork,
        selectedFungible,
      ),
  });

  useEffect(() => {
    if (!transfers) return;
    const controller = new AbortController();
    walletSdk.subscribeOnCrossChainComplete(transfers, () => refetch(), {
      signal: controller.signal,
    });
    return () => controller.abort();
  }, [transfers, refetch]);

  useEffect(() => {
    const controller = new AbortController();
    walletSdk.subscribePendingTransactions(
      pendingTransfers.map((t) => t.descriptor),
      () => refetch(),
      { signal: controller.signal },
    );
    return () => controller.abort();
  }, [pendingTransfers, refetch]);

  const onSubmitTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const to = formData.get('to') as string;
    const amount = formData.get('amount') as string;
    const chain = formData.get('chain') as ChainId;

    // const transaction = walletSdk.createSimpleTransfer({
    //   amount: amount,
    //   sender: selectedAccount,
    //   receiver: to,
    //   chainId: chain,
    //   networkId: selectedNetwork,
    // });

    const pendingTransfer: PendingTransfer = {
      from: selectedAccount,
      to,
      amount,
      chain,
      requestKey: '',
      descriptor: {
        requestKey: '',
        chainId: chain,
        networkId: 'testnet04',
      },
    };

    setPendingTransfers((prev) => [...prev, pendingTransfer]);
  };

  console.log({ selectedAccount, transfers, error });

  return (
    <>
      <div className="w-[800px]">
        <div>
          <h3 className="text-2xl">Word phrase</h3>
          <input
            name="mnemonic_phrase"
            onChange={(e) => setMnemonicWords(e.target.value)}
            value={mnemonicWords}
          ></input>
          <button onClick={() => setMnemonicWords(kadenaGenMnemonic())}>
            Generate random
          </button>
        </div>
        <div>
          <h3 className="text-2xl">Account:</h3>
          {selectedAccount}
        </div>
        <div>
          <h3 className="text-2xl">Send</h3>
          <form
            className="flex flex-col gap-2 w-[250px]"
            onSubmit={onSubmitTransfer}
          >
            <div className="flex flex-row justify-between">
              <label htmlFor="to">To</label>
              <input name="to" placeholder="To"></input>
            </div>
            <div className="flex flex-row justify-between">
              <label htmlFor="amount">Amount</label>
              <input name="amount" placeholder="Amount"></input>
            </div>
            <div className="flex flex-row justify-between">
              <label htmlFor="chain">Chain</label>
              <input name="chain" placeholder="Chain"></input>
            </div>
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
        <div>
          <h3 className="text-2xl">Transfers</h3>
          <div>
            <pre>
              {transfers?.map((transfer, index) => (
                <div key={index} className="m-4">
                  {`Request Key: ${transfer.requestKey}`}
                  <br />
                  {`Chain: ${transfer.chainId}`}
                  <br />
                  {`Sender: ${transfer.senderAccount}`}
                  <br />
                  {`Receiver: ${transfer.receiverAccount}`}
                  <br />
                  {`Amount: ${transfer.amount}`}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
