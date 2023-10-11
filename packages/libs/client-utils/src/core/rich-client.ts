import type { ChainId } from '@kadena/client';

import type { IAccount } from './utils/helpers';
import type { WithEmitter } from './utils/with-emitter';
import { withEmitter } from './utils/with-emitter';
import { crossChain } from './cross-chain';
import { preflight } from './preflight';
import { dirtyRead } from './read-dirty';
import { submitAndListen } from './submit-and-listen';

import { pipe } from 'ramda';

export const submitClient = pipe(submitAndListen, withEmitter);
export const preflightClient = pipe(preflight, withEmitter);
export const dirtyReadClient = pipe(dirtyRead, withEmitter);
export const crossChainClient = pipe(
  crossChain,
  (cb) => (targetChainId: ChainId, targetChainGasPayer: IAccount) =>
    (
      withEmitter as unknown as WithEmitter<
        [{ event: 'poll-spv'; data: string }]
      >
    )((emit) => cb({ emit, targetChainGasPayer, targetChainId })),
);
