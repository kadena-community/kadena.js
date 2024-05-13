import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetTokenInfoInput {
  tokenId: string;
  chainId: ChainId;
}

const getTokenInfoCommand = ({ tokenId, chainId }: IGetTokenInfoInput) =>
  composePactCommand(
    execution(Pact.modules['marmalade-v2.ledger']['get-token-info'](tokenId)),
    setMeta({
      chainId,
    }),
  );

export const getTokenInfo = (
  inputs: IGetTokenInfoInput,
  config: IClientConfig,
) =>
  dirtyReadClient<
    PactReturnType<IPactModules['marmalade-v2.ledger']['get-token-info']>
  >(config)(getTokenInfoCommand(inputs));
