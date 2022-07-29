import { contractGenerateCommand } from './contract-generate';
import { templateGenerateCommand } from './template-generate';

import { program } from 'commander';

const packageJson: { version: string } = require('../package.json');

contractGenerateCommand(program, packageJson.version);
templateGenerateCommand(program, packageJson.version);

program
  .description('pactjs cli to create transactions for Kadena chainweb')
  .version(packageJson.version)
  .parse();
