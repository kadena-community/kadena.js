import { kadenaKeyPairsFromRandom } from '@kadena/hd-wallet';
import { kadenaGenKeypair } from '@kadena/hd-wallet/chainweaver';
import chalk from 'chalk';
import type { Command } from 'commander';
import { randomBytes } from 'crypto';
import debug from 'debug';
import { PLAINKEY_EXT, PLAINKEY_LEGACY_EXT } from '../../constants/config.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { clearCLI } from '../../utils/helpers.js';
import { toHexStr } from '../utils/keysHelpers.js';
import * as storageService from '../utils/storage.js';

interface IKeyPair {
  publicKey: string;
  secretKey: string;
}

interface IGeneratePlainKeysCommandConfig {
  keyAlias?: string;
  keyAmount?: number;
  legacy?: boolean;
}

const defaultAmount: number = 1;

async function generateKeyPairs(
  config: IGeneratePlainKeysCommandConfig,
  amount: number,
): Promise<IKeyPair[]> {
  if (config.legacy === true) {
    return generateLegacyKeyPairs(amount);
  } else {
    return kadenaKeyPairsFromRandom(amount);
  }
}

async function generateLegacyKeyPairs(amount: number): Promise<IKeyPair[]> {
  const keyPairs = [];
  const password = '';
  const rootKey = randomBytes(128);

  for (let i = 0; i < amount; i++) {
    const [encryptedSecret, publicKey] = await kadenaGenKeypair(
      password,
      rootKey,
      parseInt(amount as unknown as string, 10),
    );
    keyPairs.push({
      publicKey: toHexStr(encryptedSecret),
      secretKey: toHexStr(publicKey),
    });
  }

  return keyPairs;
}

function displayGeneratedKeys(
  plainKeyPairs: IKeyPair[],
  config: IGeneratePlainKeysCommandConfig,
): void {
  clearCLI(true);
  console.log(
    chalk.green(
      `Generated Plain Key Pair(s): ${JSON.stringify(plainKeyPairs, null, 2)}`,
    ),
  );

  if (config.keyAlias !== undefined && config.keyAlias !== '') {
    storageService.savePlainKeyByAlias(
      config.keyAlias,
      plainKeyPairs[0].publicKey,
      plainKeyPairs[0].secretKey,
      plainKeyPairs.length,
      config.legacy,
    );
    console.log(
      chalk.green(
        'The Plain Key Pair is stored within your keys folder under the filename(s):',
      ),
    );

    const ext: string =
      config.legacy === true ? PLAINKEY_LEGACY_EXT : PLAINKEY_EXT;
    plainKeyPairs.forEach((pair, index) => {
      const keyName =
        index === 0
          ? `${config.keyAlias}${ext}`
          : `${config.keyAlias}-${index}${ext}`;
      console.log(chalk.green(`- ${keyName}`));
    });
  }
}

export const createGeneratePlainKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'plain',
  'generate (plain) public-private key-pair',
  [
    globalOptions.keyAlias(),
    globalOptions.keyAmount(),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    debug('generate-plain-key:action')({ config });
    const amount =
      config.keyAmount !== undefined && config.keyAmount !== ''
        ? config.keyAmount
        : defaultAmount;
    const plainKeyPairs = await generateKeyPairs(config, amount);
    displayGeneratedKeys(plainKeyPairs, config);
  },
);
