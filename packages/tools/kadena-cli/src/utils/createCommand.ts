import chalk from 'chalk';
import type { Command } from 'commander';
import { z } from 'zod';
import { CLIRootName } from '../constants/config.js';
import { displayConfig } from './createCommandDisplayHelper.js';
import type { createOption } from './createOption.js';
import { globalOptions } from './globalOptions.js';
import { collectResponses } from './helpers.js';
import type { Combine2, First, Prettify, Pure, Tail } from './typeUtilities.js';

type AsOption<T> = T extends {
  key: infer K;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prompt: infer R;
  transform: infer Tr;
}
  ? K extends string
    ? {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [P in K]: Tr extends (...args: any[]) => unknown
          ? Awaited<ReturnType<Tr>>
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          R extends (...args: any[]) => unknown
          ? Awaited<ReturnType<R>>
          : Awaited<R>;
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
  const T extends ReturnType<ReturnType<typeof createOption>>[],
>(
  name: string,
  description: string,
  options: [...T],
  action: (
    finalConfig: Prettify<Combine<T> & { quiet?: boolean }>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => any,
): (program: Command, version: string) => void {
  return async (program: Command, version: string) => {
    const command = program.command(name).description(description);

    command.addOption(globalOptions.quiet().option);
    options.forEach((option) => {
      command.addOption(option.option);
    });

    command.action(async (args, ...rest) => {
      try {
        // collectResponses
        const questionsMap = options.filter((o) => o.isInQuestions);

        handleQuietOption(`${program.name()} ${name}`, args, questionsMap);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newArgs: any =
          args.quiet === true
            ? args
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await collectResponses<any>(args, questionsMap as any);

        console.log(
          `\nExecuting: ${getCommandExecution(
            `${program.name()} ${name}`,
            newArgs,
          )}`,
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
              const expanded = await option.expand(newArgs[option.key]);
              if (expanded !== undefined) {
                config[`${option.key}Config`] = expanded;
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

type Fn = (...args: any[]) => unknown;

export type TransformOption<
  Option extends { key: string; prompt: Fn; transform?: Fn; expand?: Fn },
> = {
  [P in Option['key']]: Option['transform'] extends (...args: any[]) => infer Tr
    ? Awaited<Tr>
    : Awaited<ReturnType<Option['prompt']>>;
} & (Option['expand'] extends (...args: any[]) => infer Ex
  ? {
      [P in `${Option['key']}Config`]: Awaited<Ex>;
    }
  : {});

export function handleQuietOption(
  command: string,
  args: Record<string, unknown>,
  options: ReturnType<ReturnType<typeof createOption>>[],
): void {
  if (args.quiet === true) {
    const missing = options.filter(
      (option) => option.isOptional === false && args[option.key] === undefined,
    );
    if (missing.length) {
      console.log(
        `${chalk.yellow('Missing arguments in: ')}${getCommandExecution(
          `${command}`,
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
        chalk.yellow('Remove the --quiet flag to enable interactive prompts\n'),
      );
      process.exit(1);
    }
  }
}

export async function executeOption<
  Option extends ReturnType<ReturnType<typeof createOption>>,
>(
  option: Option,
  args: Record<string, unknown> = {},
): Promise<Prettify<TransformOption<Option>>> {
  let value = args[option.key];

  if (value === undefined) {
    if (args.quiet !== 'true') {
      value = await option.prompt(args, args, option.isOptional);
    } else if (option.isOptional === false) {
      throw new Error(
        `Missing required argument: ${option.key} (${option.option.flags})`,
      );
    }
  }

  const newConfig = { [option.key]: value } as TransformOption<Option>;
  if ('expand' in option) {
    if (typeof option.expand === 'function') {
      const expanded = await option.expand(value);
      if (expanded !== undefined && expanded !== null) {
        // @ts-ignore
        newConfig[`${option.key}Config`] = expanded;
      }
    }
  }
  if ('transform' in option) {
    if (typeof option.transform === 'function') {
      // @ts-ignore
      newConfig[option.key] = await option.transform(value);
    }
  }

  return newConfig;
}

export function getCommandExecution(
  command: string,
  args: Record<string, unknown>,
): string {
  return chalk.yellow(
    `${CLIRootName} ${command} ${Object.getOwnPropertyNames(args)
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
          if (typeof value === 'string') {
            displayValue = `"${value}"`;
          } else if (typeof value === 'number') {
            displayValue = value.toString();
          } else if (typeof value === 'boolean' && value === false) {
            return undefined;
          } else if (
            typeof value === 'object' &&
            value !== null &&
            Object.getPrototypeOf(value) === Object.prototype
          ) {
            return Object.entries(value)
              .map(([key, value]) => `--${key}=${value}`)
              .join(' ');
          }
        }

        const key = arg.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

        return `--${key} ${
          displayValue !== null && displayValue !== undefined
            ? displayValue
            : ''
        }`;
      })
      .filter(Boolean)
      .join(' ')}`,
  );
}
