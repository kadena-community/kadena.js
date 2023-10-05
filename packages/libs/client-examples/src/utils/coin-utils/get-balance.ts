/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @rushstack/typedef-var */

import type { ChainId } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';

import type { IClientConfig } from '../rich-client';
import { dirtyRead } from '../rich-client';

import { pipe } from 'ramda';

export const getBalance = (
  account: string,
  networkId: string,
  chainId: ChainId,
  host?: IClientConfig['host'],
) => {
  const balance = pipe(
    Pact.modules.coin['get-balance'],
    execution,
    dirtyRead({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  );
  return balance(account).execute();
};
