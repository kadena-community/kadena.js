import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaGenKeypairFromSeed } from '@kadena/hd-wallet';
import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { displayGeneratedHdKeys } from '../utils/keysDisplay.js';

interface IConfig {
  keyGenFromHdChoice: string;
  keyPassword: string;
  keySeed?: string;
  keyAmount?: number;
}
interface IKeyPair {
  publicKey: string;
  privateKey?: string;
  filename?: string;
}

const defaultAmount: number = 1;

async function generateFromHd(
  config: IConfig,
): Promise<
  Array<{ publicKey: string; privateKey?: string; filename?: string }>
> {
  let keys = [];
  switch (config.keyGenFromHdChoice) {
    case 'genPublicKeyFromHDKey':
      keys = await handlePublicPrivateKeysFromHDKey(config);
      break;
    case 'genPublicPrivateKeysFromHDKey':
      keys = await handlePublicPrivateKeysFromHDKey(config, true);
      break;
    default:
      throw new Error('Invalid choice');
  }
  return keys;
}

async function handlePublicPrivateKeysFromHDKey(
  config: IConfig,
  showPrivateKey: boolean = false,
): Promise<
  Array<{ publicKey: string; privateKey?: string; filename?: string }>
> {
  const keys: Array<IKeyPair> = [];

  if (config.keySeed !== undefined) {
    const amount =
      config.keyAmount !== undefined ? config.keyAmount : defaultAmount;
    for (let index = 0; index < amount; index++) {
      const [publicKey, encryptedPrivateKey] = await kadenaGenKeypairFromSeed(
        config.keyPassword,
        config.keySeed as EncryptedString,
        index,
      );

      const keyPair = {
        publicKey,
        filename: `key_pair_${index}.yaml`,
      } as IKeyPair;

      if (showPrivateKey) {
        keyPair.privateKey = encryptedPrivateKey;
      }

      keys.push(keyPair);
    }
  } else {
    throw new Error('Seed is required for this option.');
  }
  return keys;
}

export const createGenerateFromHdCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'genfromhd',
  'Generate key(s) from HD key',
  [
    globalOptions.keyAmount({ isOptional: true }),
    globalOptions.keySeed(),
    globalOptions.keyPassword(),
    globalOptions.keyFilename({ isOptional: true }),
    globalOptions.keyGenFromHdChoice(),
  ],
  async (config) => {
    debug('generate-from-hid:action')({ config });
    try {
      const keys = await generateFromHd(config as IConfig);
      console.log(keys);
      displayGeneratedHdKeys(keys);
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : error}`);
    }
  },
);
