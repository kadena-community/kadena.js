import type { ILocalCommandResult } from '@kadena/chainweb-node-client';
import type { IClient } from '@kadena/client';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import { dirtyReadClient } from '../client-helpers';

describe('dirtyReadClient', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date('2023-10-26'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the dirtyRead endpoint and returns the result', async () => {
    const client: IClient = {
      dirtyRead: vitest.fn().mockResolvedValue({
        result: { status: 'success', data: 'test-data' },
      } as ILocalCommandResult),
    } as any;
    const dirtyRead = dirtyReadClient(
      { defaults: { networkId: 'test-network' } },
      client,
    );
    const result = await dirtyRead(
      composePactCommand(execution('(test 1 2 3)'), setMeta({ chainId: '1' })),
    ).on('dirtyRead', (result) => {
      expect(result).toEqual({
        result: { status: 'success', data: 'test-data' },
      });
    });

    await expect(result.execute()).resolves.toEqual('test-data');
  });
});
