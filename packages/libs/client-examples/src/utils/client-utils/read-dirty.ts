import { createClient, createTransaction } from '@kadena/client';
import { asyncPipe, composePactCommand } from '@kadena/client/fp';

import type { Any } from '../types';

import type { IClientConfig, IEmit } from './helpers';
import { throwIfFails } from './helpers';

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
