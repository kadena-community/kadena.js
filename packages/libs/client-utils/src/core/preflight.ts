import { createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';

import type { PactValue } from '@kadena/types';
import { asyncPipe } from './utils/asyncPipe.js';
import type { IClientConfig, IEmit } from './utils/helpers.js';
import {
  extractResult,
  getClient,
  safeSign,
  throwIfFails,
} from './utils/helpers.js';

export const preflight =
  <T = PactValue>(
    { host, defaults, sign }: IClientConfig,
    client = getClient(host),
  ) =>
  (emit: IEmit) =>
    asyncPipe(
      composePactCommand(defaults ?? {}),
      createTransaction,
      safeSign(sign),
      emit('sign'),
      client.preflight,
      emit('preflight'),
      throwIfFails,
      extractResult<T>,
    );
