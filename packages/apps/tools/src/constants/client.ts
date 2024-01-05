import type { IClient } from '@kadena/client';
import { createClient } from '@kadena/client';

const client = (apiHost: string): IClient => {
  return createClient(apiHost);
};

export default client;
