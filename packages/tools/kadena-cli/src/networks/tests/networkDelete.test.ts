import path from 'path';
import { beforeEach, describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { mockPrompts, runCommand } from '../../utils/test.util.js';

describe('network delete command', () => {
  const root = path.join(__dirname, '../../../');
  const networkPath = path.join(root, '.kadena/networks');
  const networkFilePath = path.join(networkPath, 'devnet.yaml');
  const defaultNetworkSettingFilePath = path.join(
    root,
    '.kadena/defaults/networks/__default__.yaml',
  );
  beforeEach(async () => {
    await runCommand(
      'network add --network-name=devnet --network-id=devnet --network-host=http://localhost:8080 --network-explorer-url=http://localhost:8080/explorer --network-overwrite=yes --quiet',
    );
  });

  it('should delete a network', async () => {
    expect(await services.filesystem.fileExists(networkFilePath)).toBe(true);
    mockPrompts({
      select: {
        'Select a network': 'devnet',
      },
      input: {
        'Are you sure you want to delete the configuration for network "devnet"?\n  type "yes" to confirm or "no" to cancel and press enter.':
          'yes',
      },
      verbose: true,
    });

    await runCommand('network delete');
    expect(await services.filesystem.fileExists(networkFilePath)).toBe(false);
  });

  it('should not delete a network when user selects "no" for the delete confirmation', async () => {
    mockPrompts({
      select: {
        'Select a network': 'devnet',
      },
      input: {
        'Are you sure you want to delete the configuration for network "devnet"?':
          'no',
      },
    });
    await runCommand('network delete');
    expect(await services.filesystem.fileExists(networkFilePath)).toBe(true);
  });

  it('should remove the default network as well when deleting a network if its a default network', async () => {
    // setting a default network
    await runCommand('network set-default --network=devnet --confirm --quiet');
    expect(await services.filesystem.fileExists(networkFilePath)).toBe(true);
    expect(
      await services.filesystem.fileExists(defaultNetworkSettingFilePath),
    ).toBe(true);
    mockPrompts({
      select: {
        'Select a network': 'devnet',
      },
      input: {
        'Are you sure you want to delete the configuration for network "devnet"?':
          'yes',
      },
    });
    await runCommand('network delete');
    expect(await services.filesystem.fileExists(networkFilePath)).toBe(false);
    expect(
      await services.filesystem.fileExists(defaultNetworkSettingFilePath),
    ).toBe(false);
  });
});
