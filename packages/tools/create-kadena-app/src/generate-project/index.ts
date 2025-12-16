import chalk from 'chalk';
import type { Command } from 'commander';
import spawn from 'cross-spawn';
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';

const log = console.log;

type ProjectTemplate = 'nextjs' | 'vuejs' | 'angular';

interface IGenerateProjectOptions {
  name: string;
  template: ProjectTemplate;
}

const SUPPORTED_PROJECT_TEMPLATES: Array<ProjectTemplate> = [
  'nextjs',
  'vuejs',
  'angular',
];

const COPY_FONTS_MAP: Record<ProjectTemplate, string> = {
  nextjs: 'src/styles/fonts',
  vuejs: 'src/assets/fonts',
  angular: 'src/assets/fonts',
};

const COPY_IGNORE_LIST: Array<string> = [
  '.next',
  'node_modules',
  'package-lock.json',
  '.pact-history',
];

const isValidProjectName = (name: string): boolean => {
  const pattern = /^(?!\.)([a-zA-Z0-9._-])+$/;
  return pattern.test(name);
};

const copyFolderSync = (from: string, to: string): void => {
  if (!existsSync(to)) mkdirSync(to);
  readdirSync(from).forEach((element) => {
    if (COPY_IGNORE_LIST.includes(element)) {
      return;
    }

    if (lstatSync(join(from, element)).isFile()) {
      copyFileSync(join(from, element), join(to, element));
    } else {
      copyFolderSync(join(from, element), join(to, element));
    }
  });
};

const executeCommand = (
  command: string,
  args: Array<string>,
  options = {},
): void => {
  const { status } = spawn.sync(command, args, {
    stdio: 'inherit',
    ...options,
  });

  if (status !== 0) {
    throw new Error(
      `${command} ${args.join(
        ' ',
      )} failed with exit code ${status}. Please check your console.`,
    );
  }
};

const generate =
  (
    program: Command,
    version: string,
    executionPath: string,
  ): ((args: IGenerateProjectOptions) => void) =>
  (args: IGenerateProjectOptions) => {
    log(
      chalk.blue(
        `Generating @kadena/client integrated starter project with ${args.template} template`,
      ),
    );

    const templateSourceDirectory: string = join(
      executionPath,
      `templates/${args.template}`,
    );

    const pactSourceDirectory: string = join(executionPath, 'pact');

    const targetDirectory: string = join(process.cwd(), args.name);

    // Validate target directory doesn't already exist
    if (existsSync(targetDirectory)) {
      program.error(`Directory "${args.name}" already exists!`);
    }

    // Copy template contents to target directory
    log(chalk.blue(`Creating project at ${targetDirectory}`));
    copyFolderSync(templateSourceDirectory, targetDirectory);

    // Copy Pact smart contracts to target directory
    log(chalk.blue('Creating smart contract ...'));
    copyFolderSync(pactSourceDirectory, join(targetDirectory, 'pact'));
    log(chalk.green('Smart contract created successfully!'));

    // Copy README.MD to target directory
    log(chalk.blue('Copying generic documentation ...'));
    copyFileSync(
      join(executionPath, 'templates/README.md'),
      join(targetDirectory, 'README.md'),
    );
    log(chalk.green('Documentation copied successfully!'));

    log(chalk.blue('Copying common client utils code ...'));
    copyFolderSync(
      join(templateSourceDirectory, '../common/utils'),
      join(targetDirectory, 'src/utils'),
    );
    log(chalk.green('Common client utils copied successfully!'));

    log(chalk.blue('Copying fonts ...'));
    copyFolderSync(
      join(templateSourceDirectory, '../common/fonts'),
      join(targetDirectory, COPY_FONTS_MAP[args.template]),
    );
    log(chalk.blue('Fonts copied successfully ...'));

    // Update package.json
    log(chalk.blue('Updating and formatting package.json ...'));
    const targetPackageJsonPath: string = join(targetDirectory, 'package.json');
    const targetPackageJson = JSON.parse(
      readFileSync(targetPackageJsonPath, 'utf8'),
    );

    writeFileSync(
      targetPackageJsonPath,
      JSON.stringify(
        {
          ...targetPackageJson,
          ...{
            name: args.name,
            version,
          },
        },
        null,
        2,
      ),
    );
    log(chalk.green('package.json updated and formatted successfully!'));

    // Installing dependencies
    log(chalk.blue.italic('Installing dependencies ...'));
    executeCommand('pnpm', ['install', '--reporter=silent'], {
      cwd: targetDirectory,
    });

    // Generating Pact types for demo contract
    log(chalk.magenta('Generating types for Pact smart contract'));
    executeCommand('pnpm', ['run', 'pactjs:generate:contracts'], {
      cwd: targetDirectory,
    });

    executeCommand('pnpm', ['run', 'format'], {
      cwd: targetDirectory,
    });

    log(chalk.green.bold(`${args.template} dapp created successfully!`));
  };

export function projectGenerateCommand(
  program: Command,
  version: string,
  executionPath: string,
): void {
  program
    .command('generate-project')
    .description('Generate starter project')
    .requiredOption('-n, --name <value>', 'Project name')
    .requiredOption('-t, --template <value>', 'Project template to use')
    .action((args: IGenerateProjectOptions) => {
      const { template, name } = args;

      if (!SUPPORTED_PROJECT_TEMPLATES.includes(template)) {
        program.error(
          `value "${template}" is invalid for option -t, --template. Allowed values are ${SUPPORTED_PROJECT_TEMPLATES.join(
            ', ',
          )}`,
        );
      }

      if (!isValidProjectName(name)) {
        program.error(`value "${name}" is an invalid project name`);
      }

      generate(program, version, executionPath)(args);
    });
}
