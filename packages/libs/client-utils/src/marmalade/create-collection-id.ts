import type {
  BuiltInPredicate,
  ChainId,
  IPactModules,
  PactReturnType,
} from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import { addKeyset, execution } from '@kadena/client/fp';
import type { NetworkId } from '@kadena/types';
import { pipe } from 'ramda';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ICreateCollectionIdInput {
  collectionName: string;
  operator: {
    keyset: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
  chainId: ChainId;
  networkId: NetworkId;
  host?: IClientConfig['host'];
}

export const createCollectionId = ({
  collectionName,
  operator,
  chainId,
  networkId,
  host,
}: ICreateCollectionIdInput) =>
  pipe(
    () =>
      Pact.modules['marmalade-v2.collection-policy-v1']['create-collection-id'](
        collectionName,
        readKeyset('operator-guard'),
      ),
    execution,
    addKeyset('operator-guard', operator.keyset.pred, ...operator.keyset.keys),
    dirtyReadClient<
      PactReturnType<
        IPactModules['marmalade-v2.collection-policy-v1']['create-collection-id']
      >
    >({
      host,
      defaults: {
        networkId,
        meta: { chainId },
      },
    }),
  )().execute();
