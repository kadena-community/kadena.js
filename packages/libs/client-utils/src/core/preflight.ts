import { createTransaction } from '@kadena/client';

import type { PactValue } from '@kadena/types';
import { asyncPipe } from './utils/asyncPipe';
import type { IClientConfig, IEmit } from './utils/helpers';
import {
  composeWithDefaults,
  extractResult,
  getClient,
  safeSign,
  throwIfFails,
} from './utils/helpers';

export const preflight =
  <T = PactValue>(
    { host, defaults, sign }: IClientConfig,
    client = getClient(host),
  ) =>
  (emit: IEmit) =>
    asyncPipe(
      composeWithDefaults(defaults),
      createTransaction,
      safeSign(sign),
      emit('sign'),
      client.preflight,
      emit('preflight'),
      throwIfFails,
      extractResult<T>,
    );
