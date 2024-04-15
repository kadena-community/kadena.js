import { createTransaction } from '@kadena/client';

import type { PactValue } from '@kadena/types';
import { asyncPipe } from './utils/asyncPipe';
import type { IClientConfig, IEmit } from './utils/helpers';
import {
  composeWithDefaults,
  extractResult,
  getClient,
  throwIfFails,
} from './utils/helpers';

export const dirtyRead =
  <T = PactValue>(
    { host, defaults }: Omit<IClientConfig, 'sign'>,
    client = getClient(host),
  ) =>
  (emit: IEmit) =>
    asyncPipe(
      composeWithDefaults(defaults),
      createTransaction,
      client.dirtyRead,
      emit('dirtyRead'),
      throwIfFails,
      extractResult<T>,
    );
