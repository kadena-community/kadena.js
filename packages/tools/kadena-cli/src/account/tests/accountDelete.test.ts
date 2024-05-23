import { HttpResponse, http } from 'msw';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ACCOUNT_DIR } from '../../constants/config.js';
import { accountDetailsSuccessData } from '../../mocks/data/accountDetails.js';
import { server } from '../../mocks/server.js';
import { services } from '../../services/index.js';
import { mockPrompts, runCommand } from '../../utils/test.util.js';

describe('account delete', () => {
  const root = path.join(__dirname, '../../../');
  const configPath = path.join(root, '.kadena');
  const accountPath = path.join(configPath, ACCOUNT_DIR);
  const accountAliasFile = path.join(
    accountPath,
    'account-add-test-manual.yaml',
  );
  beforeEach(async () => {
    // Add account alias file
    await runCommand(
      'account add --type=manual --account-alias=account-add-test-manual --account-name=accountName --fungible=coin --network=testnet --chain-id=1 --public-keys=publicKey1 --quiet',
    );

    await services.filesystem.fileExists(accountAliasFile);

    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/0/pact/api/v1/local',
        async (): Promise<HttpResponse> => {
          return HttpResponse.json(accountDetailsSuccessData, { status: 200 });
        },
      ),
    );
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it('should delete account alias file', async () => {
    mockPrompts({
      select: {
        'Select an account (alias - account name):': 'account-add-test-manual',
      },
      input: {
        'Are you sure you want to delete the account-add-test-manual alias account?\n  type "yes" to confirm or "no" to cancel and press enter.':
          'yes',
      },
    });
    await runCommand('account delete');
    expect(await services.filesystem.fileExists(accountAliasFile)).toBe(false);
  });

  it('should not delete the account alias file when user input "no" to confirm', async () => {
    mockPrompts({
      select: {
        'Select an account (alias - account name):': 'account-add-test-manual',
      },
      input: {
        'Are you sure you want to delete the account-add-test-manual alias account?\n  type "yes" to confirm or "no" to cancel and press enter.':
          'no',
      },
    });
    const res = await runCommand('account delete');
    expect(await services.filesystem.fileExists(accountAliasFile)).toBe(true);
    expect(res.stderr).toContain('The account alias will not be deleted.');
  });

  it('should delete the account alias file with options and quiet flag', async () => {
    await runCommand(
      'account delete --account-alias=account-add-test-manual --confirm --quiet',
    );
    expect(await services.filesystem.fileExists(accountAliasFile)).toBe(false);
  });

  it('should delete all account aliases when user selects all option', async () => {
    // Add one more account alias
    // Add account alias file
    await runCommand(
      'account add --type=manual --account-alias=another-account-alias --account-name=accountName --fungible=coin --network=testnet --chain-id=1 --public-keys=publicKey1 --quiet',
    );
    mockPrompts({
      select: {
        'Select an account (alias - account name):': 'all',
      },
      input: {
        'Are you sure you want to delete all the accounts?\n  type "yes" to confirm or "no" to cancel and press enter.':
          'yes',
      },
    });
    await runCommand('account delete');
    expect(await services.filesystem.fileExists(accountAliasFile)).toBe(false);
    const anotherAccountAliasFile = path.join(
      accountPath,
      'another-account-alias.yaml',
    );
    expect(await services.filesystem.fileExists(anotherAccountAliasFile)).toBe(
      false,
    );
  });

  it('should throw error missing required arguments when user doesnt pass confirm option with quiet flag', async () => {
    const res = await runCommand(
      'account delete --account-alias=account-add-test-manual --quiet',
    );
    expect(await services.filesystem.fileExists(accountAliasFile)).toBe(true);
    expect(res.stderr).toContain('Missing required arguments');
    expect(res.stderr).toContain('- confirm (-c, --confirm)');
  });

  it('should throw no alias found error message when there is no account alias found', async () => {
    const res = await runCommand(
      'account delete --account-alias=not-found-alias --confirm',
    );
    expect(res.stderr).toContain(
      'The account alias "not-found-alias" does not exist',
    );
  });

  it('should throw invalid account alias when account passes as empty string', async () => {
    const res = await runCommand('account delete --account-alias=  --confirm');
    expect(res.stderr).toContain('Account alias is not provided or invalid.');
  });

  it('should throw no aliases error message when user tries to run account delete command with accounts folder empty', async () => {
    // deleting account alias file to make the folder empty
    await services.filesystem.deleteFile(accountAliasFile);

    const res = await runCommand('account delete');
    expect(res.stderr).toContain(
      'No account aliases found. To add an account use `kadena account add` command.',
    );
  });
});
