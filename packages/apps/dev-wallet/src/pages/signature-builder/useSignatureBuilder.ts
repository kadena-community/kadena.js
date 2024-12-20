import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { base64UrlDecodeArr } from '@kadena/cryptography-utils';
import yaml from 'js-yaml';
import {
  addSignatures,
  createTransaction,
  IPactCommand,
  IPartialPactCommand,
  IUnsignedCommand,
  ISigningRequest,
} from '@kadena/client';
import { determineSchema, RequestScheme, signingRequestToPactCommand } from '@/utils/transaction-scheme';
import { normalizeTx } from '@/utils/normalizeSigs';
import { execCodeParser } from '@kadena/pactjs-generator';

import { ITransaction, transactionRepository } from '@/modules/transaction/transaction.repository';
import * as transactionService from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';

function getTxFromUrlHash() {
  return window.location.hash ? window.location.hash.substring(1) : undefined;
}

interface UseSignatureBuilderReturn {
  input: string;
  schema?: RequestScheme;
  error?: string;
  transactions: ITransaction[];
  existingTransactions: ITransaction[];
  parsedCode?: ReturnType<typeof execCodeParser>;
  groupId: string;
  canReviewTransactions: boolean;
  setInput: (val: string) => void;
  processSigData: (inputData: string) => void;
  removeTransaction: (tx: ITransaction) => Promise<void>;
  reviewTransaction: () => void;
}

export const useSignatureBuilder = (): UseSignatureBuilderReturn => {
  const [searchParams] = useSearchParams();
  const urlTransaction = searchParams.get('transaction') || getTxFromUrlHash();

  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string>();
  const [schema, setSchema] = useState<RequestScheme>();
  const [pactCommand, setPactCommand] = useState<IPartialPactCommand>();
  const [unsignedTx, setUnsignedTx] = useState<IUnsignedCommand>();
  const [capsWithoutSigners, setCapsWithoutSigners] = useState<ISigningRequest['caps']>([]);
  const [groupId] = useState<string>(crypto.randomUUID());
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [existingTransactions, setExistingTransactions] = useState<ITransaction[]>([]);

  const { profile, activeNetwork, networks, setActiveNetwork } = useWallet();
  const navigate = usePatchedNavigate();

  const exec = useMemo(() => {
    if (pactCommand && pactCommand.payload && 'exec' in pactCommand.payload) {
      return pactCommand.payload.exec;
    }
    return { code: null, data: {} };
  }, [pactCommand]);

  const parsedCode = useMemo(() => (exec.code ? execCodeParser(exec.code) : undefined), [exec.code]);

  useEffect(() => {
    if (urlTransaction) {
      const data = new TextDecoder().decode(base64UrlDecodeArr(urlTransaction));
      setInput(data);
      processSigData(data);
      addTransactionToGroup(groupId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTransaction]);

  useEffect(() => {
    (async function addTransaction() {
      if (unsignedTx && profile) {
        await addTransactionToGroup(groupId);
        setTransactions(await transactionRepository.getTransactionsByGroup(groupId, profile.uuid));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unsignedTx]);

  async function addTransactionToGroup(groupId: string) {
    if (!unsignedTx || !profile || !activeNetwork) return;

    const command: IPactCommand = JSON.parse(unsignedTx.cmd);
    let networkUUID = activeNetwork.uuid;

    // Handle network switching if necessary
    if (command.networkId && activeNetwork.networkId !== command.networkId) {
      const network = networks.filter(({ networkId }) => networkId === command.networkId);
      if (network.length === 0) {
        setError(
          command.networkId === 'mainnet01'
            ? 'MAINNET_IS_DISABLED: Mainnet is disabled.'
            : 'NETWORK_NOT_FOUND: This network is not found',
        );
        throw new Error('Network not found');
      }
      networkUUID = network[0].uuid;
      setActiveNetwork(network[0]);
    }

    // Check if transaction already exists
    const tx = await transactionRepository.getTransactionByHashNetworkProfile(
      profile.uuid,
      networkUUID,
      unsignedTx.hash,
    );

    if (tx) {
      // Add signatures if available
      if (unsignedTx.sigs && unsignedTx.sigs.length > 0) {
        const updatedTx = addSignatures(
          tx,
          ...(unsignedTx.sigs.filter((item) => item && item.sig) as Array<{ sig: string; pubKey?: string }>),
        );

        await transactionRepository.updateTransaction({
          ...tx,
          sigs: updatedTx.sigs,
        });

        if (existingTransactions.find((item) => item.uuid === tx.uuid) === undefined) {
          setExistingTransactions((prev) => [...prev, tx]);
        }
      }
      resetInput();
      return;
    }

    // Add new transaction
    await transactionService.addTransaction({
      transaction: unsignedTx,
      profileId: profile.uuid,
      networkUUID: networkUUID,
      groupId,
    });
    resetInput();
  }

  function resetInput() {
    setPactCommand(undefined);
    setUnsignedTx(undefined);
    setCapsWithoutSigners([]);
    setInput('');
  }

  function processSigData(inputData: string) {
    setError(undefined);
    let data = inputData;
    let detectedSchema = determineSchema(inputData);

    if (detectedSchema === 'base64') {
      data = Buffer.from(inputData, 'base64').toString();
      detectedSchema = determineSchema(data);
      setInput(data);
    }

    switch (detectedSchema) {
      case 'quickSignRequest': {
        const parsed = yaml.load(data) as IUnsignedCommand;
        setPactCommand(JSON.parse(parsed.cmd));
        setUnsignedTx(normalizeTx(parsed));
        setCapsWithoutSigners([]);
        break;
      }
      case 'PactCommand': {
        const parsed = yaml.load(data) as IPartialPactCommand;
        setPactCommand(parsed);
        const tx = createTransaction(parsed);
        setUnsignedTx(normalizeTx(tx));
        setCapsWithoutSigners([]);
        break;
      }
      case 'signingRequest': {
        const parsed = yaml.load(data) as ISigningRequest;
        const pactCommand = signingRequestToPactCommand(parsed);
        setPactCommand(pactCommand);
        setCapsWithoutSigners(parsed.caps);
        setUnsignedTx(undefined);
        break;
      }
      default:
        setPactCommand(undefined);
        setUnsignedTx(undefined);
        setCapsWithoutSigners([]);
        break;
    }
    setSchema(detectedSchema);
  }

  const removeTransaction = async (tx: ITransaction) => {
    if (!profile) return;

    if (existingTransactions.find((item) => item.uuid === tx.uuid) !== undefined) {
      setExistingTransactions((prev) => prev.filter((item) => item.uuid !== tx.uuid));
    }

    if (transactions.find((item) => item.uuid === tx.uuid) !== undefined) {
      await transactionRepository.deleteTransaction(tx.uuid);
      setTransactions(await transactionRepository.getTransactionsByGroup(groupId, profile.uuid));
    }
  };

  const reviewTransaction = () => {
    navigate(`/transaction-group/${groupId}`);
  };

  const canReviewTransactions = transactions.length > 0 && ['PactCommand', 'quickSignRequest'].includes(schema!);

  return {
    input,
    schema,
    error,
    transactions,
    existingTransactions,
    parsedCode,
    groupId,
    canReviewTransactions,
    setInput,
    processSigData,
    removeTransaction,
    reviewTransaction,
  };
};
