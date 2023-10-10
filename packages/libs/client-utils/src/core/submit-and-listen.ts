import { createClient, createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';

import type { IClientConfig, IEmit } from './utils/helpers';
import { checkSuccess, safeSign, throwIfFails } from './utils/helpers';

import { asyncPipe } from '../utils/asyncPipe';
import { Any } from './utils/types';

export const submitAndListen =
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
      checkSuccess(
        asyncPipe(client.preflight, emit('preflight'), throwIfFails),
      ),
      client.submitOne,
      emit('submit'),
      client.listen,
      emit('listen'),
      throwIfFails,
      emit('data'),
    );
