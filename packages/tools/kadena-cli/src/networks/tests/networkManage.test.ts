import jsYaml from 'js-yaml';
import path from 'path';
import { beforeEach, describe, expect, it } from 'vitest';
import { CWD_KADENA_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';
import { mockPrompts, runCommand } from '../../utils/test.util.js';

describe('network update command', () => {
  const networkFilePath = path.join(CWD_KADENA_DIR, 'networks/devnet.yaml');
  beforeEach(async () => {
    if (await services.filesystem.directoryExists(CWD_KADENA_DIR)) {
      await services.filesystem.deleteDirectory(CWD_KADENA_DIR);
    }
    mockPrompts({
      select: {
        'Location of kadena config directory': CWD_KADENA_DIR,
        'Would you like to create a wallet?': 'false',
      },
    });
    await runCommand(`config init`);
  });

  it('should update the network config', async () => {
    mockPrompts({
      select: {
        'Select a network': 'devnet',
      },
      input: {
        'Enter a network name': 'devnet',
        'Enter a network id': 'fast-development',
      },
    });
    await runCommand('network update');
    const content = await services.filesystem.readFile(networkFilePath);
    expect(jsYaml.load(content!)).toEqual({
      network: 'devnet',
      networkId: 'fast-development',
      networkHost: 'http://localhost:8080',
      networkExplorerUrl: 'http://localhost:8080/explorer/development/tx/',
    });
  });

  it('should update the network with --quiet option', async () => {
    await runCommand(
      'network update --network=devnet --network-name=devnet --network-host=http://localhost:3000 --quiet',
    );
    const content = await services.filesystem.readFile(networkFilePath);
    expect(jsYaml.load(content!)).toEqual({
      network: 'devnet',
      networkId: 'development',
      networkHost: 'http://localhost:3000',
      networkExplorerUrl: 'http://localhost:8080/explorer/development/tx/',
    });
  });

  it('should remove the network file and create one when network name changes', async () => {
    mockPrompts({
      select: {
        'Select a network': 'devnet',
      },
      input: {
        'Enter a network name': 'fast-devnet',
        'Enter a network id': 'fast-development',
      },
    });
    await runCommand('network update');
    expect(await services.filesystem.fileExists(networkFilePath)).toBe(false);
    const newNetworkFilePath = path.join(
      CWD_KADENA_DIR,
      'networks/fast-devnet.yaml',
    );
    const content = await services.filesystem.readFile(newNetworkFilePath);
    expect(jsYaml.load(content!)).toEqual({
      network: 'fast-devnet',
      networkId: 'fast-development',
      networkHost: 'http://localhost:8080',
      networkExplorerUrl: 'http://localhost:8080/explorer/development/tx/',
    });
  });
});
