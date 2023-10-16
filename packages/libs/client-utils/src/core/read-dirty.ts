import { createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';

import { asyncPipe } from './utils/asyncPipe';
import type { IClientConfig, IEmit } from './utils/helpers';
import { extractResult, getClient, throwIfFails } from './utils/helpers';

export const dirtyRead =
  ({ host, defaults }: Omit<IClientConfig, 'sign'>, client = getClient(host)) =>
  (emit: IEmit) =>
    asyncPipe(
      composePactCommand(defaults ?? {}),
      createTransaction,
      client.dirtyRead,
      emit('dirtyRead'),
      throwIfFails,
      extractResult,
    );
