import { generateDts, pactParser } from '@kadena/pactjs-generator';
import type { Command } from 'commander';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import mkdirp from 'mkdirp';
import { EOL } from 'os';
import { dirname, join } from 'path';
import * as prettier from 'prettier';
import rimraf from 'rimraf';

import { retrieveContractFromChain } from '../utils/retrieveContractFromChain';
import type { IContractGenerateOptions } from './';
export const TARGET_PACKAGE: '.kadena/pactjs-generated' =
  '.kadena/pactjs-generated' as const;

const packageJson: { version: string } = require('../../package.json');

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

async function generator(
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
    namespace: args.namespace,
  });

  if (typeof args.parseTreePath === 'string' && args.parseTreePath !== '') {
    writeFileSync(args.parseTreePath, JSON.stringify(modules, undefined, 2));
  }

  const moduleDtss = new Map();

  Object.keys(modules).map((name) => {
    if (['', undefined, null].includes(modules[name].namespace)) {
      console.log(
        `  WARNING: No namespace found for module "${name}". You can pass --namespace as a fallback.`,
      );
    }
    if (modules[name].functions === undefined) {
      console.log(
        `  WARNING: No functions found for module "${name}". This module will be skipped.`,
      );
      return;
    }
    moduleDtss.set(name, generateDts(modules[name]));
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

  const moduleDtss = await generator(args);

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

  const indexPath: string = join(targetDirectory, 'index.d.ts');

  await Promise.all(
    [...moduleDtss].map(async ([moduleName, dtsContent]) => {
      const targetFilePath: string = join(
        dirname(targetPackageJson),
        'node_modules',
        TARGET_PACKAGE,
        `${moduleName}.d.ts`,
      );

      const formatted = await prettier.format(dtsContent, {
        parser: 'typescript',
      });
      // always overwrite existing file
      await writeFile(targetFilePath, formatted);
    }),
  );

  // if indexPath exists, append export to existing file otherwise create new file
  const indexDts: string = existsSync(indexPath)
    ? readFileSync(indexPath, 'utf8')
    : '';

  const importedFiles = (indexDts || '')
    .split(/(\r?\n)|;/)
    // convert "export * from" to "import" due to a bugfix in pactjs-generator
    .map((line) => line?.replace(/export\s*\*\s*from/, 'import'))
    // extract imported file names
    .map((line) => {
      const matches = line?.match(/^\s*import\s*[\'\"]\.\/(.*)[\'\"]/);
      return matches ? matches[1] : '';
    })
    // remove duplicates
    .filter(
      (fileName, idx, list) => fileName && list.indexOf(fileName) === idx,
    );

  for (const moduleName of moduleDtss.keys()) {
    if (!importedFiles.includes(moduleName)) {
      importedFiles.push(moduleName);
    }
  }

  const doNotEdit = `/**${EOL} * THIS FILE IS GENERATED BY pactjs-cli (${packageJson.version}). DO NOT EDIT IT${EOL} */`;

  // add doNotEdit comment to index.d.ts
  const updatedIndexDts = `${doNotEdit}\n${importedFiles
    .sort()
    .map((moduleName) => `import './${moduleName}';`)
    .join('')}`;

  writeFileSync(
    indexPath,
    await prettier.format(updatedIndexDts, {
      parser: 'typescript',
    }),
  );

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
