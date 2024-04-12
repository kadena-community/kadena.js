import type { ChainId, IUnsignedCommand } from '@kadena/client';
import { createClient, createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';
import { hash as hashFunction } from '@kadena/cryptography-utils';
import { dotenv } from '@utils/dotenv';
import { networkData } from '@utils/network';
import type { GasLimitEstimation } from '../../graph/types/graphql-types';

export class GasLimitEstimationError extends Error {
  originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message);
    this.originalError = originalError;
  }
}

interface GasLimitEstimationInput {
  cmd?: string;
  hash?: string;
  sigs?: string[];
  payload?: string;
  meta?: string;
  signers?: string[];
  chainId?: ChainId;
  code?: string;
}

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

type StringifiedCommandInput = BaseInput & {
  type: 'stringified-command';
  cmd: string;
  sigs?: string[];
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
  chainId?: ChainId;
  networkId?: string;
};

type PayloadInput = BaseInput & {
  type: 'payload';
  payload: any;
  chainId: ChainId;
  networkId?: string;
};

type CodeInput = BaseInput & {
  type: 'code';
  code: string;
  chainId: ChainId;
  networkId?: string;
};

type UserInput =
  | FullTransactionInput
  | StringifiedCommandInput
  | FullCommandInput
  | PartialCommandInput
  | PayloadInput
  | CodeInput;

function jsonParseInput(input: string): GasLimitEstimationInput {
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
      type: 'stringified-command',
      preflight: true,
      signatureVerification: false,
      ...input,
    } as StringifiedCommandInput;
  } else if ('payload' in input && 'meta' in input && 'signers' in input) {
    return {
      type: 'full-command',
      preflight: 'networkId' in input ? true : false,
      signatureVerification: false,
      ...input,
    } as FullCommandInput;
  } else if (
    'payload' in input &&
    ('meta' in input || ('signers' in input && 'chainId' in input))
  ) {
    return {
      type: 'partial-command',
      preflight: 'networkId' in input ? true : false,
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
  const paredInput = jsonParseInput(rawInput);
  const input = determineInputType(paredInput);

  const { networkId } = input.networkId ? input : networkData;

  const returnValue: GasLimitEstimation = {
    amount: 0,
    inputType: input.type,
    usedPreflight: input.preflight,
    usedSignatureVerification: input.signatureVerification,
    transaction: '',
  };

  let transaction: IUnsignedCommand;
  let configuration;

  switch (input.type) {
    case 'full-transaction':
      transaction = {
        cmd: input.cmd,
        hash: input.hash,
        sigs: input.sigs.map((s) => ({ sig: s })),
      };
      break;
    case 'stringified-command':
      transaction = {
        cmd: input.cmd,
        hash: hashFunction(input.cmd),
        sigs: input.sigs?.map((s) => ({ sig: s })) || [],
      };
      break;
    case 'full-command':
      transaction = createTransaction(
        composePactCommand(
          { payload: input.payload },
          { meta: input.meta },
          { signers: input.signers },
          { networkId },
        )({
          meta: {
            gasLimit: 10000,
            gasPrice: 1.0e-8,
          },
        }),
      );
      break;
    case 'partial-command':
      if (!input.meta && 'chainId' in input) {
        input.meta = { chainId: input.chainId };
      }

      transaction = createTransaction(
        composePactCommand(
          { payload: input.payload },
          { meta: input.meta },
          { signers: input.signers },
          { networkId },
        )({
          meta: {
            gasLimit: 10000,
            gasPrice: 1.0e-8,
          },
        }),
      );
      break;
    case 'payload':
      transaction = createTransaction(
        composePactCommand(
          { payload: input.payload },
          { meta: { chainId: input.chainId } },
        )({
          meta: {
            gasLimit: 10000,
            gasPrice: 1.0e-8,
          },
        }),
      );
      break;
    case 'code':
      transaction = createTransaction(
        composePactCommand(
          {
            payload: {
              exec: {
                code: input.code,
                data: {},
              },
            },
          },
          { meta: { chainId: input.chainId } },
        )({
          meta: {
            gasLimit: 10000,
            gasPrice: 1.0e-8,
          },
        }),
      );
      break;
    default:
      throw new GasLimitEstimationError(
        'Something went wrong generating the transaction.',
      );
  }

  configuration = {
    preflight: input.preflight,
    signatureVerification: input.signatureVerification,
  };

  try {
    const result = await createClient(
      ({ chainId }) =>
        `${dotenv.NETWORK_HOST}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
    ).local(transaction, configuration);

    if (result.result.status === 'failure') {
      throw result.result.error;
    }

    returnValue.amount = result.gas;
    returnValue.transaction = JSON.stringify(transaction);

    return returnValue;
  } catch (error) {
    throw new GasLimitEstimationError(
      `Chainweb Node was unable to estimate the gas limit ${
        error.type === 'TxFailure'
          ? 'due to the transaction failing'
          : 'for an unknown reason'
      }. Please check your input and try again.`,
      error,
    );
  }
};
