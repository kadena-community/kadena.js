import { createClient, createTransaction } from '@kadena/client';
import { asyncPipe, composePactCommand } from '@kadena/client/fp';

import { safeSign } from '../../example-contract/util/fp-helpers';
import type { Any } from '../types';

import type { IClientConfig, IEmit } from './helpers';
import { checkSuccess, throwIfFails } from './helpers';

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
