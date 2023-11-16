import { input } from '@inquirer/prompts';
import type { ChainId } from '@kadena/types';

export const chainIdPrompt = async (): Promise<ChainId> =>
  (await input({ message: 'Enter chainId (0-19)' })) as ChainId;
