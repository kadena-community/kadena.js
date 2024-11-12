import { ChainId, ICommand, IUnsignedCommand } from '@kadena/client';
import { walletSdk } from '@kadena/wallet-sdk';
import React, { useState } from 'react';
import { useChains } from '../hooks/chains';
import { PendingTransfer, usePendingTransfers } from '../state/pending';
import { useWalletState } from '../state/wallet';
import { TransactionModal } from './TransactionModal';

export const Transfer = () => {
  const wallet = useWalletState();
  const { addPendingTransfer } = usePendingTransfers();
  const [isCrossChain, setIsCrossChain] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState<number | null>(null);
  const [signedTransaction, setSignedTransaction] = useState<ICommand | null>(
    null,
  );
  const [transactionDetails, setTransactionDetails] = useState<{
    receiverAccount: string;
    amount: string;
  } | null>(null);

  const { chains } = useChains(wallet.selectedNetwork);

  const prepareTransaction = async (
    receiverAccount: string,
    amount: string,
  ) => {
    if (!wallet.account) return;
    const fromChain = wallet.selectedChain;
    const toChain = isCrossChain ? wallet.selectedToChain : fromChain;

    if (isCrossChain && fromChain === toChain) {
      throw new Error(
        'Cannot perform a cross-chain transfer to the same chain',
      );
    }

    const transaction = isCrossChain
      ? ({} as IUnsignedCommand)
      : // ? walletSdk.createCrossChainTransfer({
        //     amount,
        //     sender: wallet.account.name,
        //     receiver: receiverAccount,
        //     chainId: fromChain,
        //     toChainId: toChain!,
        //     networkId: wallet.selectedNetwork,
        //   })
        walletSdk.createSimpleTransfer({
          amount,
          sender: wallet.account.name,
          receiver: receiverAccount,
          chainId: fromChain,
          networkId: wallet.selectedNetwork,
        });

    return await wallet.signTransaction(transaction);
  };

  const onSubmitTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wallet.account) return;

    const formData = new FormData(e.currentTarget);
    const receiverAccount = formData.get('to') as string;
    const amount = formData.get('amount') as string;

    try {
      const signed = await prepareTransaction(receiverAccount, amount);
      if (!signed) {
        alert('Transaction was not signed');
        return;
      }

      const gasLimit = await walletSdk.getGasLimitEstimate(
        signed,
        wallet.selectedNetwork,
        wallet.selectedChain,
      );

      setSignedTransaction(signed);
      setEstimatedGas(gasLimit);
      setTransactionDetails({ receiverAccount, amount });
      setIsModalOpen(true);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to prepare transaction',
      );
    }
  };

  const confirmTransaction = async () => {
    if (!wallet.account || !signedTransaction || !transactionDetails) return;

    try {
      const result = await walletSdk.sendTransaction(
        signedTransaction,
        wallet.selectedNetwork,
        wallet.selectedChain,
      );

      const pendingTransfer: PendingTransfer = {
        requestKey: result.requestKey,
        networkId: result.networkId,
        chainId: result.chainId,
        senderAccount: wallet.account.name,
        receiverAccount: transactionDetails.receiverAccount,
        amount: transactionDetails.amount,
      };

      addPendingTransfer(pendingTransfer);
      setIsModalOpen(false);
      setSignedTransaction(null);
    } catch (error) {
      console.warn(error);
      setError('Failed to send transaction');
    }
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
            defaultValue={wallet.account?.name}
            disabled
            className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-gray-400 w-full"
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

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="crossChain"
            checked={isCrossChain}
            onChange={() => setIsCrossChain(!isCrossChain)}
          />
          <label htmlFor="crossChain" className="text-text-secondary">
            Cross-Chain Transfer
          </label>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-text-secondary mb-1" htmlFor="chain">
            {isCrossChain ? 'From Chain' : 'Chain'}
          </label>
          <select
            name="chain"
            value={wallet.selectedChain}
            onChange={(e) => wallet.selectChain(e.target.value as ChainId)}
            className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-white w-full"
          >
            {chains.map((chain) => (
              <option key={chain} value={chain}>
                {chain}
              </option>
            ))}
          </select>
        </div>

        {isCrossChain && (
          <div className="flex flex-col w-full">
            <label className="text-text-secondary mb-1" htmlFor="toChain">
              To Chain
            </label>
            <select
              name="toChain"
              value={wallet.selectedToChain ?? ''}
              onChange={(e) =>
                wallet.setSelectedToChain(e.target.value as ChainId)
              }
              className="bg-medium-slate border border-border-gray rounded-md py-2 px-3 text-white w-full"
            >
              {chains.map((chain) => (
                <option key={chain} value={chain}>
                  {chain}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-primary-green text-white font-semibold rounded-md py-2 px-4 hover:bg-secondary-green transition"
        >
          Send
        </button>
      </form>

      {isModalOpen && signedTransaction && (
        <TransactionModal
          estimatedGas={estimatedGas}
          transactionJSON={JSON.stringify(signedTransaction, null, 2)}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmTransaction}
        />
      )}
    </div>
  );
};
