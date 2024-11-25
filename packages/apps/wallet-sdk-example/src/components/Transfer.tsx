import { ChainId, ICommand, IUnsignedCommand } from '@kadena/client';
import { MonoAccountTree } from '@kadena/kode-icons/system';
import {
  Button,
  Card,
  ContentHeader,
  Divider,
  Select,
  SelectItem,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import { walletSdk } from '@kadena/wallet-sdk';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChains } from '../hooks/chains';
import { PendingTransfer, usePendingTransfers } from '../state/pending';
import { useWalletState } from '../state/wallet';
import { AlertDialog } from './AlertDialog';
import { TransactionModal } from './TransactionModal';

export const Transfer = () => {
  const wallet = useWalletState();
  const { addPendingTransfer } = usePendingTransfers();
  const [isCrossChain, setIsCrossChain] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
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

  const navigate = useNavigate();
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
      : walletSdk.createSimpleTransfer({
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
        setAlertMessage('Transaction was not signed');
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
      setAlertMessage(
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
      navigate('/list');
    } catch (error) {
      console.warn(error);
      setError('Failed to send transaction');
      setAlertMessage('Failed to send transaction');
      setSignedTransaction(null);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto p-6">
      <Card fullWidth>
        <ContentHeader
          heading="Accounts"
          description="Send funds across acounts."
          icon={<MonoAccountTree />}
        />

        <Divider />
        <Stack flexDirection="column" gap="md">
          <form onSubmit={onSubmitTransfer}>
            <Stack flexDirection="column" gap="sm">
              <TextField
                label="From"
                value={wallet.account?.name}
                isDisabled
                size="md"
              />
              <TextField
                label="To"
                name="to"
                placeholder="Enter recipient account"
                defaultValue={
                  wallet.accounts.find((a) => a.index !== wallet.account?.index)
                    ?.name
                }
                size="md"
              />
              <TextField
                label="Amount"
                name="amount"
                placeholder="Enter amount"
                defaultValue="0.01"
                size="md"
              />
              <Stack flexDirection="row" alignItems="center" gap="sm">
                <input
                  type="checkbox"
                  id="crossChain"
                  checked={isCrossChain}
                  onChange={() => setIsCrossChain(!isCrossChain)}
                />
                <label htmlFor="crossChain">
                  <Text>Cross-Chain Transfer</Text>
                </label>
              </Stack>
              <Select
                label={isCrossChain ? 'From Chain' : 'Chain'}
                onSelectionChange={(key) => wallet.selectChain(key as ChainId)}
                selectedKey={wallet.selectedChain}
                placeholder="Select Chain"
              >
                {chains.map((chain) => (
                  <SelectItem key={chain}>{chain}</SelectItem>
                ))}
              </Select>

              {isCrossChain && (
                <Select
                  label="To Chain"
                  onSelectionChange={(key) =>
                    wallet.setSelectedToChain(key as ChainId)
                  }
                  selectedKey={wallet.selectedToChain ?? ''}
                  placeholder="Select Destination Chain"
                >
                  {chains.map((chain) => (
                    <SelectItem key={chain}>{chain}</SelectItem>
                  ))}
                </Select>
              )}

              {error && <Text size="small">{error}</Text>}

              <Divider />
              <Button type="submit" variant="primary">
                Send
              </Button>
            </Stack>
          </form>
        </Stack>

        {isModalOpen && signedTransaction && (
          <TransactionModal
            estimatedGas={estimatedGas}
            transactionJSON={JSON.stringify(signedTransaction, null, 2)}
            onClose={() => setIsModalOpen(false)}
            onConfirm={confirmTransaction}
          />
        )}

        {alertMessage && (
          <AlertDialog
            title="Transaction Alert"
            message={alertMessage}
            onClose={() => setAlertMessage(null)}
          />
        )}
      </Card>
    </div>
  );
};
