import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  ACCOUNT_DIR,
  NETWORKS_DIR,
  TX_TEMPLATE_FOLDER,
  WALLET_DIR,
} from '../../../constants/config.js';
import { services } from '../../../services/index.js';
import { KadenaError } from '../../../services/service-error.js';
import { runCommand, runCommandJson } from '../../../utils/test.util.js';

describe('config show', () => {
  const configDirectory = process.env.KADENA_DIR!;
  it('should return the default config paths and values based on test setup', async () => {
    // as part of test setup, we have already created the default config
    // with 2 templates and 3 networks
    const output = await runCommandJson('config show');
    expect(output).toEqual({
      configDirectory,
      walletDirectory: path.join(configDirectory, WALLET_DIR),
      defaultTemplateDirectory: path.join(configDirectory, TX_TEMPLATE_FOLDER),
      networkDirectory: path.join(configDirectory, NETWORKS_DIR),
      accountDirectory: path.join(configDirectory, ACCOUNT_DIR),
      numberOfWallets: 0,
      numberOfTemplates: 3,
      numberOfNetworks: 3,
      numberOfAccounts: 0,
      defaultNetwork: 'N/A',
    });
  });

  it('should return wallets and accounts count after creating a wallet and account', async () => {
    // creating a wallet
    await runCommandJson('wallet add -w test --quiet', {
      stdin: '12345678',
    });
    // creating an account
    await runCommand(
      'account add --from=key --account-alias=account-one --account-name=k:55e10019549e047e68efaa18489ed785eca271642e2d0ce41d56ced2a30ccb84 --fungible=coin --network=testnet --chain-id=1 --public-keys=55e10019549e047e68efaa18489ed785eca271642e2d0ce41d56ced2a30ccb84 --quiet',
    );
    const output = await runCommandJson('config show');
    expect(output).toEqual({
      configDirectory,
      walletDirectory: path.join(configDirectory, WALLET_DIR),
      defaultTemplateDirectory: path.join(configDirectory, TX_TEMPLATE_FOLDER),
      networkDirectory: path.join(configDirectory, NETWORKS_DIR),
      accountDirectory: path.join(configDirectory, ACCOUNT_DIR),
      numberOfWallets: 1,
      numberOfTemplates: 3,
      numberOfNetworks: 3,
      numberOfAccounts: 1,
      defaultNetwork: 'N/A',
    });
  });

  it('should return the default network name when it exists', async () => {
    // setting the default network
    await runCommand('network set-default --network=testnet --confirm --quiet');
    const output = await runCommandJson('config show');
    expect(output.defaultNetwork).toEqual('testnet');
  });

  it('should return warning message to run "kadena config init" command when there is no configDirectory', async () => {
    services.config.getDirectory = vi.fn().mockImplementation(() => {
      throw new KadenaError('no_kadena_directory');
    });
    const { stderr } = await runCommand('config show');
    expect(stderr).toContain(
      'No kadena directory found. Run the following command to create one:',
    );
    expect(stderr).toContain('kadena config init');
  });
});
