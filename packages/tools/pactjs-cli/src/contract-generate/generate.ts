import {
  FileContractDefinition,
  generateDts,
  generateDts2,
  pactParser,
  StringContractDefinition,
} from '@kadena/pactjs-generator';

import { retrieveContractFromChain } from '../utils/retrieveContractFromChain';

import { IContractGenerateOptions } from './';

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

async function generatorV1(
  args: IContractGenerateOptions,
  program: Command,
): Promise<Map<string, string>> {
  let pactModule;
  if (args.contract) {
    console.log(`Generating Pact contract from ${args.contract}`);
    const [contract] = args.contract;

    const pactCode = await retrieveContractFromChain(
      contract,
      args.api!,
      args.chain!,
      args.network!,
    );

    if (pactCode === undefined || pactCode.length === 0) {
      program.error('Could not retrieve contract from chain');
    }

    // if contract is namespaced, use the first part as the namespace
    const namespace = contract.includes('.')
      ? contract.split('.')[0]
      : undefined;

    pactModule = new StringContractDefinition({
      contract: pactCode,
      namespace,
    });
  } else {
    const [file] = args.file!;
    console.log(`Generating Pact contract from ${file}`);
    pactModule = new FileContractDefinition({
      path: join(process.cwd(), file!),
    });
  }

  const moduleDtss: Map<string, string> = generateDts(
    pactModule.modulesWithFunctions,
    args.capsInterface,
  );
  return moduleDtss;
}

async function generatorV2(
  args: IContractGenerateOptions,
): Promise<Map<string, string>> {
  if (args.contract !== undefined) {
    console.log(
      `Generating pact contracts from chainweb for ${args.contract.join(',')}`,
    );
  }

  if (args.file !== undefined) {
    console.log(
      `Generating pact contracts from files for ${args.file.join(',')}`,
    );
  }

  const getContract = async (name: string): Promise<string> => {
    console.log('fetching', name);
    if (
      args.api !== undefined &&
      args.chain !== undefined &&
      args.network !== undefined
    ) {
      const content = await retrieveContractFromChain(
        name,
        args.api,
        args.chain,
        args.network,
      );
      return content ?? '';
    }
    console.log(`
      the generator tries to fetch ${name} from the blockchain but the api data is not presented.
      this happen because ${name} mentioned via --contracts directly or it is a dependency of a module.
      the scrip skips this module
      `);
    return '';
  };

  const files: string[] =
    args.file === undefined
      ? []
      : args.file.map((file) =>
          readFileSync(join(process.cwd(), file), 'utf-8'),
        );

  const modules = await pactParser({
    contractNames: args.contract,
    files,
    getContract,
  });

  const moduleDtss = new Map();

  Object.keys(modules).map((name) => {
    moduleDtss.set(name, generateDts2(name, modules));
  });

  return moduleDtss;
}

interface IGenerate {
  (program: Command, version: string): (args: IContractGenerateOptions) => void;
}
export const generate: IGenerate = (program, version) => async (args) => {
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
    return;
  }

  const moduleDtss = await (args.typeVersion === 1
    ? generatorV1(args, program)
    : generatorV2(args));

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
  const defaultPackageJsonPath: string = join(targetDirectory, 'package.json');

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
          author: `@kadena/pactjs-cli@${version}`,
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
