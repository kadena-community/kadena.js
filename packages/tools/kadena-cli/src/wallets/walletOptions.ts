import { Option } from 'commander';
import { z } from 'zod';
import { getWallet } from '../keys/utils/keysHelpers.js';
import { keys, wallets } from '../prompts/index.js';
import { createOption } from '../utils/createOption.js';

export const walletOptions = {
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
      return walletName === 'all' ? null : await getWallet(walletName);
    },
  }),
  keyMnemonic: createOption({
    key: 'keyMnemonic' as const,
    prompt: keys.keyMnemonicPrompt,
    validation: z.string(),
    option: new Option(
      '-m, --key-mnemonic <keyMnemonic>',
      'Enter your 12-word mnemonic phrase to generate keys from',
    ),
  }),
};
