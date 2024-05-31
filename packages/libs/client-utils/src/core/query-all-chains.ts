import type { ChainId, IPartialPactCommand } from '@kadena/client';
import { createTransaction } from '@kadena/client';
import { composePactCommand, setMeta } from '@kadena/client/fp';

import type { PactValue } from '@kadena/types';
import { asyncPipe } from './utils/asyncPipe';
import type { IClientConfig, IEmit } from './utils/helpers';
import { composeWithDefaults, extractResult, getClient } from './utils/helpers';

const chainIds = [...Array(20).keys()].map((key) => `${key}` as ChainId);

export const query =
  <T = PactValue>(
    { host, defaults }: Omit<IClientConfig, 'sign'>,
    client = getClient(host),
  ) =>
  (emit: IEmit) =>
    asyncPipe(
      composeWithDefaults(defaults),
      createTransaction,
      client.dirtyRead,
      extractResult<T>,
      (result) => ({ result, chainId: defaults?.meta?.chainId }),
      emit('chain-result'),
    );

export const queryAllChains =
  <T = PactValue>(
    { host, defaults }: Omit<IClientConfig, 'sign'>,
    client = getClient(host),
  ) =>
  (emit: IEmit) =>
    asyncPipe(
      composeWithDefaults(defaults),
      (command: IPartialPactCommand) => {
        return Promise.all(
          chainIds.map((chainId) => {
            const chainCommand = composePactCommand(
              command,
              setMeta({ chainId }),
            );
            return query<T>(
              { host, defaults: { meta: { chainId } } },
              client,
            )(emit)(chainCommand);
          }),
        );
      },
      emit('query-result'),
    );
