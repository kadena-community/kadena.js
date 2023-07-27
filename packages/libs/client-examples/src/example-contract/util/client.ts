import { getClient } from '@kadena/client';

export const NETWORK_ID: string = 'fast-development';

// configure the client and export the functions
export const {
  listen,
  submit,
  preflight,
  dirtyRead,
  pollCreateSpv,
  pollStatus,
  getStatus,
  createSpv,
} = getClient({
  networks: {
    'fast-development': 'http://localhost:8080',
  },
});
