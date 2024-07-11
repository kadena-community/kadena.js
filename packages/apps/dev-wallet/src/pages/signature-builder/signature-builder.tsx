import {
  ICommand,
  IPartialPactCommand,
  ISigningRequest,
  IUnsignedCommand,
  createTransaction,
} from '@kadena/client';

import { PactCodeView } from '@/Components/PactCodeView/PactCodeView';
import { Wizard } from '@/Components/Wizard/Wizard';
import { useNetwork } from '@/modules/network/network.hook';
import * as transactionService from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { Box, Button, Card, Heading, Text } from '@kadena/kode-ui';
import { execCodeParser } from '@kadena/pactjs-generator';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { sign, profile } = useWallet();
  const { activeNetwork } = useNetwork();
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

  async function signTransaction() {
    if (unsignedTx) {
      const normalizedTx = { ...unsignedTx, sigs: normalizeSigs(unsignedTx) };
      const tx = (await sign(normalizedTx)) as ICommand;
      setSignedTx(tx);
    }
  }

  return (
    <>
      <Wizard>
        <Wizard.Render>
          {({ step, goTo }) => (
            <Box>
              <Button
                variant="transparent"
                isDisabled={step < 0}
                onPress={() => goTo(0)}
              >{`Paste Data`}</Button>
              {schema === 'signingRequest' && (
                <Button
                  variant="transparent"
                  isDisabled={step < 1}
                  onPress={() => goTo(1)}
                >{`Add Signers`}</Button>
              )}
              <Button
                variant="transparent"
                isDisabled={step < 2}
                onPress={() => goTo(2)}
              >{`Review Transaction`}</Button>
              <Button
                variant="transparent"
                isDisabled={step < 3}
                onPress={() => goTo(3)}
              >{`Sign Transaction`}</Button>
            </Box>
          )}
        </Wizard.Render>
        <Wizard.Step>
          {({ goTo }) => (
            <>
              <Heading variant="h5">
                Paste SigData, CommandSigData, or Payload
              </Heading>
              <textarea
                value={input}
                className={codeArea}
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
                          const groupId = crypto.randomUUID();
                          await transactionService.addTransaction(
                            unsignedTx,
                            profile.uuid,
                            activeNetwork.networkId,
                            groupId,
                          );
                          navigate(`/transaction/${groupId}`);
                        }}
                      >
                        Review Transaction
                      </Button>
                    </>
                  )}
                  {schema === 'signingRequest' && (
                    <Button onPress={() => goTo(1)}>Add Signers</Button>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Wizard.Step>
        <Wizard.Step>
          {({ back, next }) => (
            <>
              <Heading variant="h5">Edit Transaction</Heading>
              <pre>{JSON.stringify(pactCommand, null, 2)}</pre>
              {capsWithoutSigners && (
                <pre>{JSON.stringify(capsWithoutSigners, null, 2)}</pre>
              )}
              <Button onPress={() => back()} variant="transparent">
                Back to Input
              </Button>
              <Button onPress={() => next()}>Review Transaction</Button>
            </>
          )}
        </Wizard.Step>
        <Wizard.Step>
          {({ back, next, goTo }) => (
            <>
              <Heading variant="h5">Review Transaction</Heading>
              <Box>
                <Text bold>Hash: </Text>
                <Text>{unsignedTx?.hash}</Text>
              </Box>
              <Heading variant="h6">Code</Heading>
              {parsedCode &&
                parsedCode.map((pc) => (
                  <Card>
                    <PactCodeView parsedCode={pc} />
                  </Card>
                ))}

              <Heading variant="h6">Data</Heading>
              <pre>{JSON.stringify(exec.data, null, 2)}</pre>
              <Text bold>Transaction Metadata & Information</Text>
              <Box>
                Network :<Text>{pactCommand?.networkId}</Text>
              </Box>
              <Box>
                Chain :<Text>{pactCommand?.meta?.chainId}</Text>
              </Box>
              <Box>
                Gas Payer:
                <Text>{pactCommand?.meta?.sender}</Text>
              </Box>
              <Box>
                Gas Limit: <Text>{pactCommand?.meta?.gasLimit}</Text>
              </Box>
              <Box>
                Gas Price: <Text>{pactCommand?.meta?.gasPrice}</Text>
              </Box>
              <Box>
                Max Gas Cost:{' '}
                <Text>
                  {Number(pactCommand?.meta?.gasPrice) *
                    Number(pactCommand?.meta?.gasLimit)}
                </Text>
              </Box>
              <Box>
                Creation Time <Text>{pactCommand?.meta?.creationTime}</Text>
              </Box>
              <Box>
                TTL : <Text>{pactCommand?.meta?.ttl}</Text>
              </Box>
              <Box>
                Nonce : <Text>{pactCommand?.nonce}</Text>
              </Box>
              <Box>
                Tx Type :
                <Text>
                  {'cont' in (pactCommand?.payload ?? {}) ? 'Cont' : 'Exec'}
                </Text>
              </Box>

              <Heading variant="h6">Transaction</Heading>
              <Card>
                <pre>{JSON.stringify(unsignedTx, null, 2)}</pre>
              </Card>
              {schema !== 'quickSignRequest' ? (
                <Button onPress={() => back()} variant="transparent">
                  Back to Edit Transaction
                </Button>
              ) : (
                <Button onPress={() => goTo(0)} variant="transparent">
                  Back to Input
                </Button>
              )}
              <Button
                onPress={async () => {
                  await signTransaction();
                  next();
                }}
              >
                Sign Transaction
              </Button>
            </>
          )}
        </Wizard.Step>
        <Wizard.Step>
          {({ back }) => (
            <>
              <Heading variant="h5">Signed Transaction</Heading>
              <Card>
                <pre style={{ whiteSpace: 'break-spaces' }}>
                  {JSON.stringify(signed, null, 2)}
                </pre>
              </Card>
              <Button onPress={() => back()} variant="transparent">
                Back to Review Transaction
              </Button>
            </>
          )}
        </Wizard.Step>
      </Wizard>
    </>
  );
}
