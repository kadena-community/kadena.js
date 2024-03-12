import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';

import { queryAllChainsClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

import { pipe } from 'ramda';

/**
 * @alpha
 */
export const discoverAccount = (
  account: string,
  networkId: string,
  host?: IClientConfig['host'],
  contract: string = 'coin',
) => {
  const queryDetails = pipe(
    (name) => Pact.modules[contract as 'coin'].details(name),
    execution,
    queryAllChainsClient<PactReturnType<IPactModules['coin']['details']>>({
      host,
      defaults: {
        networkId,
      },
    }),
  );
  return queryDetails(account);
};
