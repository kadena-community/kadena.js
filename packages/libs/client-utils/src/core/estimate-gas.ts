import type { IPactCommand } from '@kadena/client';
import { createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';

import { asyncPipe } from './utils/asyncPipe';
import type { IClientConfig } from './utils/helpers';
import { getClient, throwIfFails } from './utils/helpers';

/**
 * estimate gas for a command
 * @alpha
 */
export const estimateGas = (
  command:
    | Partial<IPactCommand>
    | ((
        cmd?: Partial<IPactCommand> | (() => Partial<IPactCommand>),
      ) => Partial<IPactCommand>),
  host?: IClientConfig['host'],
  client = getClient(host),
) => {
  const pipeLine = asyncPipe(
    composePactCommand({
      meta: {
        gasLimit: 10000,
        gasPrice: 1.0e-8,
      } as IPactCommand['meta'],
    }),
    createTransaction,
    (tx) => client.local(tx, { preflight: true, signatureVerification: false }),
    throwIfFails,
    (response) => ({ gasLimit: response.gas, gasPrice: 1.0e-8 }),
  );
  return pipeLine(command);
};
