import chalk from 'chalk';
import yaml from 'js-yaml';
import { select } from '@inquirer/prompts';
import { details } from '@kadena/client-utils/coin';
import { createPrincipal } from '@kadena/client-utils/built-in';

import { services } from '../../services/index.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function writeAlias(config: any, filePath: string): Promise<void> {
  await services.filesystem.ensureDirectoryExists(filePath);
  await services.filesystem.writeFile(filePath, yaml.dump(config));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAccountDetails(config: any): Promise<void> {
  try {
    const accountDetails = await details(
      config.accountName,
      config.networkConfig.networkId,
      config.chainId,
      config.networkConfig.networkHost,
    );
    const {
      guard: { keys = [], pred: storedPred } = {}
    } = accountDetails as { guard: { keys: string[], pred: string } };

    const publicKeys = config.publicKeysConfig.filter((key: string) => !!key);

    const hasSamePublicKeysLength = publicKeys.length === keys.length;

    const isSameKeys = publicKeys.length === 0
      ? true
      : hasSamePublicKeysLength && keys.every((key) => publicKeys.includes(key));

    if (!isSameKeys || config.predicate !== storedPred) {
      const updateOption = await select({
        message: 'The account details do not match the account details on the chain. Do you want to continue?',
        choices: [
          { value: 'userInput', name: 'Add, anyway with user inputs' },
          { value: 'chain', name: 'Add with values from the chain' },
        ],
      });

      if (updateOption === 'userInput') {
        return config;
      } else {
        Object.assign(config, {
          publicKeys: keys,
          predicate: storedPred,
        });
        return config;
      }
    } else {
      return config;
    }
  } catch (e) {
    if(e.message?.includes('row not found') === true) {
      console.log(chalk.red(`The account is not on chain yet. To create it on-chain, transfer funds to it from ${config.network} and use "fund" command).`));
      process.exit(1);
    }
    console.log(chalk.red('There was an error getting the account details. Please try again.'));
    process.exit(1);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAccountName(config: any): Promise<string | undefined> {
  const publicKeys = config.publicKeysConfig.filter((key: string) => !!key);

  if(publicKeys.length === 0) {
    console.log(chalk.red('No public keys provided. Please provide at least one public key.'));
    return;
  }

  if(config.predicate === undefined || config.predicate === '' || config.predicate === null) {
    console.log(chalk.red('No predicate provided. Please provide a predicate.'));
    return;
  }

  const accountName = publicKeys.length === 1
    ? `k:${publicKeys[0]}`
    : await createPrincipal({
        keyset: {
          pred: config.predicate,
          keys: publicKeys,
        }
      }, {
        host: config.networkConfig.networkHost,
        defaults: {
          networkId: config.networkConfig.networkId,
          meta: {
            chainId: config.chainId,
          }
        }
      });

  return accountName;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createAccount(config: any): Promise<void> {
  const accountName = await getAccountName(config);
  if(accountName !== undefined && accountName !== '' && accountName !== null) {
    Object.assign(config, { accountName });
  } else {
    console.log(chalk.red('There was an error creating the account. Please try again.'));
    return;
  }
  return checkAccountDetails(config);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function checkAccountDetails(config: any): Promise<void> {
  if(config.accountName !== undefined && config.accountName !== '' && config.accountName !== null) {
    return getAccountDetails(config);
  }
  else {
    return createAccount(config);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleExistingAccount(filePath: string, config: any): Promise<void> {
  if (await services.filesystem.fileExists(filePath)) {
    console.log(
      chalk.yellow(
        `\nThe existing account configuration "${config.accountAlias}" will not be updated.\n`,
      ),
    );
    return;
  }

  await writeAlias(config, filePath);
  console.log(
    chalk.green(
      `\nThe account configuration "${config.accountAlias}" has been saved.\n`,
    ),
  );
}
