import { expect, test } from '@playwright/test';

import {
  devnetHost,
  networkId,
} from '@kadena-dev/e2e-base/src/constants/network.constants';
import { dirtyReadClient } from '@kadena/client-utils/core';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';

test.describe('Devnet Version Tests', () => {
  test('devnet is Pact > 5', async () => {
    await test.step('test devnet is updated', async () => {
      const pactCommand = composePactCommand(
        execution(`(do 2 3)`),
        setMeta({ chainId: '0' }),
      );
      const res = await dirtyReadClient({
        host: devnetHost,
        defaults: {
          networkId: networkId,
        },
      })(pactCommand)
        .execute()
        .catch(console.error);

      expect(res).toEqual({
        int: 3,
      });
    });
  });
});
