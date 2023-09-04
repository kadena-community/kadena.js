import { retrieveContractFromChain } from '../typescript/utils/retrieveContractFromChain';

import { TOptions } from './retrieve';

import { Command } from 'commander';
import { writeFileSync } from 'fs';
import { join } from 'path';

export function retrieveContract(
  __program: Command,
  __version: string,
): (args: TOptions) => Promise<void> {
  return async function action({ module, out, network, chain, api }: TOptions) {
    const code = await retrieveContractFromChain(module, api, chain, network);

    if (code !== undefined && code.length !== 0) {
      writeFileSync(join(process.cwd(), out), code, 'utf8');
    }
  };
}
