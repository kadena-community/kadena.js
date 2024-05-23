import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';
import type { ChainId, NetworkId } from '@kadena/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetUriInput {
  tokenId: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const getUri = ({ tokenId, chainId, networkId, host }: IGetUriInput) =>
  pipe(
    () => Pact.modules['marmalade-v2.ledger']['get-uri'](tokenId),
    execution,
    dirtyReadClient<
      PactReturnType<IPactModules['marmalade-v2.ledger']['get-uri']>
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
