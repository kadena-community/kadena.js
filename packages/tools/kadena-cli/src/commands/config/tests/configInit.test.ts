import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { WORKING_DIRECTORY } from '../../../constants/config.js';
import { services } from '../../../services/index.js';
import { mockPrompts, runCommand } from '../../../utils/test.util.js';

describe('config init', () => {
  const configPath = path.join(WORKING_DIRECTORY, '.kadena');
  const networkPath = path.join(configPath, 'networks');

  beforeEach(async () => {
    if (await services.filesystem.directoryExists(configPath)) {
      await services.filesystem.deleteDirectory(configPath);
    }
  });

  it('should create a network config', async () => {
    mockPrompts({
      select: {
        'Would you like to create a wallet?': 'false',
      },
    });

    await runCommand('config init');
    expect(
      await services.filesystem.fileExists(
        path.join(networkPath, 'devnet.yaml'),
      ),
    ).toBe(true);
    expect(
      await services.filesystem.fileExists(
        path.join(networkPath, 'testnet.yaml'),
      ),
    ).toBe(true);
    expect(
      await services.filesystem.fileExists(
        path.join(networkPath, 'mainnet.yaml'),
      ),
    ).toBe(true);
  });

  it('should create a network config along with wallet', async () => {
    mockPrompts({
      select: {
        'Would you like to create a wallet?': 'true',
        'Create an account using the first wallet key?': 'false',
      },
      input: {
        'Enter your wallet name:': 'unit-test-wallet',
        'Not using a password': 'y',
      },
      password: {
        'Enter the new wallet password': '',
      },
    });

    await runCommand('config init');

    expect(
      await services.filesystem.fileExists(
        path.join(configPath, 'wallets', 'unit-test-wallet.yaml'),
      ),
    ).toBe(true);
  });

  it('should create a wallet and account alias', async () => {
    mockPrompts({
      select: {
        'Would you like to create a wallet?': 'true',
        'Create an account using the first wallet key?': 'true',
      },
      input: {
        'Enter your wallet name:': 'unit-test-wallet',
        'Not using a password': 'y',
        'Enter an alias for an account': 'unit-test-account-alias',
      },
      password: {
        'Enter the new wallet password': '',
      },
    });
    await runCommand('config init');
    expect(
      await services.filesystem.fileExists(
        path.join(configPath, 'wallets', 'unit-test-wallet.yaml'),
      ),
    ).toBe(true);

    expect(
      await services.filesystem.fileExists(
        path.join(configPath, 'accounts', 'unit-test-account-alias.yaml'),
      ),
    ).toBe(true);
  });

  it('should not create an account alias when input string is empty', async () => {
    mockPrompts({
      select: {
        'Would you like to create a wallet?': 'true',
        'Create an account using the first wallet key?': 'true',
      },
      input: {
        'Enter your wallet name:': 'unit-test-wallet',
        'Not using a password': 'y',
        'Enter an alias for an account': '',
      },
      password: {
        'Enter the new wallet password': '',
      },
    });
    await runCommand('config init');
    expect(
      await services.filesystem.fileExists(
        path.join(configPath, 'wallets', 'unit-test-wallet.yaml'),
      ),
    ).toBe(true);

    expect(
      await services.filesystem.fileExists(
        path.join(configPath, 'accounts', 'unit-test-account-alias.yaml'),
      ),
    ).toBe(false);
  });
});
