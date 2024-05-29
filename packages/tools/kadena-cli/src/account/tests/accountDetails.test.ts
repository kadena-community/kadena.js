import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { accountDetailsSuccessData } from '../../mocks/data/accountDetails.js';
import { server } from '../../mocks/server.js';
import {
  mockPrompts,
  runCommand,
  runCommandJson,
} from '../../utils/test.util.js';

describe('account details', () => {
  beforeEach(() => {
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

  it('should fetch account details based on the account alias file', async () => {
    // Pre add the account alias file to make sure account alias exists
    await runCommand(
      'account add --from=key --account-alias=account-add-test-manual --account-name=accountName --fungible=coin --network=testnet --chain-id=1 --public-keys=publicKey1 --quiet',
    );

    mockPrompts({
      select: {
        'Select an account (alias - account name):': 'account-add-test-manual',
        'Select a network:': 'testnet',
      },
      input: {
        'Enter a ChainId (0-19) (comma or hyphen separated e.g 0,1,2 or 1-5 or all):':
          '0',
      },
    });
    const res = await runCommandJson('account details');
    expect(res).toEqual(accountDetailsSuccessData.result.data);
  });

  it('should fetch account details when user input account name manually', async () => {
    mockPrompts({
      select: {
        'Select an account (alias - account name):': 'custom',
        'Select a network:': 'testnet',
      },
      input: {
        'Please enter the account name:': 'accountName',
        'Enter the name of a fungible:': 'coin',
        'Enter a ChainId (0-19) (comma or hyphen separated e.g 0,1,2 or 1-5 or all):':
          '0',
      },
    });
    const res = await runCommandJson('account details');
    expect(res).toEqual(accountDetailsSuccessData.result.data);
  });

  it('should fetch account details when user pass all options in cli with --quiet flag', async () => {
    const res = await runCommandJson(
      'account details --account=account1 --fungible=coin --network=testnet --chain-ids=0 --quiet',
    );
    expect(res).toEqual(accountDetailsSuccessData.result.data);
  });

  it('should return account not available error message when account not found on chain', async () => {
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/2/pact/api/v1/local',
        () => {
          return HttpResponse.json(
            { error: 'with-read: row not found: qwerty' },
            { status: 404 },
          );
        },
      ),
    );
    const res = await runCommand(
      'account details --account=account1 --fungible=coin --network=testnet --chain-ids=2',
    );

    expect(res.stderr).toContain(
      '\nAccount "account1" is not available on\nfollowing chain(s): 2 on network "testnet04"',
    );
  });

  it('should return account details for multiple chain ids', async () => {
    const chainIdOneData = {
      ...accountDetailsSuccessData,
      result: {
        ...accountDetailsSuccessData.result,
        data: {
          ...accountDetailsSuccessData.result.data,
          balance: 100,
        },
      },
    };
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local',
        async (): Promise<HttpResponse> => {
          return HttpResponse.json(chainIdOneData, { status: 200 });
        },
      ),
    );
    mockPrompts({
      select: {
        'Select an account (alias - account name):': 'accountName',
        'Select a network:': 'testnet',
      },
      input: {
        'Enter the name of a fungible:': 'coin',
        'Enter a ChainId (0-19) (comma or hyphen separated e.g 0,1,2 or 1-5 or all):':
          '0,1',
      },
    });

    const res = await runCommandJson('account details');
    expect(res).toEqual({
      ['0']: accountDetailsSuccessData.result.data,
      ['1']: chainIdOneData.result.data,
    });
  });

  it('should return account details for one chain id and for two chain ids account not found', async () => {
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local',
        async (): Promise<HttpResponse> => {
          return HttpResponse.json(
            { error: 'with-read: row not found: qwerty' },
            { status: 404 },
          );
        },
      ),
    );
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/2/pact/api/v1/local',
        async (): Promise<HttpResponse> => {
          return HttpResponse.json(
            { error: 'with-read: row not found: qwerty' },
            { status: 404 },
          );
        },
      ),
    );
    const res = await runCommandJson(
      'account details --account=account1 --fungible=coin --network=testnet --chain-ids=0-2',
    );
    expect(res).toEqual(accountDetailsSuccessData.result.data);
  });

  it('should return error message when api fails', async () => {
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/2/pact/api/v1/local',
        () => {
          return HttpResponse.json('shit hit the fan', { status: 500 });
        },
      ),
    );
    const res = await runCommand(
      'account details --account=account1 --fungible=coin --network=testnet --chain-ids=2',
    );
    expect(res.stderr).toContain('shit hit the fan');
  });
});
