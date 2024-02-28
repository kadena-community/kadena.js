import type { IPartialPactCommand } from '@kadena/client';
import { createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';

import { asyncPipe } from './utils/asyncPipe.js';
import type { IClientConfig } from './utils/helpers.js';
import { getClient, throwIfFails } from './utils/helpers.js';

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
    composePactCommand({
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
