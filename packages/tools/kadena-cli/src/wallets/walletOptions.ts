import { Option } from 'commander';
import { z } from 'zod';
import { keys, wallets } from '../prompts/index.js';
import { services } from '../services/index.js';
import { createOption } from '../utils/createOption.js';
import { mnemonicPromptTransform } from '../utils/helpers.js';

export const walletOptions = {
  createWalletConfirmation: createOption({
    key: 'createWallet' as const,
    prompt: wallets.createWalletPrompt,
    defaultIsOptional: false,
    validation: z.string(),
    option: new Option(
      '-c --create-wallet <createWallet>',
      'Confirmation for creating a new wallet',
    ),
  }),
  walletName: createOption({
    key: 'walletName' as const,
    prompt: wallets.walletNamePrompt,
    validation: z.string(),
    option: new Option(
      '-w, --wallet-name <walletName>',
      'Enter you wallet name',
    ),
  }),
  walletNameSelectWithAll: createOption({
    key: 'walletName',
    prompt: wallets.walletSelectAllPrompt,
    validation: z.string(),
    option: new Option('-w, --wallet-name <walletName>', 'Enter your wallet'),
    defaultIsOptional: false,
    expand: async (walletName: string) => {
      return walletName === 'all'
        ? await services.wallet.list()
        : await services.wallet.getByAlias(walletName);
    },
  }),
  mnemonicFile: createOption({
    key: 'mnemonicFile' as const,
    prompt: keys.keyMnemonicPrompt,
    validation: z.literal('-').or(z.object({ _secret: z.string() })),
    option: new Option(
      '-m, --mnemonic-file <mnemonicFile>',
      'Filepath to your 12-word mnemonic phrase file to generate keys from (can be passed via stdin)',
    ),
    transform: mnemonicPromptTransform('--mnemonic-file'),
  }),
  createAccount: createOption({
    key: 'createAccount' as const,
    prompt: keys.walletCreateAccountPrompt,
    validation: z.string(),
    option: new Option(
      '-c, --create-account <createAccount>',
      'Create an account using the first wallet key',
    ),
  }),
  amount: createOption({
    key: 'amount' as const,
    prompt: keys.walletGenerateKeyAmountPrompt,
    validation: z.string(),
    option: new Option(
      '-n, --amount <amount>',
      'Amount of keys to generate (default: 1)',
    ),
  }),
  startIndex: createOption({
    key: 'startIndex' as const,
    prompt: () => '1',
    validation: z.string(),
    option: new Option(
      '-i, --start-index <startIndex>',
      'Index to start generating keys at',
    ),
  }),
  keyAlias: createOption({
    key: 'keyAlias' as const,
    prompt: keys.walletGenerateKeyAliasPrompt,
    validation: z.string().optional(),
    option: new Option(
      '-a, --key-alias <keyAlias>',
      'Optional alias for generated key(s)',
    ),
    transform: (value) => (value !== '' ? value : undefined),
  }),
  keyIndex: createOption({
    key: 'keyIndex' as const,
    prompt: keys.walletKeyIndex,
    validation: z.string(),
    option: new Option(
      '-i, --key-index <keyIndex>',
      'The key index of which you want to export the unencrypted keypair',
    ),
  }),
};
