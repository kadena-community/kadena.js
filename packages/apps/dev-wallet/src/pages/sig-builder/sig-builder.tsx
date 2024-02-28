import {
  IPartialPactCommand,
  ISigningRequest,
  IUnsignedCommand,
} from '@kadena/client';

import { Wizard } from '@/Components/Wizard/Wizard';
import { Box, Button, Heading, Text } from '@kadena/react-ui';
import { useState } from 'react';
import { codeArea } from './style.css';

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

export function SigBuilder() {
  const [schema, setSchema] = useState<requestScheme>();
  const [input, setInput] = useState<string>('');
  const [pactCommand, setPactCommand] = useState<IPartialPactCommand>();
  const [unsignedTx, setUnsignedTx] = useState<IUnsignedCommand>();
  const [capsWithoutSigners, setCapsWithoutSigners] = useState<
    ISigningRequest['caps']
  >([]);

  function processSig(sig: string) {
    setInput(sig);
    const schema = determineSchema(sig);
    switch (schema) {
      case 'quickSignRequest': {
        const parsed: IUnsignedCommand = JSON.parse(sig);
        setPactCommand(JSON.parse(parsed.cmd));
        setUnsignedTx(parsed);
        setCapsWithoutSigners([]);
        break;
      }
      case 'signingRequest': {
        const parsed: ISigningRequest = JSON.parse(sig);
        const pactCommand = signingRequestToPactCommand(parsed);
        setPactCommand(pactCommand);
        setCapsWithoutSigners(parsed.caps);
        setUnsignedTx(undefined);
        break;
      }
      case 'PactCommand': {
        const parsed: IPartialPactCommand = JSON.parse(sig);
        setPactCommand(parsed);
        setUnsignedTx(undefined);
        setCapsWithoutSigners([]);
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
    <main>
      <Wizard>
        <Wizard.Render>
          {({ step, goTo }) => (
            <Box>
              <Button
                variant="text"
                isDisabled={step < 0}
                onPress={() => goTo(0)}
              >{`Paste Data`}</Button>
              {schema !== 'quickSignRequest' && (
                <Button
                  variant="text"
                  isDisabled={step < 1}
                  onPress={() => goTo(1)}
                >{`Edit Transaction`}</Button>
              )}
              <Button
                variant="text"
                isDisabled={step < 2}
                onPress={() => goTo(2)}
              >{`Review Transaction`}</Button>
              <Button
                variant="text"
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
                  {schema === 'quickSignRequest' && (
                    <>
                      <Button onPress={() => goTo(2)}>
                        Review Transaction
                      </Button>
                    </>
                  )}
                  {(schema === 'PactCommand' ||
                    schema === 'signingRequest') && (
                    <Button onPress={() => goTo(1)}>Edit Transaction</Button>
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
              <Button onPress={() => back()} variant="text">
                Back to Input
              </Button>
              <Button onPress={() => next()}>Review Transaction</Button>
            </>
          )}
        </Wizard.Step>
        <Wizard.Step>
          {({ back, goTo }) => (
            <>
              <Heading variant="h5">Review Transaction</Heading>
              <Heading variant="h6">Transaction</Heading>
              <pre>{JSON.stringify(unsignedTx, null, 2)}</pre>
              <Heading variant="h6">Pact Command</Heading>
              <pre>{JSON.stringify(pactCommand, null, 2)}</pre>
              {schema !== 'quickSignRequest' ? (
                <Button onPress={() => back()} variant="text">
                  Back to Edit Transaction
                </Button>
              ) : (
                <Button onPress={() => goTo(0)} variant="text">
                  Back to Input
                </Button>
              )}

              <Button>Sign Transaction</Button>
            </>
          )}
        </Wizard.Step>
      </Wizard>
    </main>
  );
}
