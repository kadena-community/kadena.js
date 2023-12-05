import chalk from 'chalk';
import type { Command } from 'commander';
import { z } from 'zod';
import { CLIRootName } from '../constants/config.js';
import { displayConfig } from './createCommandDisplayHelper.js';
import type { GlobalOptions } from './globalOptions.js';
import { clearCLI, collectResponses } from './helpers.js';
import type { Combine2, First, Prettify, Pure, Tail } from './typeUtilities.js';

type AsOption<T> = T extends {
  key: infer K;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prompt: (...arg: any[]) => infer R;
}
  ? K extends string
    ? {
        [P in K]: Pure<R>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } & (T extends { expand: (...args: any[]) => infer Ex }
        ? {
            [P in `${K}Config`]: Pure<Ex>;
          }
        : {})
    : never
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Combine<Tuple extends any[]> = Tuple extends [infer one]
  ? AsOption<one>
  : Combine2<
      AsOption<First<Tuple>>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Tail<Tuple> extends any[] ? Combine<Tail<Tuple>> : {}
    >;

export type CreateCommandReturnType = (
  program: Command,
  version: string,
) => void;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createCommand<
  T extends ReturnType<GlobalOptions[keyof GlobalOptions]>[],
>(
  name: string,
  description: string,
  options: [...T],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (finalConfig: Prettify<Combine<T>>) => any,
): (program: Command, version: string) => void {
  return async (program: Command, version: string) => {
    const command = program.command(name).description(description);

    options.forEach((option) => {
      command.addOption(option.option);
    });

    command.action(async (args, ...rest) => {
      clearCLI(true);
      try {
        // collectResponses
        const questionsMap = options
          .filter((o) => o.isInQuestions)
          .map(({ prompt, key }) => ({
            key,
            prompt,
          }));

        const responses = await collectResponses(args, questionsMap);
        const newArgs = { ...args, ...responses };

        console.log(
          chalk.yellow(
            `\nexecuting: ${CLIRootName} ${program.name()} ${name} ${Object.getOwnPropertyNames(
              newArgs,
            )
              .map((arg) => {
                let displayValue: string | null = null;
                const value = newArgs[arg];

                if (Array.isArray(value)) {
                  displayValue = value.join(' ');
                }

                if (typeof value === 'string') {
                  displayValue = `"${value}"`;
                }

                if (typeof value === 'number') {
                  displayValue = value.toString();
                }

                if (typeof value === 'boolean' && value === false) {
                  return undefined;
                }

                return `--${arg.replace(
                  /[A-Z]/g,
                  (match: string) => `-${match.toLowerCase()}`,
                )} ${
                  displayValue !== null && displayValue !== undefined
                    ? displayValue
                    : ''
                }`;
              })
              .filter(Boolean)
              .join(' ')}`,
          ),
        );

        // zod validation
        const zodValidationObject = options.reduce(
          (zObject, { key, validation }) => {
            zObject[key] = validation;
            return zObject;
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {} as Record<string, any>,
        );

        z.object(zodValidationObject).parse(newArgs);

        const config = { ...newArgs };
        for (const option of options) {
          if ('expand' in option) {
            if (typeof option.expand === 'function') {
              config[`${option.key}Config`] = await option.expand(
                newArgs[option.key],
              );
              if (config[`${option.key}Config`] === undefined) {
                delete config[`${option.key}Config`];
              }
            }
          }
          if ('transform' in option) {
            if (typeof option.transform === 'function') {
              config[option.key] = await option.transform(newArgs[option.key]);
            }
          }
        }

        clearCLI(true);
        if (Object.keys(config).length > 0) {
          displayConfig(config);
          console.log('\n');
        }

        await action(config);
      } catch (error) {
        console.error(error);
        console.error(chalk.red(`Error executing command ${name}: ${error})`));
        process.exit(1);
      }
    });
  };
}
