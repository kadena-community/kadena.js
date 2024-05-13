import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetCollectionTokenInput {
  tokenId: string;
  chainId: ChainId;
}

const getCollectionTokenCommand = ({
  tokenId,
  chainId,
}: IGetCollectionTokenInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-v2.collection-policy-v1']['get-token'](tokenId),
    ),
    setMeta({
      chainId,
    }),
  );

export const getCollectionToken = (
  inputs: IGetCollectionTokenInput,
  config: IClientConfig,
) =>
  dirtyReadClient<
    PactReturnType<
      IPactModules['marmalade-v2.collection-policy-v1']['get-token']
    >
  >(config)(getCollectionTokenCommand(inputs));
