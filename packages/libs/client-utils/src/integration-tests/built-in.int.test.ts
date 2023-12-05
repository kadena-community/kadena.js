import { describe, expect, it } from 'vitest';

import { createPrincipal } from '../built-in/create-principal';

const config = {
  host: 'http://127.0.0.1:8080',
  defaults: {
    networkId: 'fast-development',
    meta: { chainId: '0' },
  },
} as const;

describe('createPrincipal', () => {
  it('creates a principal based on one public key', async () => {
    const principal = await createPrincipal(
      {
        keyset: {
          keys: [
            '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
          ],
        },
      },
      config,
    );
    expect(principal).toBe(
      'k:368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
    );
  });

  it('creates a principal based on two public keys', async () => {
    const principal = await createPrincipal(
      {
        keyset: {
          keys: [
            '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
            '9cb650e653f563d782182a67b73a4d5d553aaf6f1c4928087bb7d91d59b8a227',
          ],
        },
      },
      config,
    );
    expect(principal).toBe(
      'w:FxlQEvb6qHb50NClEnpwbT2uoJHuAu39GTSwXmASH2k:keys-all',
    );
  });

  it('creates a principal based on two public keys and a predicate', async () => {
    const principal = await createPrincipal(
      {
        keyset: {
          keys: [
            '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
            '9cb650e653f563d782182a67b73a4d5d553aaf6f1c4928087bb7d91d59b8a227',
          ],
          pred: 'keys-any',
        },
      },
      config,
    );
    expect(principal).toBe(
      'w:FxlQEvb6qHb50NClEnpwbT2uoJHuAu39GTSwXmASH2k:keys-any',
    );
  });
});
