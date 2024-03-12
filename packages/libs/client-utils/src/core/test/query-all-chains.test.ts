import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ILocalCommandResult } from '@kadena/chainweb-node-client';
import type { IClient } from '@kadena/client';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import { queryAllChainsClient } from '..';

describe('queryAllChainsClient', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date('2023-10-26'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the local of all 20 chains and returns the result', async () => {
    const client: IClient = {
      dirtyRead: vi.fn().mockResolvedValue({
        result: { status: 'success', data: 'test-data' },
      } as ILocalCommandResult),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const queryChains = queryAllChainsClient(
      { defaults: { networkId: 'test-network' } },
      client,
    );
    let counter = 0;
    const result = await queryChains(
      composePactCommand(execution('(test 1 2 3)'), setMeta({ chainId: '1' })),
    ).on('chain-result', (result) => {
      counter++;
      expect(result).toEqual({
        result: 'test-data',
        chainId: (counter - 1).toString(),
      });
    });

    await expect(result.execute()).resolves.toEqual(
      Array(20)
        .fill(null)
        .map((_, idx) => ({
          result: 'test-data',
          chainId: idx.toString(),
        })),
    );
    expect(counter).toEqual(20);
  });
});
