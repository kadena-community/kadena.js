import {
  ICommand,
  IPactCommand,
  IPartialPactCommand,
  ISigningRequest,
  IUnsignedCommand,
  createTransaction,
} from '@kadena/client';

import { PactCodeView } from '@/Components/PactCodeView/PactCodeView';
import { Wizard } from '@/Components/Wizard/Wizard';
import { transactionRepository } from '@/modules/transaction/transaction.repository';
import * as transactionService from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import {
  Box,
  Button,
  Card,
  Heading,
  Notification,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { execCodeParser } from '@kadena/pactjs-generator';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { panelClass } from '../home/style.css';
import { codeArea } from './style.css';
import { normalizeSigs, normalizeTx } from './utils/normalizeSigs';

type requestScheme =
  | 'invalid'
  | 'quickSignRequest'
  | 'signingRequest'
  | 'PactCommand';

function determineSchema(input: string): requestScheme {
  let json;
  try {
    // TODO: pase YAML as well
    json = JSON.parse(input);
    if ('cmd' in json) {
      JSON.parse(json.cmd);
      return 'quickSignRequest';
    }
    if ('code' in json) {
      return 'signingRequest';
    }
    if ('payload' in json) {
      return 'PactCommand';
    }
  } catch (e) {
    return 'invalid';
  }
  return 'invalid';
}

const signingRequestToPactCommand = (
  signingRequest: ISigningRequest,
): IPartialPactCommand => {
  return {
    payload: {
      exec: {
        code: signingRequest.code,
        data: signingRequest.data ?? {},
      },
    },
    meta: {
      chainId: signingRequest.chainId,
      gasLimit: signingRequest.gasLimit,
      gasPrice: signingRequest.gasPrice,
      ttl: signingRequest.ttl,
      sender: signingRequest.sender,
    },
    nonce: signingRequest.nonce,
  };
};

export function SignatureBuilder() {
  const [schema, setSchema] = useState<requestScheme>();
  const [input, setInput] = useState<string>('');
  const [pactCommand, setPactCommand] = useState<IPartialPactCommand>();
  const [unsignedTx, setUnsignedTx] = useState<IUnsignedCommand>();
  const [signed, setSignedTx] = useState<IUnsignedCommand>();
  const [capsWithoutSigners, setCapsWithoutSigners] = useState<
    ISigningRequest['caps']
  >([]);
  const { sign, profile, activeNetwork, networks, setActiveNetwork } =
    useWallet();
  const navigate = useNavigate();

  const exec =
    pactCommand && pactCommand.payload && 'exec' in pactCommand.payload
      ? pactCommand.payload.exec
      : { code: null, data: {} };

  const parsedCode = useMemo(
    () => (exec.code ? execCodeParser(exec.code) : undefined),
    [exec.code],
  );

  function processSig(inputData: string) {
    setInput(inputData);
    const schema = determineSchema(inputData);
    switch (schema) {
      case 'quickSignRequest': {
        const parsed: IUnsignedCommand = JSON.parse(inputData);
        setPactCommand(JSON.parse(parsed.cmd));
        setUnsignedTx(normalizeTx(parsed));
        setCapsWithoutSigners([]);
        break;
      }
      case 'PactCommand': {
        const parsed: IPartialPactCommand = JSON.parse(inputData);
        setPactCommand(parsed);
        const tx = createTransaction(parsed);
        setUnsignedTx(normalizeTx(tx));
        setCapsWithoutSigners([]);
        break;
      }
      case 'signingRequest': {
        const parsed: ISigningRequest = JSON.parse(inputData);
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

  return (
    <Stack flexDirection={'column'} gap={'md'}>
      <Heading variant="h5">Paste SigData, CommandSigData, or Payload</Heading>
      <textarea
        value={input}
        className={classNames(codeArea, panelClass)}
        onChange={(e) => {
          e.preventDefault();
          processSig(e.target.value);
        }}
      />
      <Box>{schema && <Text>{`Schema: ${schema}`}</Text>}</Box>
      <Box>
        <Box>
          {['PactCommand', 'quickSignRequest'].includes(schema!) && (
            <>
              <Button
                onPress={async () => {
                  if (!unsignedTx || !profile || !activeNetwork) return;
                  const command: IPactCommand = JSON.parse(unsignedTx.cmd);
                  let networkUUID = activeNetwork.uuid;
                  if (
                    command.networkId &&
                    activeNetwork.networkId !== command.networkId
                  ) {
                    const network = networks.filter(
                      ({ networkId }) => networkId === command.networkId,
                    );
                    if (network.length === 0) {
                      throw new Error('Network not found');
                    }
                    if (network.length > 1) {
                      throw new Error('Multiple networks found');
                    }
                    networkUUID = network[0].uuid;
                    // switch network
                    setActiveNetwork(network[0]);
                  }
                  const groupId = crypto.randomUUID();

                  // check if transaction already exists
                  const tx =
                    await transactionRepository.getTransactionByHashNetworkProfile(
                      profile.uuid,
                      networkUUID,
                      unsignedTx.hash,
                    );

                  if (tx) {
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
                }}
              >
                Review Transaction
              </Button>
            </>
          )}
          {schema === 'signingRequest' && (
            <Notification intent="info" role="status">
              SigningRequest is not supported yet, We are working on it.
            </Notification>
          )}
        </Box>
      </Box>
    </Stack>
  );
}
