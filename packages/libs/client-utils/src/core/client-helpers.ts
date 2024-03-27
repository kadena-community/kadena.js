/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/naming-convention */
import type { ChainId } from '@kadena/client';

import { crossChain } from './cross-chain';
import { preflight } from './preflight';
import { dirtyRead } from './read-dirty';
import { submitAndListen } from './submit-and-listen';
import type { IAccount } from './utils/helpers';
import type { WithEmitter } from './utils/with-emitter';
import { withEmitter } from './utils/with-emitter';

import type { PactValue } from '@kadena/types';
import { queryAllChains } from './query-all-chains';

/**
 * @alpha
 */
export const submitClient = <T = PactValue>(
  ...args: Parameters<typeof submitAndListen<T>>
) => withEmitter(submitAndListen<T>(...args));

/**
 * @alpha
 */
export const preflightClient = <T = PactValue>(
  ...args: Parameters<typeof preflight<T>>
) => withEmitter(preflight<T>(...args));

/**
 * @alpha
 */
export const dirtyReadClient = <T = PactValue>(
  ...args: Parameters<typeof dirtyRead<T>>
) => withEmitter(dirtyRead<T>(...args));

/**
 * @alpha
 */
export const queryAllChainsClient = <T = PactValue>(
  ...args: Parameters<typeof queryAllChains<T>>
) =>
  (
    withEmitter as unknown as WithEmitter<
      [{ event: 'chain-result'; data: { result: T; chainId: ChainId } }]
    >
  )(queryAllChains<T>(...args));

/**
 * @alpha
 */
export const crossChainClient =
  <T = PactValue>(...args: Parameters<typeof crossChain<T>>) =>
  (targetChainId: ChainId, targetChainGasPayer: IAccount) =>
    (
      withEmitter as unknown as WithEmitter<
        [{ event: 'poll-spv'; data: string }]
      >
    )((emit) =>
      crossChain<T>(...args)({ emit, targetChainGasPayer, targetChainId }),
    );
