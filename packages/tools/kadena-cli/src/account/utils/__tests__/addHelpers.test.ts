import * as inquirerPrompts from '@inquirer/prompts';
import yaml from 'js-yaml';
import { http, HttpResponse } from 'msw';
import path from 'path';

import type { ChainId } from '@kadena/types';
import { defaultAccountPath } from '../../../constants/account.js';
import { server } from '../../../mocks/server.js';
import type { INetworkCreateOptions } from '../../../networks/utils/networkHelpers.js';
import { services } from '../../../services/index.js';
import type { IAddAccountManualConfig, Predicate } from '../../types.js';
import {
  compareAndUpdateConfig,
  createAccount,
  createAccountName,
  getAccountDetailsFromChain,
  validateAccountDetails,
  validatePublicKeys,
  writeConfigInFile,
} from '../addHelpers.js';

const networkConfig: INetworkCreateOptions = {
  networkHost: 'https://api.testnet.chainweb.com',
  networkExplorerUrl: 'https://explorer.chainweb.com/testnet04',
  networkId: 'testnet04',
  network: 'testnet',
};

const defaultConfig: IAddAccountManualConfig = {
  accountAlias: 'accountAlias',
  fungible: 'coin',
  publicKeysConfig: [],
  predicate: 'keys-all' as Predicate,
  ...networkConfig,
  networkConfig,
  chainId: '1' as ChainId,
};

describe('createAccountName', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('should return undefined if no public keys are provided', async () => {
    const accountName = await createAccountName(defaultConfig);
    expect(accountName).toBeUndefined();
  });

  it('should call createPrincipal method and return w:account when multiple public keys are provided', async () => {
    const accountName = await createAccountName({
      ...defaultConfig,
      publicKeysConfig: ['publicKey1', 'publicKey2'],
    });
    expect(accountName).toBe(
      'w:FxlQEvb6qHb50NClEnpwbT2uoJHuAu39GTSwXmASH2k:keys-all',
    );
  });

  it('should call createPrincipal method and return k:account when only one public key is provided', async () => {
    const accountName = await createAccountName({
      ...defaultConfig,
      publicKeysConfig: ['publicKey1'],
    });
    expect(accountName).toBe('k:publicKey1');
  });

  it('should return error when createPrincipal throws error', async () => {
    const realProcess = process;
    const exitMock = vi.fn();
    global.process = { ...realProcess, exit: exitMock };
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local',
        () => {
          return new HttpResponse(null, { status: 500 });
        },
      ),
    );
    await createAccountName({
      ...defaultConfig,
      publicKeysConfig: ['publicKey1', 'publicKey2'],
    });
    expect(exitMock).toHaveBeenCalledWith(1);
    global.process = realProcess;
  });
});

describe('validatePublicKeys', () => {
  beforeAll(() => {
    vi.resetAllMocks();
  });

  it('should return true if all public keys are valid', () => {
    const result = validatePublicKeys(
      ['publicKey1', 'publicKey2'],
      ['publicKey1', 'publicKey2'],
    );
    expect(result).toBe(true);
  });

  it('should return false if sizes are not equal', () => {
    const result = validatePublicKeys(
      ['publicKey1', 'publicKey2'],
      ['publicKey1'],
    );
    expect(result).toBe(false);
  });

  it('should return false if any public key is invalid', () => {
    const result = validatePublicKeys(
      ['publicKey1', 'publicKey2'],
      ['publicKey1', 'publicKey4'],
    );
    expect(result).toBe(false);
  });
});

describe('getAccountDetailsFromChain', () => {
  afterEach(() => {
    server.resetHandlers();
  });
  it('should return account details from chain', async () => {
    const result = await getAccountDetailsFromChain(
      'k:accountName',
      'fast-development',
      '1',
      'https://localhost:8080',
    );
    const expectedResult = {
      publicKeys: ['publicKey1', 'publicKey2'],
      predicate: 'keys-all',
    };
    expect(result).toStrictEqual(expectedResult);
  });

  it('should return error when account is not on chain', async () => {
    const realProcess = process;
    const exitMock = vi.fn();
    global.process = { ...realProcess, exit: exitMock };
    server.use(
      http.post(
        'https://localhost:8080/chainweb/0.0/fast-development/chain/1/pact/api/v1/local',
        () => {
          return HttpResponse.json({ error: 'row not found' }, { status: 404 });
        },
      ),
    );
    await getAccountDetailsFromChain(
      'k:accountName',
      'fast-development',
      '1',
      'https://localhost:8080',
    );
    expect(exitMock).toHaveBeenCalledWith(1);
    global.process = realProcess;
  });
});

