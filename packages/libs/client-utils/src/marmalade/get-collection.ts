import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { execution } from '@kadena/client/fp';
import type { ChainId, NetworkId } from '@kadena/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetCollectionInput {
  collectionId: string;
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const getCollection = ({
  collectionId,
  chainId,
  networkId,
  host,
}: IGetCollectionInput) =>
  pipe(
    () =>
      Pact.modules['marmalade-v2.collection-policy-v1']['get-collection'](
        collectionId,
      ),
    execution,
    dirtyReadClient<
      PactReturnType<
        IPactModules['marmalade-v2.collection-policy-v1']['get-collection']
      >
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
