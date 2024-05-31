import { join } from 'path';

import { generateDts, pactParser } from '@kadena/pactjs-generator';
import { services } from '../../../services/index.js';
import { createCommand } from '../../../utils/createCommand.js';
import { notEmpty } from '../../../utils/globalHelpers.js';
import { globalOptions } from '../../../utils/globalOptions.js';
import { log } from '../../../utils/logger.js';
import { typescriptOptions } from '../typescriptOptions.js';
import {
  TARGET_PACKAGE,
  findPackageJson,
  getTargetDirectory,
  prepareTargetDirectory,
} from '../utils/directories.js';
import { writeModulesJson } from '../utils/files.js';
import { retrieveContractFromChain } from '../utils/retrieveContractFromChain.js';
import { shallowFindFile } from '../utils/shallowFindFile.js';

export const typescriptGenerateCommand = createCommand(
  'generate',
  'Generate typescript definitions based on a smart contract',
  [
    typescriptOptions.typescriptClean(),
    typescriptOptions.typescriptCapsInterface(),
    typescriptOptions.typescriptFile(),
    typescriptOptions.typescriptContract(),
    typescriptOptions.typescriptNamespace(),
    globalOptions.network(),
    globalOptions.chainId(),
  ],
  async (option, { collect }) => {
    const config = await collect(option);
    log.debug('typescript-contract-generate:action', config);

    if (!config.typescriptFile === !config.typescriptContract) {
      log.error(`\nEither file or contract must be specified.\n`);
    }

    if (config.typescriptContractConfig.length > 0) {
      log.info(
        log.color.green(
          `Generating types for pact contracts from chainweb for ${config.typescriptContractConfig.join(
            ',',
          )}`,
        ),
      );
    }

    if (config.typescriptFileConfig.length > 0) {
      log.info(
        log.color.green(
          `Generating types for pact contracts from files for ${config.typescriptFileConfig.join(
            ',',
          )}`,
        ),
      );
    }

    const packageJson = await findPackageJson();

    log.info(log.color.green(`Using package.json at ${packageJson}.`));

    const targetDirectory = getTargetDirectory(packageJson);

    log.info(
      log.color.green(
        config.typescriptClean
          ? `Cleaning ${targetDirectory}.`
          : `Using directory ${targetDirectory}.`,
      ),
    );

    await prepareTargetDirectory(targetDirectory, !!config.typescriptClean);

    const getContract = async (name: string): Promise<string> => {
      log.info(log.color.green(`Fetching ${name}.`));

      const content = await retrieveContractFromChain(
        name,
        config.networkConfig.networkHost,
        config.networkConfig.networkId,
        config.chainId,
      );

      return content ?? '';
    };

    const files = (
      await Promise.all(
        config.typescriptFileConfig.map((file: string) =>
          services.filesystem.readFile(join(process.cwd(), file)),
        ),
      )
    ).filter(notEmpty);

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
        log.warning(
          `\n
            WARNING: No namespace found for module "${name}". You can pass --namespace as a fallback.
          \n`,
        );
      }
      moduleDtss.set(name, generateDts(modules[name]));
    });

    for (const [moduleName, dts] of moduleDtss) {
      const targetFilePath: string = join(
        targetDirectory,
        `${moduleName}.d.ts`,
      );

      // write dts to index.d.ts to file
      const indexPath: string = join(targetDirectory, 'index.d.ts');
      const exportStatement: string = `export * from './${moduleName}.js';`;

      // always overwrite existing file
      log.info(`Writing to new file ${targetFilePath}`);
      await services.filesystem.writeFile(targetFilePath, dts);

      // if indexPath exists, append export to existing file
      const indexDts = await services.filesystem.readFile(indexPath);
      if (indexDts !== null) {
        log.info(`Appending to existing file ${indexPath}`);
        // Append the export to the file if it's not already there.
        if (!indexDts.includes(exportStatement)) {
          const separator = indexDts.endsWith('\n') ? '' : '\n';
          const newIndexDts = [indexDts, exportStatement].join(separator);
          await services.filesystem.writeFile(indexPath, newIndexDts);
        }
      } else {
        log.info(`Writing to new file ${indexPath}`);
        await services.filesystem.writeFile(indexPath, exportStatement);
      }
    }

    log.info(log.color.green(`\nTypescript types have been generated.\n`));

    const defaultPackageJsonPath: string = join(
      targetDirectory,
      'package.json',
    );

    if (!(await services.filesystem.fileExists(defaultPackageJsonPath))) {
      log.info(
        log.color.green(
          `Writing default package.json to ${defaultPackageJsonPath}`,
        ),
      );
      await services.filesystem.writeFile(
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

    const tsconfigPath = await shallowFindFile(
      join(process.cwd()),
      'tsconfig.json',
    );

    if (tsconfigPath === undefined || tsconfigPath.length === 0) {
      log.warning(
        `\nCould not find tsconfig.json, skipping types verification.\n`,
      );
      return;
    }

    log.info(
      log.color.green(`\nVerifying tsconfig.json at \`${tsconfigPath}\``),
    );

    const tsconfig = await services.filesystem.readFile(tsconfigPath);

    if (tsconfig === null || !tsconfig.includes('.kadena/pactjs-generated')) {
      log.warning(
        `\n!!! WARNING: You have not added .kadena/pactjs-generated to tsconfig.json. Add it now.
{ "compilerOptions": { "types": [".kadena/pactjs-generated"] } }`,
      );
      return;
    }

    log.info(log.color.green(`\nThe tsconfig.json file is valid.\n`));
  },
);
