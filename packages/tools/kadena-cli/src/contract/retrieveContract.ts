import type { ChainId } from '@kadena/types';
import { retrieveContractFromChain } from '../typescript/utils/retrieveContractFromChain.js';

import type { TOptions } from './retrieveCommand.js';

import type { Command } from 'commander';
import { join } from 'path';
import { services } from '../services/index.js';

export function retrieveContract(
  __program: Command,
  __version: string,
): (args: TOptions) => Promise<void> {
  return async function action({ module, out, network, chain, api }: TOptions) {
    const code = await retrieveContractFromChain(
      module,
      api,
      network,
      chain as unknown as ChainId,
    );

    if (code !== undefined && code.length !== 0) {
      await services.filesystem.writeFile(join(process.cwd(), out), code);
    }
  };
}
