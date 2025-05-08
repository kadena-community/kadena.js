import type { IPartialPactCommand } from '@kadena/client';
import { createTransaction } from '@kadena/client';

import { estimateGasPrice } from './estimateGasPrice';
import { asyncPipe } from './utils/asyncPipe';
import type { IClientConfig } from './utils/helpers';
import { composeWithDefaults, getClient, throwIfFails } from './utils/helpers';

/**
 * estimate gas for a command
 * @alpha
 */
export const calculateGasConsumption = (
  command:
    | IPartialPactCommand
    | ((
        cmd?: IPartialPactCommand | (() => IPartialPactCommand),
      ) => IPartialPactCommand),
  host?: IClientConfig['host'],
  client = getClient(host),
) => {
  const pipeLine = asyncPipe(
    (cmd) =>
      composeWithDefaults(cmd)({
        meta: {
          gasLimit: 140000,
          gasPrice: 1.0e-8,
        } as IPartialPactCommand['meta'],
      }),
    createTransaction,
    (tx) => client.local(tx, { preflight: true, signatureVerification: false }),
    throwIfFails,
    (response) => response.gas,
  );
  return pipeLine(command);
};

/**
 * estimate gasLimit and gasPrice for a command;
 * This function might be slow since it needs to estimate the gasPrice on each call, use it with caution
 * @alpha
 * @see {@link estimateGasPrice}
 * @see {@link calculateGasConsumption}
 */
export const estimateGas = async (
  command:
    | IPartialPactCommand
    | ((
        cmd?: IPartialPactCommand | (() => IPartialPactCommand),
      ) => IPartialPactCommand),
  host?: IClientConfig['host'],
  client = getClient(host),
) => {
  const gasLimit = await calculateGasConsumption(command, host, client);
  const cmd = typeof command === 'function' ? command() : command;
  if (!cmd.meta?.chainId) {
    throw new Error('chainId is required in meta');
  }
  return {
    gasLimit,
    gasPrice: await estimateGasPrice({
      host: typeof host === 'string' ? host : undefined,
      networkId: cmd.networkId,
      chainId: cmd.meta.chainId,
      // fallback to minimum gas price if estimation fails
    }).catch(() => 1e-8),
  };
};
