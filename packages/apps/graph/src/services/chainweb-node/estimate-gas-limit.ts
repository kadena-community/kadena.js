import { local } from '@kadena/chainweb-node-client';
import { ChainId, createClient, createTransaction } from '@kadena/client';
import { composePactCommand, execution } from '@kadena/client/fp';
import { hash as hashFunction } from '@kadena/cryptography-utils';
import { dotenv } from '@utils/dotenv';
import { GasLimitEstimation } from '../../graph/types/graphql-types';

export class GasLimitEstimationError extends Error {}

type GasLimitEstimationInput = {
  cmd?: string;
  hash?: string;
  sigs?: string[];
  payload?: string;
  meta?: string;
  signers?: string[];
  chainId?: ChainId;
  code?: string;
};

interface BaseInput {
  preflight: boolean;
  signatureVerification: boolean;
}

type FullTransactionInput = BaseInput & {
  type: 'full-transaction';
  cmd: string;
  hash: string;
  sigs: string[];
  networkId?: string;
};

type ParsedCommandInput = BaseInput & {
  type: 'parsed-command';
  cmd: string;
  networkId?: string;
};

type FullCommandInput = BaseInput & {
  type: 'full-command';
  payload: any;
  meta: any;
  signers: any[];
  networkId?: string;
};

type PartialCommandInput = BaseInput & {
  type: 'partial-command';
  payload: any;
  meta?: any;
  signers?: any[];
  networkId?: string;
};

type PayloadInput = BaseInput & {
  type: 'payload';
  payload: any;
  chainId: ChainId;
};

type CodeInput = BaseInput & {
  type: 'code';
  code: string;
  chainId: ChainId;
};

type UserInput =
  | FullTransactionInput
  | ParsedCommandInput
  | FullCommandInput
  | PartialCommandInput
  | PayloadInput
  | CodeInput;

function inputParser(input: string): GasLimitEstimationInput {
  try {
    return JSON.parse(input);
  } catch (e) {
    throw new GasLimitEstimationError(
      'Unable to parse input as JSON. Please see the README for the accepted input format.',
    );
  }
}

function determineInputType(input: GasLimitEstimationInput): UserInput {
  if ('cmd' in input && 'hash' in input && 'sigs' in input) {
    return {
      type: 'full-transaction',
      preflight: true,
      signatureVerification: true,
      ...input,
    } as FullTransactionInput;
  } else if ('cmd' in input) {
    return {
      type: 'parsed-command',
      preflight: true,
      signatureVerification: false,
      ...input,
    } as ParsedCommandInput;
  } else if ('payload' in input && 'meta' in input && 'signers' in input) {
    return {
      type: 'full-command',
      preflight: 'networkId' in input ? true : false, // Investigate the combination with networkId for preflight=true
      signatureVerification: false,
      ...input,
    } as FullCommandInput;
  } else if ('payload' in input && ('meta' in input || 'signers' in input)) {
    return {
      type: 'partial-command',
      preflight: 'networkId' in input ? true : false, // Investigate the combination with networkId for preflight=true
      signatureVerification: false,
      ...input,
    } as PartialCommandInput;
  } else if ('payload' in input && 'chainId' in input) {
    return {
      type: 'payload',
      preflight: false,
      signatureVerification: false,
      ...input,
    } as PayloadInput;
  } else if ('code' in input && 'chainId' in input) {
    return {
      type: 'code',
      preflight: false,
      signatureVerification: false,
      ...input,
    } as CodeInput;
  }

  throw new GasLimitEstimationError(
    'Unknown input type. Please see the README for the accepted input format.',
  );
}

