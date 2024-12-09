import type { IPactModules, PactReturnType } from '@kadena/client';
import { execution } from '@kadena/client/fp';

import { queryAllChainsClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

import { pipe } from 'ramda';

/**
 * @alpha
 */
export interface IDiscoveredAccount {
  details: {
    account: string;
    balance: number | { decimal: string };
    guard: any;
  };
  principal: string;
}

/**
 * @alpha
 */
export const discoverAccount = (
  account: string,
  networkId: string,
  host?: IClientConfig['host'],
  contract: string = 'coin',
) => {
  const command = (address: string) =>
    `(let ((details (${contract}.details "${address}")))(let ((principal (create-principal (at "guard" details)))){"details":details, "principal":principal}))`;

  const queryDetails = pipe(
    command,
    execution,
    queryAllChainsClient<IDiscoveredAccount>({
      host,
      defaults: {
        networkId,
      },
    }),
  );

  return queryDetails(account);
};
