import { createTransaction } from '@kadena/client';

import type { PactValue } from '@kadena/types';
import { asyncPipe } from './utils/asyncPipe';
import type { IClientConfig, IEmit } from './utils/helpers';
import {
  checkSuccess,
  composeWithDefaults,
  extractResult,
  getClient,
  safeSign,
  throwIfFails,
} from './utils/helpers';

export const submitAndListen =
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
