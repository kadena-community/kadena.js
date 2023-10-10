import { createClient, createTransaction } from '@kadena/client';
import { asyncPipe, composePactCommand } from '@kadena/client/fp';

import { safeSign } from '../../example-contract/util/fp-helpers';
import type { Any } from '../types';

import type { IClientConfig, IEmit } from './helpers';
import { throwIfFails } from './helpers';

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
    );
