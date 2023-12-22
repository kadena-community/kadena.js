import chalk from 'chalk';
import type { Command } from 'commander';
import { z } from 'zod';
import { CLIRootName } from '../constants/config.js';
import { displayConfig } from './createCommandDisplayHelper.js';
import type { GlobalOptions } from './globalOptions.js';
import { globalOptions } from './globalOptions.js';
import { collectResponses } from './helpers.js';
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
  action: (finalConfig: Prettify<Combine<T>>, args?: any) => any,
): (program: Command, version: string) => void {
  return async (program: Command, version: string) => {
    const command = program.command(name).description(description);

    command.addOption(globalOptions.quiet().option);
    options.forEach((option) => {
      command.addOption(option.option);
    });

    command.action(async (args, ...rest) => {
      try {
        const getCommandExecution = (args: Record<string, unknown>) => {
          return chalk.yellow(
            `${CLIRootName} ${program.name()} ${name} ${Object.getOwnPropertyNames(
              args,
            )
              .map((arg) => {
                let displayValue: string | null = null;
                const value = args[arg];
                const argName = arg.toLowerCase();

                if (argName.includes('password')) {
                  if (value === '') {
                    displayValue = '';
                  } else {
                    displayValue = '******';
                  }
                } else {
                  if (Array.isArray(value)) {
                    displayValue = value.join(' ');
                  } else if (typeof value === 'string') {
                    displayValue = `"${value}"`;
                  } else if (typeof value === 'number') {
                    displayValue = value.toString();
                  } else if (typeof value === 'boolean' && value === false) {
                    return undefined;
                  }
                }

                return `--${arg.replace(
                  /[A-Z]/g,
                  (match) => `-${match.toLowerCase()}`,
                )} ${
                  displayValue !== null && displayValue !== undefined
                    ? displayValue
                    : ''
                }`;
              })
              .filter(Boolean)
              .join(' ')}`,
          );
        };

        // collectResponses
        const questionsMap = options
          .filter((o) => o.isInQuestions)
          .map(({ prompt, key, isOptional }) => ({
            key,
            prompt,
            isOptional,
          }));

        if (args.quiet) {
          const missing = questionsMap.filter(
            (question) =>
              question.isOptional === false && args[question.key] === undefined,
          );
          if (missing.length) {
            console.log(
              `${chalk.yellow('Missing arguments in: ')}${getCommandExecution(
                args,
              )}`,
            );
            console.log(
              chalk.red(
                `\nMissing required arguments:\n${missing
                  .map((m) => options.find((q) => q.key === m.key)!)
                  .map((m) => `- ${m.key} (${m.option.flags})\n`)
                  .join('')}`,
              ),
            );
            console.log(
              chalk.yellow(
                'Remove the --quiet flag to enable interactive prompts\n',
              ),
            );
            process.exit(1);
          }
        }

        const newArgs: any = args.quiet
          ? args
          : await collectResponses(args, questionsMap);

        console.log(`\nExecuting: ${getCommandExecution(newArgs)}`);

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

        if (Object.keys(config).length > 0) {
          displayConfig(config);
          console.log('\n');
        }

        await action(config, newArgs);
      } catch (error) {
        console.error(error);
        console.error(chalk.red(`Error executing command ${name}: ${error})`));
        process.exit(1);
      }
    });
  };
}
