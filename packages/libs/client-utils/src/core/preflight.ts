import { createClient, createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';

import { asyncPipe } from './utils/asyncPipe';
import type { IClientConfig, IEmit } from './utils/helpers';
import { extractResult, safeSign, throwIfFails } from './utils/helpers';
import type { Any } from './utils/types';

export const preflight =
  (
    { host, defaults, sign }: IClientConfig,
    client = createClient(host as Any),
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
      extractResult,
    );
