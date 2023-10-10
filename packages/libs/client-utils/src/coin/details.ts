import type { ChainId } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';

import type { IClientConfig } from '../core/utils/helpers';
import { dirtyReadClient } from '../core/rich-client';

import { pipe } from 'ramda';

export const details = (
  account: string,
  networkId: string,
  chainId: ChainId,
  host?: IClientConfig['host'],
) => {
  const getDetails = pipe(
    Pact.modules.coin.details,
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
