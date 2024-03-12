import { createClient } from '@kadena/client';
import { env } from './env';

export const getClient = (url?: string) => {
  const client = createClient(url ? url : env.CHAINWEBAPIURL);
  return client;
};
