import chalk from 'chalk';
import type { Command } from 'commander';
import { z } from 'zod';
import type { GlobalOptions } from './helpers.js';
import { collectResponses } from './helpers.js';

const formatLength: 80 = 80;
const formatConfig = (key: string, value?: string | number): string => {
  const valueDisplay =
    value !== undefined && value.toString().trim() !== ''
      ? chalk.green(value.toString())
      : chalk.red('Not Set');
  const keyValue = `${key}: ${valueDisplay}`;
  const remainingWidth =
    formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
  return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createCommand<
  T extends ReturnType<GlobalOptions[keyof GlobalOptions]>[],
>(
  name: string,
  description: string,
  options: T,
  action: (finalConfig: Record<any, any>) => any,
) {
  return (program: Command, version: string) => {
    const command = program.command(name).description(description);

    options.forEach((option) => {
      command.addOption(option.option);
    });

    command.action(async (args, ...rest) => {
      try {
        // collectResponses
        const questionsMap = options.map(({ prompt, key }) => ({
          key,
          prompt,
        }));
        const responses = await collectResponses(args, questionsMap);
        const newArgs = { ...args, ...responses };

        console.log(
          `executing: kadena ${program.name()} ${name} ${Object.getOwnPropertyNames(
            newArgs,
          )
            .map((arg) => `--${arg} ${newArgs[arg]}`)
            .join(' ')}`,
        );

        // zod validation
        const zodValidationObject = options.reduce(
          (zObject, { key, validation }) => {
            zObject[key] = validation;
            return zObject;
          },
          {} as Record<string, any>,
        );

        z.object(zodValidationObject).parse(newArgs);

        // const config =  getFullConfigFromArgs(newArgs)
        const config = { ...newArgs };
        options.forEach((option) => {
          if ('expand' in option) {
            // write expanded config to <argName>Config
            config[`${option.key}Config`] = option.expand(args[option.key]);
          }
        });

        Object.getOwnPropertyNames(config).forEach((key) => {
          const value = config[key];
          const isObject = typeof value === 'object';
          console.log(
            formatConfig(key, isObject ? JSON.stringify(value) : value),
          );
        });
        // execute action with config
        await action(config);
      } catch (error) {
        console.error(error);
        console.error(chalk.red(`Error executing command ${name}: ${error})`));
        process.exit(1);
      }
    });
  };
}
