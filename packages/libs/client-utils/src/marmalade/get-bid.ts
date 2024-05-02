import type { IPactModules, PactReturnType } from '@kadena/client';
import { Pact } from '@kadena/client';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import type { ChainId } from '@kadena/types';
import { dirtyReadClient } from '../core/client-helpers';
import type { IClientConfig } from '../core/utils/helpers';

interface IGetBidInput {
  bidId: string;
  chainId: ChainId;
  guard: {
    account: string;
  };
}

const getBidCommand = ({ bidId, chainId, guard }: IGetBidInput) =>
  composePactCommand(
    execution(
      Pact.modules['marmalade-sale.conventional-auction']['retrieve-bid'](
        bidId,
      ),
    ),
    setMeta({
      senderAccount: guard.account,
      chainId,
    }),
  );

export const getBid = (inputs: IGetBidInput, config: IClientConfig) =>
  dirtyReadClient<
    PactReturnType<
      IPactModules['marmalade-sale.conventional-auction']['retrieve-bid']
    >
  >(config)(getBidCommand(inputs));
