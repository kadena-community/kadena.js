import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetCollectionInput {
  collectionId: string;
  chainId: ChainId;
}

const getCollectionCommand = ({ collectionId, chainId }: IGetCollectionInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-v2.collection-policy-v1']['get-collection'](
        collectionId,
      ),
    ),
    setMeta({
      chainId,
    }),
  );

export const getCollection = (
  inputs: IGetCollectionInput,
  config: IClientConfig,
) =>
  dirtyReadClient<
    PactReturnType<
      IPactModules['marmalade-v2.collection-policy-v1']['get-collection']
    >
  >(config)(getCollectionCommand(inputs));
