import type { ChainId } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';

import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

import { pipe } from 'ramda';

/**
 * @alpha
 */
export const details = (
  account: string,
  networkId: string,
  chainId: ChainId,
  host?: IClientConfig['host'],
) => {
  const getDetails = pipe(
    (name) => Pact.modules.coin.details(name),
    execution,
    dirtyReadClient({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  );
  return getDetails(account).execute();
};
