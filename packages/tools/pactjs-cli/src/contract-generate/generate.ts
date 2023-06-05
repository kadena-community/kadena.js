import {
  FileContractDefinition,
  generateDts,
  generateDts2,
  IContractDefinition,
  pactParser,
  StringContractDefinition,
} from '@kadena/pactjs-generator';

import { retrieveContractFromChain } from '../utils/retrieveContractFromChain';

import { ContractGenerateOptions } from './';

import { Command } from 'commander';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import mkdirp from 'mkdirp';
import { dirname, join } from 'path';
import rimraf from 'rimraf';

export const TARGET_PACKAGE: '.kadena/pactjs-generated' =
  '.kadena/pactjs-generated' as const;

const shallowFindFile = (path: string, file: string): string | undefined => {
  while (!existsSync(join(path, file))) {
    path = join(path, '..');
    if (path === '/') {
      return;
    }
  }
  return join(path, file);
};

function verifyTsconfigTypings(
  tsconfigPath: string | undefined,
  program: Command,
): void {
  if (tsconfigPath === undefined || tsconfigPath.length === 0) {
    console.error('Could not find tsconfig.json, skipping types verification');
  } else {
    console.log(`\nVerifying tsconfig.json at \`${tsconfigPath}\``);
    const tsconfig: string = readFileSync(tsconfigPath, 'utf8');

    if (!tsconfig.includes('.kadena/pactjs-generated')) {
      console.log(
        `\n!!! WARNING: You have not added .kadena/pactjs-generated to tsconfig.json. Add it now.
{ "compilerOptions": { "types": [".kadena/pactjs-generated"] } }`,
      );
    }
  }
}

export const generate =
  (
    program: Command,
    version: string,
  ): ((args: ContractGenerateOptions) => void) =>
  async (args: ContractGenerateOptions) => {
    let pactModule: IContractDefinition | undefined = undefined;
    let moduleDtss: Map<string, string> | undefined = undefined;
    if (args.newParser && 'contract' in args) {
      console.log(`Generating Pact contract from ${args.contract}`);

      const getContract = async (name: string) => {
        console.log('fetching', name);
        const content = await retrieveContractFromChain(
          name,
          args.api,
          args.chain,
          args.network,
        );
        if (!content) {
          console.warn(name, 'return undefined');
        } else {
          console.log(name, 'length:', content.length);
        }
        return content || '';
      };

      const slags = args.contract.split('.');
      const namespace = slags.length === 2 ? slags[0] : '';

      const modules = await pactParser(args.contract, namespace, getContract);

      moduleDtss = new Map();
      moduleDtss.set(args.contract, generateDts2(args.contract, modules));
    } else if ('contract' in args) {
      console.log(`Generating Pact contract from ${args.contract}`);

      const pactCode = await retrieveContractFromChain(
        args.contract,
        args.api,
        args.chain,
        args.network,
      );

      if (pactCode === undefined || pactCode.length === 0) {
        program.error('Could not retrieve contract from chain');
      }

      // if contract is namespaced, use the first part as the namespace
      const namespace = args.contract.includes('.')
        ? args.contract.split('.')[0]
        : undefined;

      pactModule = new StringContractDefinition({
        contract: pactCode,
        namespace,
      });
    } else {
      console.log(`Generating Pact contract from ${args.file}`);
      pactModule = new FileContractDefinition({
        path: join(process.cwd(), args.file!),
      });
    }

    if (pactModule) {
      moduleDtss = generateDts(
        pactModule.modulesWithFunctions,
        args.capsInterface,
      );
    }

    if (!moduleDtss) {
      throw new Error('No module is generated');
    }

    // walk up in file tree from process.cwd() to get the package.json
    const targetPackageJson: string | undefined = shallowFindFile(
      process.cwd(),
      'package.json',
    );

    if (
      targetPackageJson === undefined ||
      targetPackageJson.length === 0 ||
      targetPackageJson === '/'
    ) {
      program.error('Could not find package.json');
    }

    console.log(`Using package.json at ${targetPackageJson}`);

    const targetDirectory: string = join(
      dirname(targetPackageJson),
      'node_modules',
      TARGET_PACKAGE,
    );

    if (args.clean === true) {
      console.log(`Cleaning ${targetDirectory}`);
      rimraf.sync(targetDirectory);
    }

    if (!existsSync(targetDirectory)) {
      console.log(`Creating directory ${targetDirectory}`);
      mkdirp.sync(targetDirectory);
    }

    moduleDtss.forEach((dts, moduleName) => {
      const targetFilePath: string = join(
        dirname(targetPackageJson),
        'node_modules',
        TARGET_PACKAGE,
        `${moduleName}.d.ts`,
      );

      // write dts to index.d.ts to file
      const indexPath: string = join(targetDirectory, 'index.d.ts');
      const exportStatement: string = `export * from './${moduleName}';`;

      // always overwrite existing file
      console.log(`Writing to new file ${targetFilePath}`);
      writeFileSync(targetFilePath, dts);

      // if indexPath exists, append export to existing file
      if (existsSync(indexPath)) {
        console.log(`Appending to existing file ${indexPath}`);
        const indexDts: string = readFileSync(indexPath, 'utf8');
        // Append the export to the file if it's not already there.
        if (!indexDts.includes(exportStatement)) {
          const separator = indexDts.endsWith('\n') ? '' : '\n';
          const newIndexDts = [indexDts, exportStatement].join(separator);
          writeFileSync(indexPath, newIndexDts);
        }
      } else {
        console.log(`Writing to new file ${indexPath}`);
        writeFileSync(indexPath, exportStatement);
      }
    });

    // write npm init to package.json
    const defaultPackageJsonPath: string = join(
      targetDirectory,
      'package.json',
    );

    // if exists, do nothing
    if (existsSync(defaultPackageJsonPath)) {
      console.log(`Package.json already exists at ${defaultPackageJsonPath}`);
    } else {
      // write default contents to package.json
      console.log(`Writing default package.json to ${defaultPackageJsonPath}`);
      writeFileSync(
        defaultPackageJsonPath,
        JSON.stringify(
          {
            name: TARGET_PACKAGE,
            version: version,
            description: 'TypeScript definitions for @kadena/client',
            types: 'index.d.ts',
            keywords: ['pact', 'contract', 'pactjs'],
            author: '@kadena/pactjs-cli@' + version,
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

    verifyTsconfigTypings(tsconfigPath, program);
  };
