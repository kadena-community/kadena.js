import type { ChainId } from '@kadena/client';

import { crossChain } from './cross-chain';
import { preflight } from './preflight';
import { dirtyRead } from './read-dirty';
import { submitAndListen } from './submit-and-listen';
import type { IAccount } from './utils/helpers';
import type { WithEmitter } from './utils/with-emitter';
import { withEmitter } from './utils/with-emitter';

import { pipe } from 'ramda';

/**
 * @alpha
 */
export const submitClient = pipe(submitAndListen, withEmitter);

/**
 * @alpha
 */
export const preflightClient = pipe(preflight, withEmitter);

/**
 * @alpha
 */
export const dirtyReadClient = pipe(dirtyRead, withEmitter);

/**
 * @alpha
 */
export const crossChainClient = pipe(
  crossChain,
  (cb) => (targetChainId: ChainId, targetChainGasPayer: IAccount) =>
    (
      withEmitter as unknown as WithEmitter<
        [{ event: 'poll-spv'; data: string }]
      >
    )((emit) => cb({ emit, targetChainGasPayer, targetChainId })),
);
