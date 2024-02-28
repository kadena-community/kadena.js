import { createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';

import type { PactValue } from '@kadena/types';
import { asyncPipe } from './utils/asyncPipe.js';
import type { IClientConfig, IEmit } from './utils/helpers.js';
import {
  checkSuccess,
  extractResult,
  getClient,
  safeSign,
  throwIfFails,
} from './utils/helpers.js';

export const submitAndListen =
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
      checkSuccess(
        asyncPipe(client.preflight, emit('preflight'), throwIfFails),
      ),
      client.submitOne,
      emit('submit'),
      client.listen,
      emit('listen'),
      throwIfFails,
      extractResult<T>,
    );
