import type {
  BuiltInPredicate,
  ChainId,
  IPactModules,
  PactReturnType,
} from '@kadena/client';
import { Pact, readKeyset } from '@kadena/client';
import {
  addKeyset,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface ICreateCollectionIdInput {
  collectionName: string;
  chainId: ChainId;
  operator: {
    keyset: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
}

const createCollectionIdCommand = ({
  collectionName,
  operator,
  chainId,
}: ICreateCollectionIdInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-v2.collection-policy-v1']['create-collection-id'](
        collectionName,
        readKeyset('operator-guard'),
      ),
    ),
    addKeyset('operator-guard', operator.keyset.pred, ...operator.keyset.keys),
    setMeta({ chainId }),
  );

export const createCollectionId = (
  inputs: ICreateCollectionIdInput,
  config: Omit<IClientConfig, 'sign'>,
) =>
  dirtyReadClient<
    PactReturnType<
      IPactModules['marmalade-v2.collection-policy-v1']['create-collection-id']
    >
  >(config)(createCollectionIdCommand(inputs));
