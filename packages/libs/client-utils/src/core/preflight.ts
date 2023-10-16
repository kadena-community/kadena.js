import { createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';

import { asyncPipe } from './utils/asyncPipe';
import type { IClientConfig, IEmit } from './utils/helpers';
import {
  extractResult,
  getClient,
  safeSign,
  throwIfFails,
} from './utils/helpers';

export const preflight =
  ({ host, defaults, sign }: IClientConfig, client = getClient(host)) =>
  (emit: IEmit) =>
    asyncPipe(
      composePactCommand(defaults ?? {}),
      createTransaction,
      safeSign(sign),
      emit('sign'),
      client.preflight,
      emit('preflight'),
      throwIfFails,
      extractResult,
    );
