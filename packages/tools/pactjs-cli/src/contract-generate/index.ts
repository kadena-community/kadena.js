import { FileContractDefinition, generateDts } from '@kadena/pactjs-generator';

import { Command } from 'commander';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import mkdirp from 'mkdirp';
import { dirname, join } from 'path';
import rimraf from 'rimraf';

const TARGET_PACKAGE: '.kadena/pactjs-generated' =
  '.kadena/pactjs-generated' as const;

interface IContractGenerateOptions {
  file: string;
  clean: boolean;
  capsInterface: string | undefined;
}

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

const generate =
  (
    program: Command,
    version: string,
  ): ((args: IContractGenerateOptions) => void) =>
  (args: IContractGenerateOptions) => {
    console.log(`Generating Pact contract from ${args.file}`);

    const pactModule: FileContractDefinition = new FileContractDefinition(
      join(process.cwd(), args.file!),
    );
    const moduleDtss: Map<string, string> = generateDts(
      pactModule.modulesWithFunctions,
      args.capsInterface,
    );

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

    if (args.clean) {
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
        writeFileSync(indexPath, indexDts + exportStatement);
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

export function contractGenerateCommand(
  program: Command,
  version: string,
): void {
  program
    .command('contract-generate')
    .description('Generate client based on a contract')
    .option('-c, --clean', 'Clean existing generated files')
    .option(
      '-i, --caps-interface',
      'Custom name for the interface of the caps. ' +
        'Can be used to create a type definition with a limited set of capabilities.',
    )
    .option('-f, --file <file>', 'Generate d.ts from Pact contract file')
    .action((args: IContractGenerateOptions) => {
      generate(program, version)(args);
    });
}
