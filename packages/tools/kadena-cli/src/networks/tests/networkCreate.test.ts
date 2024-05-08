import path from 'path';
import { describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { mockPrompts, runCommand } from '../../utils/test.util.js';

describe('add network command', () => {
  const root = path.join(__dirname, '../../../');
  const networkPath = path.join(root, '.kadena/networks');
  it('should add a "test-network"', async () => {
    mockPrompts({
      input: {
        'Enter a network name (e.g. "mainnet")': 'test-network',
        'Enter a network id (e.g. "mainnet01")': 'testnet',
        'Enter Kadena network host (e.g. "https://api.chainweb.com")':
          'http://localhost:30000',
        'Enter Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")':
          'http://localhost:30000/explorer',
      },
      select: {
        'Are you sure you want to save this configuration for network "test-network"?':
          'yes',
      },
    });
    await runCommand('network add');
    const networksFilePath = path.join(networkPath, 'test-network.yaml');
    expect(await services.filesystem.fileExists(networksFilePath)).toBe(true);
  });

  it('should not add a network when user doesnt want to save the configuration', async () => {
    mockPrompts({
      input: {
        'Enter a network name (e.g. "mainnet")': 'no-save-network',
        'Enter a network id (e.g. "mainnet01")': 'testnet',
        'Enter Kadena network host (e.g. "https://api.chainweb.com")':
          'http://localhost:30000',
        'Enter Kadena network explorer URL (e.g. "https://explorer.chainweb.com/mainnet/tx/")':
          'http://localhost:30000/explorer',
      },
      select: {
        'Are you sure you want to save this configuration for network "no-save-network"?':
          'no',
      },
    });
    const networksFilePath = path.join(networkPath, 'no-save-network.yaml');
    expect(await services.filesystem.fileExists(networksFilePath)).toBe(false);
  });

  it('should add a network with all options with --quiet flag', async () => {
    await runCommand(
      'network add --network-name=test-network-quiet --network-id=development --network-host=http://localhost:8080 --network-explorer-url=http://localhost:8080/explorer --network-overwrite=yes --quiet',
    );
    const networksFilePath = path.join(networkPath, 'test-network-quiet.yaml');
    expect(await services.filesystem.fileExists(networksFilePath)).toBe(true);
  });
});
