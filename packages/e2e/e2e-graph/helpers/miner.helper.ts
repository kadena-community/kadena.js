import type { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';
import { devnetHost } from '../../e2e-base/src/constants/network.constants';

export async function triggerMining(
  request: APIRequestContext,
  chainId = '0',
  numberOfBlocks = 1,
): Promise<void> {
  const response = await request.post(`${devnetHost}/make-blocks`, {
    data: {
      [chainId]: numberOfBlocks,
    },
  });

  expect(response.status()).toBe(200);
}
