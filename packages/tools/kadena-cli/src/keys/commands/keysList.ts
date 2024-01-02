import type { Command } from 'commander';
import debug from 'debug';
import { createExternalPrompt } from '../../prompts/generic.js';
import { keyWalletSelectAllPrompt } from '../../prompts/keys.js';
import { createCommand } from '../../utils/createCommand.js';
import {
  displayAllWallets,
  displaySelectedWallet,
} from '../utils/keysDisplay.js';

export const createListKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand('list', 'list key(s)', [], async (config) => {
  debug('list-keys:action')({ config });

  const externalPrompt = createExternalPrompt({
    keyWalletSelectAllPrompt,
  });

  const selectedWallet = await externalPrompt.keyWalletSelectAllPrompt();
  if (selectedWallet === 'all') {
    await displayAllWallets();
    return;
  }
  await displaySelectedWallet(selectedWallet);
});
