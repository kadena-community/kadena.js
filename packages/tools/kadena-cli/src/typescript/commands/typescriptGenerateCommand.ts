import debug from 'debug';
import { join } from 'path';

import { generateDts, pactParser } from '@kadena/pactjs-generator';
import chalk from 'chalk';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import type { CreateCommandReturnType } from '../../utils/createCommand.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import {
  TARGET_PACKAGE,
  findPackageJson,
  getTargetDirectory,
  prepareTargetDirectory,
} from '../utils/directories.js';
import { writeModulesJson } from '../utils/files.js';
import { retrieveContractFromChain } from '../utils/retrieveContractFromChain.js';
import { shallowFindFile } from '../utils/shallowFindFile.js';

export const typescriptGenerateCommand: CreateCommandReturnType = createCommand(
  'generate',
  'Generate typescript definitions based on a smart contract',
  [
    globalOptions.typescriptClean(),
    globalOptions.typescriptCapsInterface(),
    globalOptions.typescriptFile(),
    globalOptions.typescriptContract(),
    globalOptions.typescriptNamespace(),
    globalOptions.network(),
    globalOptions.chainId(),
  ],
  async (config) => {
    debug('typescript-contract-generate:action')({ config });

    if (!config.typescriptFile === !config.typescriptContract) {
      log.info(chalk.red(`\nEither file or contract must be specified.\n`));
    }

    if (config.typescriptContractConfig.length > 0) {
      log.info(
        chalk.green(
          `Generating types for pact contracts from chainweb for ${config.typescriptContractConfig.join(
            ',',
          )}`,
        ),
      );
    }

    if (config.typescriptFileConfig.length > 0) {
      log.info(
        chalk.green(
          `Generating types for pact contracts from files for ${config.typescriptFileConfig.join(
            ',',
          )}`,
        ),
      );
    }

    const packageJson = findPackageJson();

    log.info(chalk.green(`Using package.json at ${packageJson}.`));

    const targetDirectory = getTargetDirectory(packageJson);

    log.info(
      chalk.green(
        config.typescriptClean
          ? `Cleaning ${targetDirectory}.`
          : `Using directory ${targetDirectory}.`,
      ),
    );

    prepareTargetDirectory(targetDirectory, !!config.typescriptClean);

    const getContract = async (name: string): Promise<string> => {
      log.info(chalk.green(`Fetching ${name}.`));

      const content = await retrieveContractFromChain(
        name,
        config.networkConfig.networkHost,
        config.networkConfig.networkId,
        config.chainId,
      );

      return content ?? '';
    };

    const files: string[] = config.typescriptFileConfig.map((file: string) =>
      readFileSync(join(process.cwd(), file), 'utf-8'),
    );

    const modules = await pactParser({
      contractNames: config.typescriptContractConfig,
      files,
      getContract,
      namespace: config.typescriptNamespace,
    });

    writeModulesJson(JSON.stringify(modules, undefined, 2));

    const moduleDtss = new Map();

    Object.keys(modules).map((name) => {
      if (['', undefined, null].includes(modules[name].namespace)) {
        log.info(
          chalk.yellow(`\n
            WARNING: No namespace found for module "${name}". You can pass --namespace as a fallback.
          \n`),
        );
      }
      moduleDtss.set(name, generateDts(modules[name]));
    });

    moduleDtss.forEach((dts, moduleName) => {
      const targetFilePath: string = join(
        targetDirectory,
        `${moduleName}.d.ts`,
      );

      // write dts to index.d.ts to file
      const indexPath: string = join(targetDirectory, 'index.d.ts');
      const exportStatement: string = `export * from './${moduleName}.js';`;

      // always overwrite existing file
      log.info(`Writing to new file ${targetFilePath}`);
      writeFileSync(targetFilePath, dts);

      // if indexPath exists, append export to existing file
      if (existsSync(indexPath)) {
        log.info(`Appending to existing file ${indexPath}`);
        const indexDts: string = readFileSync(indexPath, 'utf8');
        // Append the export to the file if it's not already there.
        if (!indexDts.includes(exportStatement)) {
          const separator = indexDts.endsWith('\n') ? '' : '\n';
          const newIndexDts = [indexDts, exportStatement].join(separator);
          writeFileSync(indexPath, newIndexDts);
        }
      } else {
        log.info(`Writing to new file ${indexPath}`);
        writeFileSync(indexPath, exportStatement);
      }
    });

    log.info(chalk.green(`\nTypescript types have been generated.\n`));

    const defaultPackageJsonPath: string = join(
      targetDirectory,
      'package.json',
    );

    if (!existsSync(defaultPackageJsonPath)) {
      log.info(
        chalk.green(
          `Writing default package.json to ${defaultPackageJsonPath}`,
        ),
      );
      writeFileSync(
        defaultPackageJsonPath,
        JSON.stringify(
          {
            name: TARGET_PACKAGE,
            description: 'TypeScript definitions for @kadena/client',
            types: 'index.d.ts',
            keywords: ['pact', 'contract', 'pactjs'],
          },
          null,
          2,
        ),
      );
    }

    const tsconfigPath: string | undefined = shallowFindFile(
      join(process.cwd()),
      'tsconfig.json',
    );

    if (tsconfigPath === undefined || tsconfigPath.length === 0) {
      log.info(
        chalk.yellow(
          `\nCould not find tsconfig.json, skipping types verification.\n`,
        ),
      );
      return;
    }

    log.info(chalk.green(`\nVerifying tsconfig.json at \`${tsconfigPath}\``));

    const tsconfig: string = readFileSync(tsconfigPath, 'utf8');

    if (!tsconfig.includes('.kadena/pactjs-generated')) {
      log.info(
        chalk.yellow(
          `\n!!! WARNING: You have not added .kadena/pactjs-generated to tsconfig.json. Add it now.
{ "compilerOptions": { "types": [".kadena/pactjs-generated"] } }`,
        ),
      );
      return;
    }

    log.info(chalk.green(`\nThe tsconfig.json file is valid.\n`));
  },
);
