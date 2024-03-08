import { describe, expect, it } from 'vitest';

import { createPrincipal } from '../built-in/create-principal';
import { describeModule } from '../built-in/describe-module';

const config = {
  host: 'http://127.0.0.1:8080',
  defaults: {
    networkId: 'development',
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

describe('describeModule', () => {
  it('describes the coin module', async () => {
    const module = await describeModule('coin', config);
    expect(module.hash).toBeTruthy();
    expect(module.blessed).toHaveLength(4);
    expect(module.keyset).toContain('Governance {');
    expect(module.interfaces).toHaveLength(2);
    expect(module.name).toBe('coin');
    expect(module.code).toContain('(module coin GOVERNANCE');
  });

  it('describes the ns module', async () => {
    const module = await describeModule('ns', config);
    expect(module.hash).toBeTruthy();
    expect(module.blessed).toHaveLength(0);
    expect(module.keyset).toContain('Governance {');
    expect(module.interfaces).toHaveLength(0);
    expect(module.name).toBe('ns');
    expect(module.code).toContain('(module ns GOVERNANCE');
  });
});