describe('compareAndUpdateConfig', () => {
  beforeEach(() => {
    vi.mock('@inquirer/prompts', () => ({
      select: vi.fn().mockResolvedValue('userInput'),
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const userInputConfig: IAddAccountManualConfig = {
    ...defaultConfig,
    publicKeysConfig: ['publicKey1', 'publicKey2'],
  };

  const accountDetails = {
    publicKeys: ['publicKey1', 'publicKey2'],
    predicate: 'keys-all' as Predicate,
  };
  it('should return userInput config when public keys are same', async () => {
    const result = await compareAndUpdateConfig(
      userInputConfig,
      accountDetails,
    );
    expect(result).toStrictEqual(userInputConfig);
  });

  it('should return userInput config when public keys are same, predicate is different and user selects add anyway', async () => {
    vi.spyOn(inquirerPrompts, 'select').mockResolvedValue('userInput');
    const result = await compareAndUpdateConfig(userInputConfig, {
      ...accountDetails,
      predicate: 'keys-any',
    });
    expect(result).toEqual(userInputConfig);
  });

  it('should return userInput config with accountDetails when public keys and predicate are different and user selects add with values from chain', async () => {
    vi.spyOn(inquirerPrompts, 'select').mockResolvedValue('chain');
    const result = await compareAndUpdateConfig(userInputConfig, {
      ...accountDetails,
      predicate: 'keys-any',
    });
    expect(result).toEqual({
      ...userInputConfig,
      predicate: 'keys-any',
      publicKeysConfig: accountDetails.publicKeys,
    });
  });
});

describe('createAccount', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('should return account name when account is created', async () => {
    const inputConfig = {
      ...defaultConfig,
      publicKeysConfig: ['publicKey1', 'publicKey2'],
    };
    const result = await createAccount(inputConfig);
    expect(result).toStrictEqual({
      ...inputConfig,
      accountName: 'w:FxlQEvb6qHb50NClEnpwbT2uoJHuAu39GTSwXmASH2k:keys-all',
    });
  });

  it('should exit when account is empty', async () => {
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local',
        async () => {
          return HttpResponse.json(
            {
              result: {
                data: '',
                status: 'success',
              },
            },
            { status: 200 },
          );
        },
      ),
    );
    const realProcess = process;
    const exitMock = vi.fn();
    global.process = { ...realProcess, exit: exitMock };
    const inputConfig = {
      ...defaultConfig,
      publicKeysConfig: ['publicKey1', 'publicKey2'],
    };
    await createAccount(inputConfig);
    expect(exitMock).toHaveBeenCalledWith(1);
    global.process = realProcess;
  });
});

describe('writeInConfigFile', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  const root = path.join(__dirname, '../../../../');
  it('should write in config file', async () => {
    const config = {
      ...defaultConfig,
      accountAlias: 'unit-test-alias',
      accountName: 'accountName',
    };
    const filePath = path.join(
      root,
      defaultAccountPath,
      `${config.accountAlias}.yaml`,
    );
    const fs = services.filesystem;
    // To start fresh delete the file if it exists
    // eslint-disable-next-line no-unused-expressions
    (await fs.fileExists(filePath)) && (await fs.deleteFile(filePath));
    expect(await fs.fileExists(filePath)).toBe(false);
    await writeConfigInFile(filePath, config);
    const fileContent = await fs.readFile(filePath);
    expect(fileContent).toBe(yaml.dump({
      name: config.accountName,
      fungible: config.fungible,
      publicKeys: config.publicKeysConfig.filter((key: string) => !!key),
      predicate: config.predicate,
    }));
    expect(await fs.fileExists(filePath)).toBe(true);
  });

  it('should exit when file already exists', async () => {
    const config = {
      ...defaultConfig,
      accountAlias: 'unit-test-alias',
      accountName: 'accountName',
    };
    const realProcess = process;
    const exitMock = vi.fn();
    global.process = { ...realProcess, exit: exitMock };
    const filePath = path.join(
      root,
      defaultAccountPath,
      `${config.accountAlias}.yaml`,
    );
    const fs = services.filesystem;
    // Create a file before writing
    await fs.writeFile(filePath, 'test');
    expect(await fs.fileExists(filePath)).toBe(true);
    await writeConfigInFile(filePath, config);
    expect(exitMock).toHaveBeenCalledWith(1);
    global.process = realProcess;
    await fs.deleteFile(filePath);
  });
});

describe('validateAccountDetails', () => {
  afterEach(() => {
    server.resetHandlers();
  });
  it('should return config with account details from chain when config account name is empty', async () => {
    const config = {
      ...defaultConfig,
      publicKeysConfig: ['publicKey1', 'publicKey2'],
      accountName: '',
    };
    const result = await validateAccountDetails(config);
    expect(result).toEqual({
      ...config,
      accountName: 'w:FxlQEvb6qHb50NClEnpwbT2uoJHuAu39GTSwXmASH2k:keys-all',
    });
  });

  it('should return updated config when account name is passed and userInput config and account details are same', async () => {
    const config = {
      ...defaultConfig,
      publicKeysConfig: ['publicKey1', 'publicKey2'],
      accountName: 'accountName',
    };

    const result = await validateAccountDetails(config);
    expect(result).toEqual(config);
  });
});
