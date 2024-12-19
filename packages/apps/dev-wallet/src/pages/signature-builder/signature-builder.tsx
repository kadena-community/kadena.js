import {
  addSignatures,
  createTransaction,
  IPactCommand,
  IPartialPactCommand,
  ISigningRequest,
  IUnsignedCommand,
} from '@kadena/client';

import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import * as transactionService from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { normalizeTx } from '@/utils/normalizeSigs';
import { browse, readContent } from '@/utils/select-file';
import {
  determineSchema,
  RequestScheme,
  signingRequestToPactCommand,
} from '@/utils/transaction-scheme';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { base64UrlDecodeArr } from '@kadena/cryptography-utils';
import {
  MonoDashboardCustomize,
  MonoRemove,
  MonoRemoveCircleOutline,
  MonoRestoreFromTrash,
  MonoSignature,
} from '@kadena/kode-icons/system';
import {
  Box,
  Button,
  Heading,
  Notification,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { execCodeParser } from '@kadena/pactjs-generator';
import classNames from 'classnames';
import yaml from 'js-yaml';
import { FC, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TxTileGeneric } from '../transaction-group/components/TxTileGeneric';
import { codeArea } from './style.css';

const getTxFromUrlHash = () =>
  window.location.hash ? window.location.hash.substring(1) : undefined;

export function SignatureBuilder() {
  const [searchParams] = useSearchParams();
  const urlTransaction = searchParams.get('transaction') || getTxFromUrlHash();
  const [error, setError] = useState<string>();
  const [schema, setSchema] = useState<RequestScheme>();
  const [input, setInput] = useState<string>('');
  const [fileContent, setFileContent] = useState<any>();
  const [pactCommand, setPactCommand] = useState<IPartialPactCommand>();
  const [unsignedTx, setUnsignedTx] = useState<IUnsignedCommand>();
  const [signed, setSignedTx] = useState<IUnsignedCommand>();
  const [capsWithoutSigners, setCapsWithoutSigners] = useState<
    ISigningRequest['caps']
  >([]);
  const [groupId] = useState<string>(crypto.randomUUID());
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [existingTransactions, setExistingTransactions] = useState<
    ITransaction[]
  >([]);
  const { profile, activeNetwork, networks, setActiveNetwork } = useWallet();
  const navigate = usePatchedNavigate();

  const exec =
    pactCommand && pactCommand.payload && 'exec' in pactCommand.payload
      ? pactCommand.payload.exec
      : { code: null, data: {} };

  const parsedCode = useMemo(
    () => (exec.code ? execCodeParser(exec.code) : undefined),
    [exec.code],
  );

  console.log('parsedCode', {
    parsedCode,
    capsWithoutSigners,
    signed,
    setSignedTx,
  });

  useEffect(() => {
    if (urlTransaction) {
      const data = new TextDecoder().decode(base64UrlDecodeArr(urlTransaction));
      setInput(data);
      processSigData(data);
      addTransactionToGroup(groupId);
    }
  }, [urlTransaction]);

  useEffect(() => {
    async function addTransaction() {
      if (unsignedTx && profile) {
        await addTransactionToGroup(groupId);
        setTransactions(
          await transactionRepository.getTransactionsByGroup(
            groupId,
            profile.uuid,
          ),
        );
      }
    }
    addTransaction();
  }, [unsignedTx]);

  function processSigData(inputData: string) {
    setInput(inputData);
    let schema = determineSchema(inputData);
    if (schema === 'base64') {
      inputData = Buffer.from(inputData, 'base64').toString();
      schema = determineSchema(inputData);
      setInput(inputData);
    }

    switch (schema) {
      case 'quickSignRequest': {
        const parsed = yaml.load(inputData) as IUnsignedCommand;
        setPactCommand(JSON.parse(parsed.cmd));
        setUnsignedTx(normalizeTx(parsed));
        setCapsWithoutSigners([]);
        break;
      }
      case 'PactCommand': {
        const parsed = yaml.load(inputData) as IPartialPactCommand;
        setPactCommand(parsed);
        const tx = createTransaction(parsed);
        setUnsignedTx(normalizeTx(tx));
        setCapsWithoutSigners([]);
        break;
      }
      case 'signingRequest': {
        const parsed = yaml.load(inputData) as ISigningRequest;
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
    setSchema(schema);
  }

  const removeTransactionToAdd = async (tx: ITransaction) => {
    if (!profile) return;

    // remove transaction from existingTransactions
    if (
      existingTransactions.find((item) => item.uuid === tx.uuid) !== undefined
    ) {
      setExistingTransactions((prev) =>
        prev.filter((item) => item.uuid !== tx.uuid),
      );
    }

    // remove transaction from group
    if (transactions.find((item) => item.uuid === tx.uuid) !== undefined) {
      await transactionRepository.deleteTransaction(tx.uuid);
      setTransactions(
        await transactionRepository.getTransactionsByGroup(
          groupId,
          profile.uuid,
        ),
      );
    }
  };

  const addTransactionToGroup = async (groupId: string) => {
    if (!unsignedTx || !profile || !activeNetwork) return;

    const command: IPactCommand = JSON.parse(unsignedTx.cmd);
    let networkUUID = activeNetwork.uuid;

    if (command.networkId && activeNetwork.networkId !== command.networkId) {
      const network = networks.filter(
        ({ networkId }) => networkId === command.networkId,
      );
      if (network.length === 0) {
        setError(
          command.networkId === 'mainnet01'
            ? 'MAINNET_IS_DISABLED: Mainnet is disabled since the wallet is not fully tested; you can try other networks'
            : 'NETWORK_NOT_FOUND: This network is not found',
        );
        throw new Error('Network not found');
      }
      if (network.length > 1) {
        // TODO: open a dialog to select network
      }
      networkUUID = network[0].uuid;
      // switch network
      setActiveNetwork(network[0]);
    }

    // check if transaction already exists
    const tx = await transactionRepository.getTransactionByHashNetworkProfile(
      profile.uuid,
      networkUUID,
      unsignedTx.hash,
    );

    if (tx) {
      if (unsignedTx.sigs && unsignedTx.sigs.length > 0) {
        const updatedTx = addSignatures(
          tx,
          ...(unsignedTx.sigs.filter((item) => item && item.sig) as Array<{
            sig: string;
            pubKey?: string;
          }>),
        );

        await transactionRepository.updateTransaction({
          ...tx,
          sigs: updatedTx.sigs,
        });

        if (
          existingTransactions.find((item) => item.uuid === tx.uuid) ===
          undefined
        ) {
          setExistingTransactions((prev) => [...prev, tx]);
        }
      }
      setPactCommand(undefined);
      setUnsignedTx(undefined);
      setCapsWithoutSigners([]);
      setInput('');
      return;
    }

    await transactionService.addTransaction({
      transaction: unsignedTx,
      profileId: profile.uuid,
      networkUUID: networkUUID,
      groupId,
    });

    setPactCommand(undefined);
    setUnsignedTx(undefined);
    setCapsWithoutSigners([]);
    setInput('');
  };

  const reviewTransaction = () => {
    navigate(`/transaction-group/${groupId}`);
  };

  return (
    <>
      <SideBarBreadcrumbs icon={<MonoDashboardCustomize />} isGlobal>
        <SideBarBreadcrumbsItem href="/sig-builder">
          Sig Builder
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack flexDirection={'column'} gap={'md'} width="100%">
        <Heading as="h4">
          Paste or Upload SigData, CommandSigData, or Payload
        </Heading>
        <textarea
          value={input}
          className={classNames(codeArea)}
          onChange={(e) => {
            e.preventDefault();
            setError(undefined);
            processSigData(e.target.value);
          }}
        />

        <Box>{schema && <Text>{`Schema: ${schema}`}</Text>} </Box>
        {schema === 'signingRequest' && (
          <Notification intent="info" role="status">
            SigningRequest is not supported yet, We are working on it.
          </Notification>
        )}
        {error && (
          <Notification intent="negative" role="alert">
            {error}
          </Notification>
        )}

        {/* <Box>
          <Button
            variant="outlined"
            onClick={async () => {
              setError(undefined);
              setFileContent(undefined);
              const file = await browse(true);
              if (file && file instanceof File) {
                const content = await readContent(file);
                try {
                  const json = JSON.parse(content, (_key, value) => {
                    if (typeof value !== 'string') return value;
                    if (value.startsWith('Uint8Array:')) {
                      const base64Url = value.split('Uint8Array:')[1];
                      return base64UrlDecodeArr(base64Url);
                    }
                    if (value.startsWith('ArrayBuffer:')) {
                      const base64Url = value.split('ArrayBuffer:')[1];
                      return base64UrlDecodeArr(base64Url).buffer;
                    }
                    return value;
                  });
                  setFileContent(json);
                } catch (e) {
                  setError('Invalid file format');
                }
              }
            }}
          >
            Add From File(s)
          </Button>
        </Box> */}

        <Box>
          {transactions.length > 0 && (
            <>
              <Text>Transactions to review</Text>
              {transactions.map((tx) => (
                <TxTileGeneric
                  tx={tx}
                  buttons={[
                    {
                      label: 'Discard',
                      Icon: () => <MonoRemoveCircleOutline />,
                      onClick: () => removeTransactionToAdd(tx),
                      position: 'flex-start',
                    },
                  ]}
                />
              ))}
            </>
          )}
        </Box>

        <Box>
          <Box>
            {transactions.length > 0 &&
              ['PactCommand', 'quickSignRequest'].includes(schema!) && (
                <Button onPress={reviewTransaction}>
                  Review Transaction(s)
                </Button>
              )}
          </Box>
        </Box>

        <Box>
          {existingTransactions.length > 0 &&
            existingTransactions.map((tx) => (
              <TxTileGeneric
                tx={tx}
                buttons={[
                  {
                    label: 'Discard',
                    Icon: () => <MonoRemoveCircleOutline />,
                    onClick: () => removeTransactionToAdd(tx),
                    position: 'flex-start',
                  },
                  {
                    label: 'Open',
                    onClick: () => navigate(`/transaction-group/${tx.groupId}`),
                    Icon: () => <MonoSignature />,
                    position: 'flex-end',
                  },
                ]}
              />
            ))}
        </Box>
      </Stack>
    </>
  );
}
