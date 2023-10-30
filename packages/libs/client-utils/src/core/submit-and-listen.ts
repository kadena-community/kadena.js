import { createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';

import { asyncPipe } from './utils/asyncPipe';
import type { IClientConfig, IEmit } from './utils/helpers';
import {
  checkSuccess,
  extractResult,
  getClient,
  safeSign,
  throwIfFails,
} from './utils/helpers';

export const submitAndListen =
  ({ host, defaults, sign }: IClientConfig, client = getClient(host)) =>
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
      extractResult,
    );
