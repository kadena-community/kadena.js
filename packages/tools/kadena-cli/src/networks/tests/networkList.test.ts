import { beforeEach, describe, expect, it } from 'vitest';
import { CWD_KADENA_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';
import { runCommand, runCommandJson } from '../../utils/test.util.js';

describe('network list command', () => {
  beforeEach(async () => {
    if (await services.filesystem.directoryExists(CWD_KADENA_DIR)) {
      await services.filesystem.deleteDirectory(CWD_KADENA_DIR);
    }
  });
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
