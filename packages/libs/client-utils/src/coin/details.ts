import type { ChainId, IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';

import { readClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

import { pipe } from 'ramda';

/**
 * @alpha
 */
export const details = (
  account: string,
  networkId?: string,
  chainId?: ChainId,
  host?: IClientConfig['host'],
  contract: string = 'coin',
) => {
  const getDetails = pipe(
    (name) => Pact.modules[contract as 'coin'].details(name),
    execution,
    readClient<PactReturnType<IPactModules['coin']['details']>>({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  );
  return getDetails(account).execute();
};
