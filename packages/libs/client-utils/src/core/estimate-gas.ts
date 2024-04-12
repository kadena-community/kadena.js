import type { IPartialPactCommand } from '@kadena/client';
import { createTransaction } from '@kadena/client';

import { asyncPipe } from './utils/asyncPipe';
import type { IClientConfig } from './utils/helpers';
import { composeWithDefaults, getClient, throwIfFails } from './utils/helpers';

/**
 * estimate gas for a command
 * @alpha
 */
export const estimateGas = (
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
          gasLimit: 10000,
          gasPrice: 1.0e-8,
        } as IPartialPactCommand['meta'],
      }),
    createTransaction,
    (tx) => client.local(tx, { preflight: true, signatureVerification: false }),
    throwIfFails,
    (response) => ({ gasLimit: response.gas, gasPrice: 1.0e-8 }),
  );
  return pipeLine(command);
};
