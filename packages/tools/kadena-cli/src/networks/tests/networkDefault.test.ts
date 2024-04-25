import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { services } from '../../services/index.js';
import { mockPrompts, runCommand } from '../../utils/test.util.js';

describe('network set-default command', () => {
  const root = path.join(__dirname, '../../../');
  const defaultFilePath = path.join(
    root,
    '.kadena/defaults/networks/__default__.yaml',
  );

  afterEach(async () => {
    if (await services.filesystem.fileExists(defaultFilePath)) {
      await services.filesystem.deleteFile(defaultFilePath);
    }
  });

  it('should set a network as a default', async () => {
    mockPrompts({
      select: {
        'Select a network': 'devnet',
        'Are you sure you want to set "devnet" as the default network?': true,
      },
    });
    const res = await runCommand('network set-default');
    expect(await services.filesystem.fileExists(defaultFilePath)).toBe(true);
    expect(res).toContain(
      'The network configuration "devnet" has been set as default.',
    );
  });

  it('should not set default network when user doesnt confirm', async () => {
    mockPrompts({
      select: {
        'Select a network': 'devnet',
        'Are you sure you want to set "devnet" as the default network?': false,
      },
    });
    const res = await runCommand('network set-default');
    expect(await services.filesystem.fileExists(defaultFilePath)).toBe(false);
    expect(res).toContain('The default network will not be set.');
  });

  it('should set default network with quiet option', async () => {
    const res = await runCommand(
      'network set-default --network=devnet --confirm --quiet',
    );
    expect(await services.filesystem.fileExists(defaultFilePath)).toBe(true);
    expect(res).toContain(
      'The network configuration "devnet" has been set as default.',
    );
  });

  it('should not set a default network when user provides some random values', async () => {
    mockPrompts({
      select: {
        'Select a network': 'no-network',
        'Are you sure you want to set "devnet" as the default network?': true,
      },
    });
    const res = await runCommand('network set-default');
    expect(await services.filesystem.fileExists(defaultFilePath)).toBe(false);
    expect(res).toContain(
      'No network configuration found for "no-network". Please create a "no-network" network.',
    );
  });

  it('should log warning message when user passes network none when there is no default network', async () => {
    expect(await services.filesystem.fileExists(defaultFilePath)).toBe(false);
    const res = await runCommand(
      'network set-default --network=none --confirm --quiet',
    );
    expect(res).toContain('There is no default network to remove.');
  });

  it('should not unset a default network when user selects "none" with no confirmation', async () => {
    // setting default network first
    await runCommand('network set-default --network=devnet --confirm --quiet');
    mockPrompts({
      select: {
        'Select a network': 'none',
        'Are you sure you want to remove the "devnet" default network?': false,
      },
    });
    const res = await runCommand('network set-default');
    expect(res).toContain('The default network will not be removed.');
    expect(await services.filesystem.fileExists(defaultFilePath)).toBe(true);
  });

  it('should unset a default network when user selects "none"', async () => {
    // setting default network first
    await runCommand('network set-default --network=devnet --confirm --quiet');
    expect(await services.filesystem.fileExists(defaultFilePath)).toBe(true);
    mockPrompts({
      select: {
        'Select a network': 'none',
        'Are you sure you want to remove the "devnet" default network?': true,
      },
    });
    const res = await runCommand('network set-default');
    expect(res).toContain(
      'The default network configuration has been removed.',
    );
    expect(await services.filesystem.fileExists(defaultFilePath)).toBe(false);
  });
});
