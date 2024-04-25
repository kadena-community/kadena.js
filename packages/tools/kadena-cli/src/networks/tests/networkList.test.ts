import { describe, expect, it } from 'vitest';
import { runCommand, runCommandJson } from '../../utils/test.util.js';

describe('network list command', () => {
  it('should return empty networks list', async () => {
    const res = await runCommandJson('network list');
    expect(res.networks).toEqual([]);
  });

  it('should return networks list', async () => {
    await runCommand(
      'network add --network-name=test-network-quiet --network-id=development --network-host=http://localhost:8080 --network-explorer-url=http://localhost:8080/explorer --network-overwrite=yes --quiet',
    );
    const res = await runCommandJson('network list');
    expect(res.networks).toEqual([
      {
        network: 'test-network-quiet',
        networkId: 'development',
        networkHost: 'http://localhost:8080',
        networkExplorerUrl: 'http://localhost:8080/explorer',
      },
    ]);
  });
});
