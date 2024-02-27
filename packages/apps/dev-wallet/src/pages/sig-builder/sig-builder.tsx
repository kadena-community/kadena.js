import {
  IPartialPactCommand,
  ISigningRequest,
  IUnsignedCommand,
} from '@kadena/client';

import { Box, Heading, Text } from '@kadena/react-ui';
import { useState } from 'react';
import { codeArea } from './style.css';

type requestScheme =
  | 'invalid'
  | 'quickSingRequest'
  | 'signingRequest'
  | 'PactCommand';

function determineSchema(input: string): requestScheme {
  let json;
  try {
    // TODO: pase YAML as well
    json = JSON.parse(
      input.replace(/\\\\"/g, '<ACTUAL>').replace(/\\"/g, '"'),
    ).replace(/<ACTUAL>/g, '\\"');
    console.log('json', json);
    if ('cmd' in json) {
      JSON.parse(json.cmd);
      return 'quickSingRequest';
    }
    if ('code' in json) {
      return 'signingRequest';
    }
    if ('payload' in json) {
      return 'PactCommand';
    }
  } catch (e) {
    console.log(e, 'input', input);
    (window as any).__input = input;
    return 'invalid';
  }
  return 'invalid';
}

// const cmdToTxObject = (cmd: string): IUnsignedCommand => {
//   const hash = blakeHash(cmd);
//   const command: IPactCommand = JSON.parse(cmd);
//   return {
//     cmd,
//     hash,
//     sigs: Array.from(Array(command.signers?.length ?? 0)),
//   };
// };

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
  const [pactCommand, setPactCommand] = useState<IPartialPactCommand>();
  const [unsignedTx, setUnsignedTx] = useState<IUnsignedCommand>();
  const [capsWithoutSigners, setCapsWithoutSigners] = useState<
    ISigningRequest['caps']
  >([]);
  function processSig(sig: string) {
    const schema = determineSchema(sig);
    setSchema(schema);
    switch (schema) {
      case 'quickSingRequest': {
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
  }

  console.log('capsWithoutSigners', capsWithoutSigners);
  console.log('unsignedTx', unsignedTx);

  return (
    <main>
      <Heading variant="h5">Paste SigData, CommandSigData, or Payload</Heading>
      <textarea
        className={codeArea}
        onChange={(e) => {
          e.preventDefault();
          processSig(e.target.value);
        }}
      />
      <Box>
        {schema && <Text>{`Schema: ${schema}`}</Text>}
        {pactCommand && (
          <div>
            <Heading variant="h5">Pact Command</Heading>
            <pre>{JSON.stringify(pactCommand, null, 2)}</pre>
          </div>
        )}
      </Box>
    </main>
  );
}
