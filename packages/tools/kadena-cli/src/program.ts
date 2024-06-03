import { accountCommandFactory } from './commands/account/index.js';
import { configCommandFactory } from './commands/config/index.js';
// import { contractCommandFactory } from './contract/index.js';
import { dappCommandFactory } from './commands/dapp/index.js';
// import { devnetCommandFactory } from './devnet/index.js';
import { keysCommandFactory } from './commands/keys/index.js';
import { walletsCommandFactory } from './commands/wallets/index.js';
// import { marmaladeCommandFactory } from './marmalade/index.js';
import { networksCommandFactory } from './commands/networks/index.js';
import { txCommandFactory } from './commands/tx/index.js';
// import { typescriptCommandFactory } from './typescript/index.js';
import { versionCommand } from './commands/version/index.js';

import type { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { CLINAME } from './constants/config.js';

const packageJson: { version: string } = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

export function loadProgram(program: Command): Command {
  [
    configCommandFactory,
    networksCommandFactory,
    // devnetCommandFactory,
    walletsCommandFactory,
    keysCommandFactory,
    accountCommandFactory,
    txCommandFactory,
    // contractCommandFactory,
    // marmaladeCommandFactory,
    // typescriptCommandFactory,
    dappCommandFactory,
    versionCommand,
  ].forEach((fn) => {
    fn(program, packageJson.version);
  });

  program
    .name(CLINAME)
    .description("CLI to interact with Kadena and it's ecosystem")
    .version(packageJson.version, '-v, --version');

  program.addHelpText(
    'after',
    '\nGlobal options:\n' +
      '  --quiet                   Disables interactive prompts and skips confirmations\n' +
      '  --json                    Output command data in JSON format on stdout\n' +
      '  --yaml                    Output command data in YAML format on stdout',
  );

  return program;
}
