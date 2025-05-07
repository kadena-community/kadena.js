import type { IPartialPactCommand } from '@kadena/client';
import { createTransaction } from '@kadena/client';

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
 * estimate gas for a command;
 * this function always returns a gasPrice of 1.0e-8, if you want to estimate the gas price use `estimateGasPrice` which is more accurate
 * @alpha
 * @deprecated for gasLimit use `calculateGasConsumption` and for gasPrice use `estimateGasPrice`
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
  return {
    gasLimit,
    gasPrice: 1.0e-8,
  };
};
