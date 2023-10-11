import { createClient, createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';

import { asyncPipe } from './utils/asyncPipe';
import type { IClientConfig, IEmit } from './utils/helpers';
import { extractResult, throwIfFails } from './utils/helpers';
import type { Any } from './utils/types';

export const dirtyRead =
  (
    { host, defaults }: Omit<IClientConfig, 'sign'>,
    client = createClient(host as Any),
  ) =>
  (emit: IEmit) =>
    asyncPipe(
      composePactCommand(defaults ?? {}),
      createTransaction,
      client.dirtyRead,
      emit('dirtyRead'),
      throwIfFails,
      extractResult,
    );
