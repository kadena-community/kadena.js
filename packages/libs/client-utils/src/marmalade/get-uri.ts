import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetUriInput {
  tokenId: string;
  chainId: ChainId;
}

const getUriCommand = ({ tokenId, chainId }: IGetUriInput) =>
  composePactCommand(
    execution(Pact.modules['marmalade-v2.ledger']['get-uri'](tokenId)),
    setMeta({
      chainId,
    }),
  );

export const getUri = (inputs: IGetUriInput, config: IClientConfig) =>
  dirtyReadClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['get-uri']>
  >(config)(getUriCommand(inputs));
