import { program } from 'commander';
import { readFileSync } from 'fs';
import { join } from 'path';
import { contractGenerateCommand } from './contract-generate';
import { retrieveContractCommand } from './retrieve-contract';
import { templateGenerateCommand } from './template-generate';

const packageJson: { version: string } = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8'),
);

contractGenerateCommand(program, packageJson.version);
templateGenerateCommand(program, packageJson.version);
retrieveContractCommand(program, packageJson.version);

program
  .description('pactjs cli to create transactions for Kadena chainweb')
  .version(packageJson.version)
  .parse();
