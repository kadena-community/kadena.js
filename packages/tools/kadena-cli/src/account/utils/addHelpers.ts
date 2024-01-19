import { select } from '@inquirer/prompts';
import { createPrincipal } from '@kadena/client-utils/built-in';
import { details } from '@kadena/client-utils/coin';
import chalk from 'chalk';
import yaml from 'js-yaml';

import type { ChainId } from '@kadena/types';
import { services } from '../../services/index.js';
import type { IAddAccountManualConfig } from '../types.js';

export const isEmpty = (value?: string): boolean =>
  value === undefined || value === '' || value === null;

export async function writeAlias(
  config: IAddAccountManualConfig,
  filePath: string,
): Promise<void> {
  await services.filesystem.ensureDirectoryExists(filePath);
  await services.filesystem.writeFile(filePath, yaml.dump(config));
}

const validatePublicKeys = (
  publicKeysConfig: string[],
  keys: string[],
): boolean => {
  const publicKeys = publicKeysConfig.filter((key: string) => !!key);

  const hasSamePublicKeysLength = publicKeys.length === keys.length;

  return publicKeys.length === 0
    ? true
    : hasSamePublicKeysLength && keys.every((key) => publicKeys.includes(key));
};

interface IAccountDetailsResult {
  publicKeys: string[];
  predicate?: string;
}

export async function getAccountDetailsFromChain(
  accountName: string,
  networkId: string,
  chainId: string,
  networkHost: string,
): Promise<IAccountDetailsResult> {
  try {
    const accountDetails = await details(
      accountName,
      networkId,
      chainId as ChainId,
      networkHost,
    );
    const { guard: { keys = [], pred } = {} } = accountDetails as {
      guard: { keys: string[]; pred: string };
    };

    return {
      publicKeys: keys,
      predicate: pred,
    };
  } catch (e) {
    if (e.message?.includes('row not found') === true) {
      console.log(
        chalk.red(
          `The account ${accountName} is not on chain yet. To create it on-chain, transfer funds to it from ${networkId} and use "fund" command).`,
        ),
      );
      process.exit(1);
    }
    console.log(
      chalk.red(
        'There was an error getting the account details. Please try again.',
      ),
    );
    process.exit(1);
  }
}

export async function compareAndUpdateConfig(
  config: IAddAccountManualConfig,
  accountDetails: IAccountDetailsResult,
): Promise<IAddAccountManualConfig> {
  const { publicKeys, predicate } = accountDetails;
  const isSameKeys = validatePublicKeys(config.publicKeysConfig, publicKeys);

  if (!isSameKeys || config.predicate !== predicate) {
    const updateOption = await select({
      message:
        'The account details do not match the account details on the chain. Do you want to continue?',
      choices: [
        { value: 'userInput', name: 'Add, anyway with user inputs' },
        { value: 'chain', name: 'Add with values from the chain' },
      ],
    });

    if (updateOption === 'userInput') {
      return config;
    } else {
      Object.assign(config, {
        publicKeys,
        predicate,
      });
      return config;
    }
  } else {
    return config;
  }
}

export async function createAccountName(
  config: IAddAccountManualConfig,
): Promise<string | undefined> {
  const publicKeys = config.publicKeysConfig.filter((key: string) => !!key);

  if (publicKeys.length === 0) {
    console.log(
      chalk.red(
        'No public keys provided. Please provide at least one public key.',
      ),
    );
    return;
  }

  if (config.predicate === undefined || config.predicate === null) {
    console.log(
      chalk.red('No predicate provided. Please provide a predicate.'),
    );
    return;
  }

  try {
    const accountName = await createPrincipal(
      {
        keyset: {
          pred: config.predicate,
          keys: publicKeys,
        },
      },
      {
        host: config.networkConfig.networkHost,
        defaults: {
          networkId: config.networkConfig.networkId,
          meta: {
            chainId: config.chainId,
          },
        },
      },
    );

    return accountName;
  } catch (e) {
    console.log(
      chalk.red('There was an error creating the account. Please try again.'),
    );
    process.exit(1);
  }
}

export async function getAccountDetails(
  config: IAddAccountManualConfig,
): Promise<IAddAccountManualConfig> {
  const {
    accountName,
    chainId,
    networkConfig: { networkHost, networkId },
  } = config;

  const { publicKeys, predicate } = await getAccountDetailsFromChain(
    accountName as string,
    networkId,
    chainId,
    networkHost,
  );

  return compareAndUpdateConfig(config, {
    publicKeys,
    predicate,
  });
}

export async function createAccount(
  config: IAddAccountManualConfig,
): Promise<IAddAccountManualConfig> {
  const accountName = await createAccountName(config);
  if (isEmpty(accountName)) {
    console.log(
      chalk.red('There was an error creating the account. Please try again.'),
    );
    process.exit(1);
  }

  Object.assign(config, { accountName }) as IAddAccountManualConfig;
  return validateAccountDetails(config);
}

export async function validateAccountDetails(
  config: IAddAccountManualConfig,
): Promise<IAddAccountManualConfig> {
  const { accountName } = config;
  return isEmpty(accountName)
    ? createAccount(config)
    : getAccountDetails(config);
}

export async function validateConfigFileExistence(
  filePath: string,
): Promise<boolean> {
  if (await services.filesystem.fileExists(filePath)) {
    console.log(
      chalk.red(`\nThe account configuration "${filePath}" already exists.\n`),
    );
    return true;
  }
  return false;
}

export async function writeConfigInFile(
  filePath: string,
  config: IAddAccountManualConfig,
): Promise<void> {
  if (await validateConfigFileExistence(filePath)) {
    console.log(
      chalk.yellow(
        `\nThe existing account configuration "${config.accountAlias}" will not be updated.\n`,
      ),
    );
    process.exit(1);
  }

  await writeAlias(config, filePath);
  console.log(
    chalk.green(
      `\nThe account configuration "${config.accountAlias}" has been saved.\n`,
    ),
  );
}
