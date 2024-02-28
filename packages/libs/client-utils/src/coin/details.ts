import type { ChainId, IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';

import { dirtyReadClient } from '../core/client-helpers.js';
import type { IClientConfig } from '../core/utils/helpers.js';

import { pipe } from 'ramda';

/**
 * @alpha
 */
export const details = (
  account: string,
  networkId: string,
  chainId: ChainId,
  host?: IClientConfig['host'],
  contract: string = 'coin',
) => {
  const getDetails = pipe(
    (name) => Pact.modules[contract as 'coin'].details(name),
    execution,
    dirtyReadClient<PactReturnType<IPactModules['coin']['details']>>({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  );
  return getDetails(account).execute();
};
