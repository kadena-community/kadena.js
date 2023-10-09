import { processZodErrors } from '../utils/processZodErrors';

import { CryptoService } from './utils/service';

import type { Command } from 'commander';

export interface IGenerateKeysOptions {}

export function generateKeys(program: Command, version: string): void {
  program
    .command('generate')
    .description('generate an HD-key or public-private key-pair')
    .action((args: IGenerateKeysOptions) => {
      try {
        // Use the CryptoService class
        const cryptoService = new CryptoService();

        // Now, you can use cryptoService methods
        const keyPair = cryptoService.generateKeyPairFromRandom();
        console.log(keyPair);

        // TODO: use @inquirer/prompts to interactively get missing flags
        // TODO: create zod validator
        // Options.parse(args);
      } catch (e) {
        processZodErrors(program, e, args);
      }

      // TODO: implement
      throw new Error('Not Implemented Yet');
    });
}
