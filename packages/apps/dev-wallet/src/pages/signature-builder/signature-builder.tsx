import {
  addSignatures,
  createTransaction,
  IPactCommand,
  IPartialPactCommand,
  ISigningRequest,
  IUnsignedCommand,
} from '@kadena/client';

import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { transactionRepository } from '@/modules/transaction/transaction.repository';
import * as transactionService from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { normalizeTx } from '@/utils/normalizeSigs';
import {
  determineSchema,
  RequestScheme,
  signingRequestToPactCommand,
} from '@/utils/transaction-scheme';
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
import { execCodeParser } from '@kadena/pactjs-generator';
import classNames from 'classnames';
import yaml from 'js-yaml';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { codeArea } from './style.css';

export function SignatureBuilder() {
  const [searchParams] = useSearchParams();
  const urlTransaction = searchParams.get('transaction');
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
  const navigate = useNavigate();

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
    const schema = determineSchema(inputData);
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
      }
      navigate(`/transaction/${tx.groupId}`);
      return;
    }

    await transactionService.addTransaction({
      transaction: unsignedTx,
      profileId: profile.uuid,
      networkUUID: networkUUID,
      groupId,
    });
    navigate(`/transaction/${groupId}`);
  };

  return (
    <>
      <SideBarBreadcrumbs icon={<MonoDashboardCustomize />}>
        <SideBarBreadcrumbsItem href="/">Dashboard</SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href="/sig-builder">
          Sig Builder
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack flexDirection={'column'} gap={'md'} width="100%">
        <Heading as="h4">Paste SigData, CommandSigData, or Payload</Heading>
        <textarea
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
