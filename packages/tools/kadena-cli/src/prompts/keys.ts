import { validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

import { parseKeyPairsInput } from '../keys/utils/keysHelpers.js';
import type { IWallet } from '../services/wallet/wallet.types.js';
import { isNumeric, isValidFilename } from '../utils/globalHelpers.js';
import { input, select } from '../utils/prompts.js';

export async function keyAliasPrompt(): Promise<string> {
  return await input({
    message: `Enter an alias for your key:`,
    validate: function (input) {
      if (!isValidFilename(input)) {
        return 'Alias must be alphanumeric! Please enter a valid name.';
      }
      return true;
    },
  });
}

export async function keyMnemonicPrompt(
  args: Record<string, unknown>,
): Promise<'-' | { _secret: string }> {
  if ((args.stdin as string | null) !== null) return '-';
  const secret = await input({
    message: `Enter your 12-word mnemonic phrase:`,
    validate: function (input) {
      const words = input
        .split(' ')
        .map((word) => word.trim())
        .filter((word) => word.length > 0);
      if (words.length !== 12) {
        return 'The mnemonic phrase must contain exactly 12 words.';
      }
      if (!validateMnemonic(input, wordlist)) {
        return 'Invalid mnemonic phrase. Please enter a valid 12-word mnemonic.';
      }
      return true;
    },
    transformer(input) {
      return input
        .split(' ')
        .map((word) => word.trim())
        .filter((word) => word.length > 0)
        .join(' ');
    },
  });
  return { _secret: secret };
}

export async function keyAmountPrompt(): Promise<string> {
  return await input({
    message: `Enter the amount of keys you want to generate. (alias-{amount} will increment) (default: 1)`,
    default: '1',
  });
}

export async function keyPairsPrompt(): Promise<string> {
  return await input({
    message: 'Enter key pairs as a string publicKey=xxx,secretKey=xxx;...',
    validate: function (input) {
      try {
        parseKeyPairsInput(input);
        return true;
      } catch (error) {
        return error.message;
      }
    },
  });
}

export async function walletCreateAccountPrompt(): Promise<string> {
  return await select({
    message: 'Create an account using the first wallet key?',
    choices: [
      { value: 'true', name: 'Yes' },
      { value: 'false', name: 'No' },
    ],
  });
}

export async function walletGenerateKeyAmountPrompt(): Promise<string> {
  return await input({
    message: 'Amount of keys to generate:',
    default: '1',
    validate(input) {
      if (!isNumeric(input)) {
        return 'Amount must be a number';
      }
      return true;
    },
  });
}

export async function walletGenerateKeyAliasPrompt(): Promise<
  string | undefined
> {
  return await input({
    message: 'Alias for the generated key (optional):',
  });
}

export async function walletKeyIndex(args: {
  wallet?: IWallet;
}): Promise<string> {
  if (!args.wallet) throw Error('walletKeyIndex called without wallet');
  return await select({
    message: 'Select a key index:',
    choices: args.wallet.keys.map((key, index) => ({
      value: index.toString(),
      name: `${index}: ${key.publicKey}`,
    })),
  });
}
