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
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChains } from '../hooks/chains';
import { PendingTransfer, usePendingTransfers } from '../state/pending';

import SdkFunctionDisplay from '../components/SdkFunctionDisplayer'; // Demo
import { TransactionModal } from '../components/TransactionModal';

import { AlertDialog } from '../components/AlertDialog';
import { useFunctionTracker } from '../hooks/functionTracker';
import { useWalletState } from '../state/wallet';

type SimpleCreateTransfer = Parameters<
  typeof walletSdk.createSimpleTransfer
>[0];

type CrossChainCreateTransfer = Parameters<
  typeof walletSdk.createCrossChainTransfer
>[0];

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

  const trackCreateSimpleTransfer = useFunctionTracker(
    'walletSdk.createSimpleTransfer',
  );
  const trackCreateCrossChainTransfer = useFunctionTracker(
    'walletSdk.createCrossChainTransfer',
  );
  const trackGasEstimate = useFunctionTracker('walletSdk.getGasLimitEstimate');
  const trackSendTransaction = useFunctionTracker('walletSdk.sendTransaction');

  const navigate = useNavigate();
  const { chains } = useChains(wallet.selectedNetwork);

  const [receiverAccount, setReceiverAccount] = useState<string>(
    wallet.accounts.find((a) => a.index !== wallet.account?.index)?.name || '',
  );
  const [amount, setAmount] = useState<string>('0.01');

  /* --- Start Demo purposes --- */
  useEffect(() => {
    if (!wallet.account) return;

    const fromChain = wallet.selectedChain;

    if (isCrossChain) {
      trackCreateCrossChainTransfer.setArgs({
        amount: amount,
        chainId: fromChain,
        networkId: wallet.selectedNetwork,
        receiver: {
          account: receiverAccount,
          keyset: {
            keys: [receiverAccount.split(':')[1]],
            pred: 'keys-all',
          },
        },
        sender: {
          account: wallet.account.name,
          publicKeys: [wallet.account.publicKey],
        },
        targetChainId: wallet.selectedToChain,
      });
    } else {
      trackCreateSimpleTransfer.setArgs({
        amount,
        sender: wallet.account.name,
        receiver: receiverAccount,
        chainId: fromChain,
        networkId: wallet.selectedNetwork,
      });
    }
    trackGasEstimate.setArgs(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    wallet.account,
    amount,
    receiverAccount,
    wallet.selectedChain,
    wallet.selectedNetwork,
    isCrossChain,
  ]);
  /* -- End demo ---------------*/

  const prepareTransaction = async () => {
    if (!wallet.account) return;
    const fromChain = wallet.selectedChain;
    const toChain = isCrossChain ? wallet.selectedToChain : fromChain;

    if (isCrossChain && !toChain) {
      throw new Error('To chain not set');
    }
    if (isCrossChain && fromChain === toChain) {
      throw new Error(
        'Cannot perform a cross-chain transfer to the same chain',
      );
    }

    let transaction: IUnsignedCommand;

    if (isCrossChain) {
      const crossChainTransferArgs: CrossChainCreateTransfer = {
        amount: amount,
        chainId: fromChain,
        networkId: wallet.selectedNetwork,
        receiver: {
          account: receiverAccount,
          keyset: {
            keys: [receiverAccount.split(':')[1]],
            pred: 'keys-all',
          },
        },
        sender: {
          account: wallet.account.name,
          publicKeys: [wallet.account.publicKey],
        },
        targetChainId: toChain!,
      };
      transaction = walletSdk.createCrossChainTransfer(crossChainTransferArgs);
      return await wallet.signTransaction(transaction);
    } else {
      const functionArgs: SimpleCreateTransfer & { networkId: string } = {
        amount,
        sender: wallet.account.name,
        receiver: receiverAccount,
        chainId: fromChain,
        networkId: wallet.selectedNetwork,
      };

      transaction = walletSdk.createSimpleTransfer(functionArgs);
      return await wallet.signTransaction(transaction);
    }
  };

  const onSubmitTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wallet.account) return;

    try {
      const signed = await prepareTransaction();
      if (!signed) {
        setAlertMessage('Transaction was not signed');
        return;
      }

      const gasLimit = await trackGasEstimate.wrap(
        walletSdk.getGasLimitEstimate,
      )(signed, wallet.selectedNetwork, wallet.selectedChain);

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

      /* -- Start demo ---------------*/
      trackGasEstimate.setArgs(null);
      trackCreateSimpleTransfer.setArgs(null);
      trackCreateCrossChainTransfer.setArgs(null);
      /* -- End demo ---------------*/
    }
  };

  const confirmTransaction = async () => {
    if (!wallet.account || !signedTransaction || !transactionDetails) return;

    try {
      const result = await trackSendTransaction.wrap(walletSdk.sendTransaction)(
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

      /* -- Start demo ---------------*/
      trackGasEstimate.setArgs(null);
      trackCreateSimpleTransfer.setArgs(null);
      trackCreateCrossChainTransfer.setArgs(null);
      /* -- End demo ---------------*/
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
          heading="Transfer Funds"
          description="Send funds across accounts."
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
                value={receiverAccount}
                onValueChange={(value) => setReceiverAccount(value)}
                size="md"
              />
              <TextField
                label="Amount"
                name="amount"
                placeholder="Enter amount"
                value={amount}
                onValueChange={(value) => setAmount(value)}
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
            gasFunctionCall={trackGasEstimate.data}
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

      {/*
        This is for Demo purposes, displaying the SDK function used to create the transaction
      */}

      <SdkFunctionDisplay
        data={
          isCrossChain
            ? trackCreateCrossChainTransfer.data
            : trackCreateSimpleTransfer.data
        }
      />
    </div>
  );
};
