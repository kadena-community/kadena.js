import type { Command } from 'commander';
import { writeFileSync } from 'fs';
import { join } from 'path';
import type { TOptions } from '.';
import { retrieveContractFromChain } from '../utils/retrieveContractFromChain';

export function retrieveContract(
  program: Command,
  version: string,
): (args: TOptions) => Promise<void> {
  return async function action({ module, out, network, chain, api }: TOptions) {
    const code = await retrieveContractFromChain(module, api, chain, network);

    if (code !== undefined && code.length !== 0) {
      writeFileSync(join(process.cwd(), out), code, 'utf8');
    }
  };
}