export const estimateGasLimit = async (
  rawInput: string,
): Promise<GasLimitEstimation> => {
  const paredInput = inputParser(rawInput);
  const input = determineInputType(paredInput);

  const returnValue: GasLimitEstimation = {
    amount: 0,
    inputType: input.type,
    usedPreflight: input.preflight,
    usedSignatureVerification: input.signatureVerification,
    transaction: '',
  };

  if (input.type === 'full-transaction') {
    const transaction = {
      cmd: input.cmd,
      hash: input.hash,
      sigs: input.sigs.map((s) => ({ sig: s })),
    };

    const configuration = {
      preflight: input.preflight,
      signatureVerification: input.signatureVerification,
    };

    const result = await createClient(
      ({ chainId }) =>
        `${dotenv.NETWORK_HOST}/chainweb/0.0/${
          input.networkId || dotenv.NETWORK_ID
        }/chain/${chainId}/pact`,
    ).local(transaction, configuration);

    returnValue.amount = result.gas;
    returnValue.transaction = JSON.stringify(input);
  } else if (input.type === 'parsed-command') {
    const transaction = {
      cmd: input.cmd,
      hash: hashFunction(input.cmd),
      sigs: [],
    };

    const configuration = {
      preflight: input.preflight,
      signatureVerification: input.signatureVerification,
    };

    const result = await createClient(
      ({ chainId }) =>
        `${dotenv.NETWORK_HOST}/chainweb/0.0/${
          input.networkId || dotenv.NETWORK_ID
        }/chain/${chainId}/pact`,
    ).local(transaction, configuration);

    returnValue.amount = result.gas;
    returnValue.transaction = JSON.stringify(input);
  } else if (input.type === 'full-command') {
    const transaction = createTransaction(
      composePactCommand(
        { payload: input.payload },
        { meta: input.meta },
        { signers: input.signers },
        { networkId: input.networkId || dotenv.NETWORK_ID },
      )(),
    );

    const configuration = {
      preflight: input.preflight,
      signatureVerification: input.signatureVerification,
    };

    const result = await createClient(
      ({ chainId }) =>
        `${dotenv.NETWORK_HOST}/chainweb/0.0/${
          input.networkId || dotenv.NETWORK_ID
        }/chain/${chainId}/pact`,
    ).local(transaction, configuration);

    returnValue.amount = result.gas;
    returnValue.transaction = JSON.stringify(transaction);
  } else if (input.type === 'partial-command') {
    const transaction = createTransaction(
      composePactCommand(
        { payload: input.payload },
        { meta: input.meta },
        { signers: input.signers },
        { networkId: input.networkId || dotenv.NETWORK_ID },
      )(),
    );

    const configuration = {
      preflight: input.preflight,
      signatureVerification: input.signatureVerification,
    };

    const result = await createClient(
      ({ chainId }) =>
        `${dotenv.NETWORK_HOST}/chainweb/0.0/${
          input.networkId || dotenv.NETWORK_ID
        }/chain/${chainId}/pact`,
    ).local(transaction, configuration);

    returnValue.amount = result.gas;
    returnValue.transaction = JSON.stringify(transaction);
  } else if (input.type === 'payload') {
    const transaction = createTransaction(
      composePactCommand(
        { payload: input.payload },
        { meta: { chainId: input.chainId } },
      )(),
    );

    const configuration = {
      preflight: input.preflight,
      signatureVerification: input.signatureVerification,
    };

    const result = await createClient(
      ({ chainId }) =>
        `${dotenv.NETWORK_HOST}/chainweb/0.0/${dotenv.NETWORK_ID}/chain/${chainId}/pact`,
    ).local(transaction, configuration);

    returnValue.amount = result.gas;
    returnValue.transaction = JSON.stringify(transaction);
  } else if (input.type === 'code') {
    const transaction = createTransaction(
      composePactCommand(execution(input.code), {
        meta: { chainId: input.chainId },
      })(),
    );

    const hostUrl = `${dotenv.NETWORK_HOST}/chainweb/0.0/${dotenv.NETWORK_ID}/chain/${input.chainId}/pact`;

    const configuration = {
      preflight: input.preflight,
      signatureVerification: input.signatureVerification,
    };

    const result = await local(transaction, hostUrl, configuration);

    returnValue.amount = result.gas;
    returnValue.transaction = JSON.stringify(transaction);
  }

  return returnValue;
};
