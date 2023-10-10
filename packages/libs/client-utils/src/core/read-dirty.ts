import { createClient, createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';

import type { Any } from './utils/types';

import type { IClientConfig, IEmit } from './utils/helpers';
import { throwIfFails } from './utils/helpers';

import { asyncPipe } from './utils/asyncPipe';

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
    );
