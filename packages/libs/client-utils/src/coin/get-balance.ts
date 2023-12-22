import type { ChainId, IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';

import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

import { pipe } from 'ramda';

/**
 * @alpha
 */
export const getBalance = async (
  account: string,
  networkId: string,
  chainId: ChainId,
  host?: IClientConfig['host'],
  contract: string = 'coin',
) => {
  const result = await pipe(
    (name) => Pact.modules[contract as 'coin']['get-balance'](name),
    execution,
    dirtyReadClient<PactReturnType<IPactModules['coin']['get-balance']>>({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )(account).execute();

  if (typeof result === 'object') {
    return result.decimal;
  }

  if (result !== undefined) {
    return (result as unknown as number).toString();
  }

  return result;
};
