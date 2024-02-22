import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaDecrypt, kadenaGenKeypairFromSeed } from '@kadena/hd-wallet';
import { kadenaGenKeypair } from '@kadena/hd-wallet/chainweaver';
import { toHexStr } from '../../keys/utils/keysHelpers.js';
import type { IKeyPair } from '../../keys/utils/storage.js';

export interface IKeysConfig {
  keyGenFromChoice: string;
  keyAlias: string;
  walletName?: EncryptedString;
  keyMnemonic?: string;
  securityPassword: string;
  keyAmount?: number;
  legacy?: boolean;
  keyIndexOrRange?: number | [number, number];
}

function validateKeyGenChoice(config: IKeysConfig): void {
  const validChoices = [
    'genPublicKey',
    'genPublicSecretKey',
    'genPublicSecretKeyDec',
  ];
  if (!validChoices.includes(config.keyGenFromChoice)) {
    throw new Error('Invalid choice');
  }
}

export async function generateFromWallet(
  config: IKeysConfig,
  showSecretKey: boolean = false,
): Promise<IKeyPair[]> {
  validateKeyGenChoice(config);
  return handlePublicSecretKeysFrom(config, showSecretKey);
}

async function handlePublicSecretKeysFrom(
  config: IKeysConfig,
  showSecretKey: boolean = false,
): Promise<IKeyPair[]> {
  validateConfigForSecretKeyGeneration(config);
  const indexOrRange = determineIndexOrRange(config);
  return generateKeyPairs(config, indexOrRange, showSecretKey);
}

function validateConfigForSecretKeyGeneration(config: IKeysConfig): void {
  if (!config.walletName) {
    throw new Error('Wallet is required for this option.');
  }
  if (
    config.keyGenFromChoice === 'genPublicSecretKeyDec' &&
    config.legacy === true
  ) {
    throw new Error(
      'Decryption of secret key is not supported for legacy wallets.',
    );
  }
}

function determineIndexOrRange(config: IKeysConfig): number | [number, number] {
  if (config.keyIndexOrRange !== undefined) {
    return config.keyIndexOrRange;
  } else if (config.keyAmount !== undefined && config.keyAmount > 0) {
    return [0, config.keyAmount - 1]; // Generate keys from index 0 to (keyAmount - 1)
  }
  // def: generate a single key at index 0
  return 0;
}

async function generateKeyPairs(
  config: IKeysConfig,
  indexOrRange: number | [number, number],
  showSecretKey: boolean,
): Promise<IKeyPair[]> {
  const keyPairs: IKeyPair[] = [];

  // amount
  if (config.keyAmount !== undefined && config.keyAmount > 0) {
    for (let i = 0; i < config.keyAmount; i++) {
      keyPairs.push(await generateSingleKeyPair(config, i, showSecretKey));
    }
  }
  // index
  else if (typeof indexOrRange === 'number') {
    keyPairs.push(
      await generateSingleKeyPair(config, indexOrRange, showSecretKey),
    );
  }
  // range
  else if (Array.isArray(indexOrRange)) {
    const [start, end] = indexOrRange;
    for (let i = start; i <= end; i++) {
      keyPairs.push(await generateSingleKeyPair(config, i, showSecretKey));
    }
  }

  return keyPairs;
}

async function generateSingleKeyPair(
  config: IKeysConfig,
  index: number,
  showSecretKey: boolean,
): Promise<IKeyPair> {
  let publicKey: string;
  let secretKey: string | undefined;

  const walletName = config.walletName as EncryptedString;

  if (config.legacy === true) {
    const { publicKey: _publicKey, secretKey: _secretKey } =
      await kadenaGenKeypair(config.securityPassword, walletName, index);
    publicKey = _publicKey;
    secretKey = _secretKey;
  } else {
    const [publicKeyString, secretKeyString] = await kadenaGenKeypairFromSeed(
      config.securityPassword,
      walletName,
      index,
    );
    publicKey = publicKeyString;
    secretKey =
      config.keyGenFromChoice === 'genPublicSecretKeyDec'
        ? toHexStr(
            await kadenaDecrypt(config.securityPassword, secretKeyString),
          )
        : secretKeyString;
  }

  return {
    publicKey,
    ...(showSecretKey && { secretKey }),
  };
}
