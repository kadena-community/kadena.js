import {
  addSignatures,
  ChainId,
  createTransaction,
  IPactCommand,
  IPartialPactCommand,
  ISigningRequest,
  isSignedTransaction,
  IUnsignedCommand,
} from '@kadena/client';

import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { normalizeTx } from '@/utils/normalizeSigs';
import {
  determineSchema,
  RequestScheme,
  signingRequestToPactCommand,
} from '@/utils/transaction-scheme';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { base64UrlDecodeArr } from '@kadena/cryptography-utils';
import { MonoDashboardCustomize } from '@kadena/kode-icons/system';
import {
  Box,
  Button,
  Heading,
  Notification,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem } from '@kadena/kode-ui/patterns';
import { PactNumber } from '@kadena/pactjs';
import { execCodeParser } from '@kadena/pactjs-generator';
import classNames from 'classnames';
import yaml from 'js-yaml';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { codeArea } from './style.css';

const getTxFromUrlHash = () =>
  window.location.hash ? window.location.hash.substring(1) : undefined;

export function SignatureBuilder() {
  const [searchParams] = useSearchParams();
  const urlTransaction = searchParams.get('transaction') || getTxFromUrlHash();
  const [error, setError] = useState<string>();
  const [schema, setSchema] = useState<RequestScheme>();
  const [input, setInput] = useState<string>('');
  const [pactCommand, setPactCommand] = useState<IPartialPactCommand>();
  const [unsignedTx, setUnsignedTx] = useState<IUnsignedCommand>();
  const [signed, setSignedTx] = useState<IUnsignedCommand>();
  const [capsWithoutSigners, setCapsWithoutSigners] = useState<
    ISigningRequest['caps']
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
      processSig(data);
    }
  }, [urlTransaction]);

  function processSig(inputData: string) {
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

  const reviewTransaction = async () => {
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
            ? 'MANNET_IS_DISABLED: Mainnet is disabled since the wallet is not fully tested; you can try other networks'
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
    const groupId = crypto.randomUUID();

    // check if transaction already exists
    const tx = await transactionRepository.getTransactionByHashNetworkProfile(
      profile.uuid,
      networkUUID,
      unsignedTx.hash,
    );

    const parsedCode =
      'exec' in command.payload
        ? execCodeParser(command.payload.exec.code)
        : undefined;

    const continuationData = {
      autoContinue: false,
      target: '' as ChainId,
      source: '',
      amount: NaN,
    };

    if (parsedCode && parsedCode[0]) {
      const code = parsedCode[0];
      if (code.function.name === 'transfer-crosschain') {
        const targetObject = code.args[3] as { string: string };
        continuationData.autoContinue = true;
        continuationData.target = targetObject.string as ChainId;
        continuationData.source = command.meta.chainId;
        continuationData.amount = new PactNumber(
          code.args[4] as unknown as { int: string } | { decimal: string },
        ).toNumber();
      }
    }

    const txWithMetaData = {
      ...unsignedTx,
      ...(continuationData.autoContinue
        ? {
            continuation: {
              autoContinue: true,
              crossChainId: continuationData.target,
            },
            purpose: {
              type: 'cross-chain',
              data: continuationData,
            },
          }
        : {}),
    };

    if (tx) {
      if (txWithMetaData.sigs && txWithMetaData.sigs.length > 0) {
        const updatedTx = addSignatures(
          tx,
          ...(txWithMetaData.sigs.filter((item) => item && item.sig) as Array<{
            sig: string;
            pubKey?: string;
          }>),
        );
        await transactionRepository.updateTransaction({
          ...tx,
          ...txWithMetaData,
          sigs: updatedTx.sigs,
          status:
            tx.status === 'initiated' && isSignedTransaction(txWithMetaData)
              ? 'signed'
              : tx.status,
        } as ITransaction);
      }
      navigate(`/transaction/${tx.uuid}`);
      return;
    }

    const dbTx: ITransaction = {
      ...txWithMetaData,
      uuid: crypto.randomUUID(),
      profileId: profile.uuid,
      networkUUID: networkUUID,
      status: isSignedTransaction(txWithMetaData) ? 'signed' : 'initiated',
      groupId,
    };
    console.log('dbTx', dbTx);
    await transactionRepository.addTransaction(dbTx);

    navigate(`/transaction/${dbTx.uuid}`);
  };

  return (
    <>
      <SideBarBreadcrumbs icon={<MonoDashboardCustomize />} isGlobal>
        <SideBarBreadcrumbsItem href="/sig-builder">
          Sig Builder
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack flexDirection={'column'} gap={'md'} width="100%">
        <Heading as="h4">Paste SigData, CommandSigData, or Payload</Heading>
        <textarea
          autoFocus
          value={input}
          className={classNames(codeArea)}
          onChange={(e) => {
            e.preventDefault();
            setError(undefined);
            processSig(e.target.value);
          }}
        />
        <Box>{schema && <Text>{`Schema: ${schema}`}</Text>}</Box>
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
        <Box>
          <Box>
            {['PactCommand', 'quickSignRequest'].includes(schema!) && (
              <Button onPress={reviewTransaction}>Review Transaction</Button>
            )}
          </Box>
        </Box>
      </Stack>
    </>
  );
}
