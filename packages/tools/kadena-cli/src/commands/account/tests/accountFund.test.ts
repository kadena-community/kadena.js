import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CHAIN_ID_ACTION_ERROR_MESSAGE,
  CHAIN_ID_RANGE_ERROR_MESSAGE,
} from '../../../constants/account.js';
import { server } from '../../../mocks/server.js';
import { mockPrompts, runCommand } from '../../../utils/test.util.js';
import * as fundHelpers from '../utils/fundHelpers.js';
import * as devnetHelpers from './../../devnet/utils/network.js';

describe('account fund', () => {
  beforeEach(async () => {
    // Pre add the account alias file to make sure account alias exists
    await runCommand(
      'account add --from=key --account-alias=account-add-test-manual --account-name=accountName --fungible=coin --network=testnet --chain-id=1 --public-keys=publicKey1 --quiet',
    );
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it('should fund an account when account already exists on chain', async () => {
    mockPrompts({
      select: {
        'Select an account (alias - account name):': 'account-add-test-manual',
        'Select a network:': 'testnet',
      },
      input: {
        'Enter a ChainId (0-19) (comma or hyphen separated e.g 0,1,2 or 1-5 or all):':
          '1',
        'Enter an amount:': '20',
      },
    });
    const res = await runCommand('account fund');
    expect(res.stderr).toContain(
      'Account "accountName" funded with 20 coin(s) on Chain ID(s) "1" in testnet04 network.',
    );
    expect(res.stderr).toContain(
      'https://explorer.chainweb.com/testnet/tx/requestKey-1',
    );
  });

  it('should fund an account when options passed in cli', async () => {
    const res = await runCommand(
      'account fund --account=account-add-test-manual --amount=1 --network=testnet --chain-ids=1 --quiet',
    );
    expect(res.stderr).toContain(
      'Account "accountName" funded with 1 coin(s) on Chain ID(s) "1" in testnet04 network.',
    );
    expect(res.stderr).toContain(
      'https://explorer.chainweb.com/testnet/tx/requestKey-1',
    );
  });

  it('should create an account and fund when account does not exist on chain', async () => {
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local',
        async ({ request }) => {
          const data = (await request.json()) as { cmd: string };
          const parsedCMD = JSON.parse(data.cmd as string);
          if (parsedCMD.payload.exec.code.includes('coin.details') === true) {
            return HttpResponse.json(
              { error: 'with-read: row not found: qwerty' },
              { status: 404 },
            );
          }

          return HttpResponse.json(
            {
              result: {
                data: 'Write succeeded',
                status: 'success',
              },
            },
            { status: 200 },
          );
        },
      ),
    );

    mockPrompts({
      select: {
        'Select an account (alias - account name):': 'account-add-test-manual',
        'Select a network:': 'testnet',
      },
      input: {
        'Enter a ChainId (0-19) (comma or hyphen separated e.g 0,1,2 or 1-5 or all):':
          '1',
        'Enter an amount:': '5',
      },
    });

    const res = await runCommand('account fund');
    expect(res.stderr).toContain(
      'Account "accountName" does not exist on Chain ID(s) 1. So the account will be created on these Chain ID(s)',
    );
    expect(res.stderr).toContain(
      'Account "accountName" funded with 5 coin(s) on Chain ID(s) "1" in testnet04 network.',
    );
  });

  it('should throw max amount error when user tries to enter more than max amount split for multi chains', async () => {
    const res = await runCommand(
      'account fund --account=account-add-test-manual --amount=20 --network=testnet --chain-ids=0,1,2 --quiet',
    );
    expect(res.stderr).toContain(
      'Error: -m, --amount "With 3 chains to fund, the max amount per chain is 6 coin(s)."',
    );
  });

  it('should exit with invalid chain id error message when user passes invalid chain id with quiet flag', async () => {
    const res = await runCommand(
      'account fund --account=account-add-test-manual --amount=1 --network=testnet --chain-ids=-1 --quiet',
    );
    expect(res.stderr).toContain(CHAIN_ID_RANGE_ERROR_MESSAGE);
    expect(res.stderr).toContain(CHAIN_ID_ACTION_ERROR_MESSAGE);
  });

  it('should exit with account details missing when user passes account alias which is not created', async () => {
    const res = await runCommand(
      'account fund --account=some-random-account-alias --amount=1 --network=testnet --chain-ids=2',
    );

    expect(res.stderr).toContain('Account details are missing');
  });

  it('should not fund an account when user tries to fund it on mainnet', async () => {
    const res = await runCommand(
      'account fund --account=account-add-test-manual --amount=1 --network=mainnet --chain-ids=1',
    );

    expect(res.stderr).toContain(
      'Fundings are not allowed on "mainnet01" network.',
    );
  });

  it('should not fund an account when user tries to fund other than coin fungible with quiet flag', async () => {
    await runCommand(
      'account add --from=key --account-alias=kdx-account --account-name=accountName --fungible=kdx --network=testnet --chain-id=1 --public-keys=publicKey1 --quiet',
    );
    const res = await runCommand(
      'account fund --account=kdx-account --amount=1 --network=testnet --chain-ids=1',
    );
    expect(res.stderr).toContain(
      `You can't fund an account other than "coin" fungible.`,
    );
  });

  it('should fund an account in devnet', async () => {
    const mockCheckHealth = vi
      .spyOn(devnetHelpers, 'checkHealth')
      .mockResolvedValue(true);
    const mockFindMissingModule = vi
      .spyOn(fundHelpers, 'findMissingModuleDeployments')
      .mockResolvedValue([]);
    const res = await runCommand(
      'account fund --account=account-add-test-manual --amount=1 --network=devnet --chain-ids=1',
    );
    expect(res.stderr).toContain(
      'Chain ID "1" : http://localhost:8080/explorer/development/tx/requestKey-1',
    );
    expect(res.stderr).toContain(
      'Account "accountName" funded with 1 coin(s) on Chain ID(s) "1" in development network.',
    );
    mockCheckHealth.mockRestore();
    mockFindMissingModule.mockRestore();
  });

  it('should gracefully exit when development server is not running', async () => {
    const mockCheckHealth = vi
      .spyOn(devnetHelpers, 'checkHealth')
      .mockResolvedValue(false);
    const res = await runCommand(
      'account fund --account=account-add-test-manual --amount=1 --network=devnet --chain-ids=1',
    );
    expect(res.stderr).toContain(
      'Devnet host "http://localhost:8080" is not running.',
    );
    mockCheckHealth.mockRestore();
  });

  it('should exit without funding when user select "no" for deploy faucet prompt', async () => {
    mockPrompts({
      select: {
        'Do you wish to deploy faucet module?': 'no',
      },
    });
    const mockCheckHealth = vi
      .spyOn(devnetHelpers, 'checkHealth')
      .mockResolvedValue(true);
    const mockdeployFaucetsToChains = vi.spyOn(
      fundHelpers,
      'deployFaucetsToChains',
    );
    const mockFindMissingModule = vi
      .spyOn(fundHelpers, 'findMissingModuleDeployments')
      .mockResolvedValue(['1']);
    const res = await runCommand(
      'account fund --account=account-add-test-manual --amount=5 --network=devnet --chain-ids=1',
    );
    expect(res.stderr).toContain(
      'Faucet module unavailable on chain "1" in the "devnet" network.',
    );
    expect(mockdeployFaucetsToChains).not.toHaveBeenCalled();
    expect(res.stderr).toContain(
      'To fund your account on chain "1" in the "devnet" network, deploy the faucet using the --deploy-faucet option.',
    );
    expect(res.stderr).not.toContain(
      'Account "accountName" funded with 5 coin(s) on Chain ID(s) "1" in development network.',
    );
    mockCheckHealth.mockRestore();
    mockFindMissingModule.mockRestore();
    mockdeployFaucetsToChains.mockRestore();
  });

  it('should deploy faucet and fund account when user select "yes" to deploy faucet', async () => {
    mockPrompts({
      select: {
        'Do you wish to deploy faucet module?': 'yes',
      },
    });
    const mockCheckHealth = vi
      .spyOn(devnetHelpers, 'checkHealth')
      .mockResolvedValue(true);
    const mockdeployFaucetsToChains = vi
      .spyOn(fundHelpers, 'deployFaucetsToChains')
      .mockResolvedValue([['1'], []]);
    const mockFindMissingModule = vi
      .spyOn(fundHelpers, 'findMissingModuleDeployments')
      .mockResolvedValue(['1']);
    const res = await runCommand(
      'account fund --account=account-add-test-manual --amount=5 --network=devnet --chain-ids=1',
    );
    expect(res.stderr).toContain(
      'Faucet module unavailable on chain "1" in the "devnet" network.',
    );
    expect(mockdeployFaucetsToChains).toHaveBeenCalled();
    expect(res.stderr).toContain(
      'Account "accountName" funded with 5 coin(s) on Chain ID(s) "1" in development network.',
    );
    mockCheckHealth.mockRestore();
    mockFindMissingModule.mockRestore();
    mockdeployFaucetsToChains.mockRestore();
  });
});
