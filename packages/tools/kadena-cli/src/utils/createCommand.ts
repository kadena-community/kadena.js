import chalk from 'chalk';
import type { Command } from 'commander';
import { z } from 'zod';
import { CLINAME } from '../constants/config.js';
import { CommandError } from './command.util.js';
import { displayConfig } from './createCommandDisplayHelper.js';
import type { OptionType, createOption } from './createOption.js';
import { globalOptions } from './globalOptions.js';
import { collectResponses } from './helpers.js';
import { log } from './logger.js';
import { readStdin } from './stdin.js';
import type { Combine2, First, Prettify, Pure, Tail } from './typeUtilities.js';

type AsOption<T> = T extends {
  key: infer K;
  prompt: infer R;
  transform?: infer Tr;
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
export function createCommand<const T extends OptionType[]>(
  name: string,
  description: string,
  options: [...T],
  action: (
    finalConfig: Prettify<Combine<T> & { quiet?: boolean }>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stdin?: string,
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
        const stdin = await readStdin();
        const generalArgs = rest.flatMap((r) => r.args);

        // collectResponses
        const questionsMap = options.filter((o) => o.isInQuestions);

        if (!process.stderr.isTTY) args.quiet = true;

        handleQuietOption(
          `${program.name()} ${name}`,
          args,
          questionsMap,
          generalArgs,
        );

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
            generalArgs,
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
              const expanded = await option.expand(
                newArgs[option.key],
                newArgs,
              );
              if (expanded !== undefined) {
                config[`${option.key}Config`] = expanded;
              }
            }
          }
          if ('transform' in option) {
            if (typeof option.transform === 'function') {
              config[option.key] = await option.transform(
                newArgs[option.key],
                newArgs,
              );
            }
          }
        }

        if (Object.keys(config).length > 0) {
          displayConfig(config);
          console.log('\n');
        }

        await action(config, generalArgs, stdin ?? undefined);
      } catch (error) {
        if (error instanceof CommandError) {
          process.exitCode = error.exitCode;
          return;
        }
        log.debug(error);
        log.error(`Error executing command ${name}: ${error}`);
        process.exitCode = 1;
      }
    });
  };
}

export function handleQuietOption(
  command: string,
  args: Record<string, unknown>,
  options: ReturnType<ReturnType<typeof createOption>>[],
  generalArgs: string[],
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
          generalArgs,
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

export function getCommandExecution(
  command: string,
  args: Record<string, unknown>,
  generalArgs: string[] = [],
): string {
  return `${CLINAME} ${command} ${Object.getOwnPropertyNames(args)
    .map((arg) => {
      let displayValue: string | null = null;
      const value = args[arg];

      if (arg.toLowerCase().includes('password')) {
        displayValue = value === '' ? '' : '******';
      } else if (Array.isArray(value)) {
        displayValue = `"${value.join(',')}"`;
      } else if (typeof value === 'string') {
        displayValue = `"${value}"`;
      } else if (
        typeof value === 'number' ||
        (typeof value === 'boolean' && value)
      ) {
        displayValue = value.toString();
      } else if (value === null || (typeof value === 'boolean' && !value)) {
        return undefined;
      } else if (
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === Object.prototype
      ) {
        return Object.entries(value)
          .map(([key, val]) => `--${key}="${val}"`)
          .join(' ');
      }

      const key = arg.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

      return displayValue !== null && displayValue !== undefined
        ? `--${key}=${displayValue}`
        : '';
    })
    .filter(Boolean)
    .join(' ')} ${generalArgs.join(' ')}`;
}
