import type { Command } from 'commander';
import { CLINAME, IS_TEST } from '../constants/config.js';
import { CommandError, printCommandError } from './command.util.js';
import type { OptionType, createOption } from './createOption.js';
import { notEmpty } from './globalHelpers.js';
import { globalOptions } from './globalOptions.js';
import { handleNoKadenaDirectory, handlePromptError } from './helpers.js';
import { log } from './logger.js';
import { readStdin } from './stdin.js';
import type { FlattenObject, Fn, Prettify } from './typeUtilities.js';

type OptionConfig<Option extends OptionType> = {
  [P in Option['key']]: Option['transform'] extends Fn
    ? Awaited<ReturnType<Option['transform']>>
    : Awaited<ReturnType<Option['prompt']>>;
} & (Option['expand'] extends Fn
  ? {
      [P in `${Option['key']}Config`]: Awaited<ReturnType<Option['expand']>>;
    }
  : {});

type PromptFn = (
  args: Record<string, unknown>,
  originalArgs: Record<string, unknown>,
) => unknown;

async function executeOption<Option extends OptionType>(
  option: Option,
  args: Record<string, unknown> = {},
  originalArgs: Record<string, unknown> = {},
): Promise<
  Prettify<{
    value: unknown;
    config: OptionConfig<Option>;
    prompted: boolean;
  }>
> {
  let value = args[option.key];
  let prompted = false;

  if (value === undefined && option.isInQuestions) {
    if (args.quiet !== true && args.quiet !== 'true') {
      prompted = true;
      value = await (option.prompt as PromptFn)(args, originalArgs);
    } else if (args.quiet === true || args.quiet === 'true') {
      value = option.defaultValue;
    } else if (
      option.isOptional === false &&
      option.defaultValue === undefined
    ) {
      // Should have been handled earlier, but just in case
      throw new Error(
        `Missing required argument: ${option.key} (${option.option.flags})`,
      );
    }
  }

  const validate = (
    option.isOptional ? option.validation.optional() : option.validation
  ).safeParse(value);
  if (validate.success === false) {
    log.warning(`Invalid value for ${option.key}: ${value}`);
  }

  const newConfig = { [option.key]: value } as OptionConfig<Option>;
  if ('expand' in option) {
    if (typeof option.expand === 'function') {
      const expanded = await option.expand(value, args);
      if (expanded !== undefined && expanded !== null) {
        // @ts-ignore
        newConfig[`${option.key}Config`] = expanded;
      }
    }
  }
  if ('transform' in option) {
    if (typeof option.transform === 'function') {
      // @ts-ignore
      newConfig[option.key] = await option.transform(value, args);
    }
  }

  return {
    value: value,
    config: newConfig,
    prompted,
  };
}

const printCommandExecution = (
  command: string,
  args: Record<string, unknown>,
  updateArgs?: Record<string, unknown>,
  values?: string[],
): void => {
  // Give the option to update args used in the command by returning an object
  // Only update args that are already defined
  if (updateArgs !== undefined && typeof updateArgs === 'object') {
    for (const [key, value] of Object.entries(updateArgs)) {
      if (Object.hasOwn(args, key) === true) args[key] = value;
    }
  }

  log.info(
    log.color.gray(
      `\nExecuted:\n${getCommandExecution(command, args, values)}`,
    ),
  );
};

export type CommandOption<T extends OptionType[]> = {
  [K in T[number]['key']]: (
    customArgs?: Record<string, unknown>,
  ) => Promise<Prettify<OptionConfig<Extract<T[number], { key: K }>>>>;
};

interface ICommandData {
  /** Arguments parsed from the command line */
  values: string[];
  /** content passed to stdin */
  stdin?: string;
  /** Automatically fetch all options in order of the options array and merge the results */
  collect: <T extends CommandOption<OptionType[]>>(
    options: T,
  ) => Promise<
    FlattenObject<{
      [K in keyof T]: Awaited<ReturnType<T[K]>>;
    }>
  >;
}

const generateBugReportLink = (command: string, error: string): string => {
  const platform = encodeURIComponent(process.platform);
  const browser = encodeURIComponent(`Node.JS ${process.version}`);
  const reproduction = encodeURIComponent(`Executed command:\n${command}`);
  const description = encodeURIComponent(
    `Describe the issue:\n\n\nError stacktrace:\n${error}`,
  );
  return `https://github.com/kadena-community/kadena.js/issues/new?assignees=&labels=bug&projects=&template=001-bug_report.yml&os=${platform}&browser=${browser}&description=${description}&reproduction=${reproduction}`;
};

export const createCommand =
  <
    T extends OptionType[],
    C extends (
      option: CommandOption<T>,
      data: ICommandData,
    ) => Promise<Record<string, unknown> | void>,
  >(
    name: string,
    description: string,
    options: T,
    action: C,
  ): ((program: Command, version: string) => void) =>
  (program) => {
    // anything after the first newline is only shown on the command specific help page
    const [_description, ...helpText] = description.split('\n');
    let command = program.command(name).description(_description);
    if (helpText.length > 0) {
      command.configureHelp({
        commandDescription: () =>
          `${[_description, '', ...helpText].join('\n')}`,
      });
    }
    let allowsUnknownOptions = false;

    if (options.some((option) => option.allowUnknownOptions === true)) {
      command = command.allowUnknownOption(true);
      allowsUnknownOptions = true;
    }

    command.addOption(globalOptions.quiet().option);
    command.addOption(globalOptions.json().option);
    command.addOption(globalOptions.yaml().option);
    options.forEach((option) => {
      command.addOption(option.option);
    });
    command.action(async (originalArgs, ...rest) => {
      // args outside try-catch to be able to use it in catch
      let args = { ...originalArgs };
      const values = rest.flatMap((r) => r.args);
      let prompted = false;

      try {
        const stdin = await readStdin();

        if (allowsUnknownOptions) {
          log.debug(`Command ${name} allows unknown options`);
        }

        // Automatically enable quiet mode if not in interactive and test environment
        if (!process.stderr.isTTY && !IS_TEST) args.quiet = true;

        handleQuietOption(args, options);

        if (args.json === true) {
          log.setOutputMode('json');
        } else if (args.yaml === true) {
          log.setOutputMode('yaml');
        }

        const optionIndex = new Map<unknown, number>();
        const collectOptionsMap = options.reduce((acc, option, index) => {
          acc[option.key] = async (customArgs = {}) => {
            try {
              const {
                value,
                config,
                prompted: _prompted,
              } = await executeOption(
                option,
                {
                  stdin: stdin,
                  ...args,
                  ...customArgs,
                },
                originalArgs,
              );

              // Keep track of previous args to prompts can use them
              args = { ...args, [option.key]: value };
              prompted = prompted || _prompted;
              return config;
            } catch (error) {
              handlePromptError(error);
            }
          };
          optionIndex.set(acc[option.key], index);
          return acc;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, {} as any);

        const result = await action(collectOptionsMap, {
          values,
          stdin: stdin ?? undefined,
          collect: async (optionObject) => {
            const options = Object.entries(optionObject);
            options.sort(
              (a, b) =>
                (optionIndex.get(a[1]) ?? 0) - (optionIndex.get(b[1]) ?? 0),
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let result = {} as any;
            for (const option of options) {
              result = {
                ...result,
                ...(await option[1]()),
              };
            }
            return result;
          },
        });

        if (prompted) {
          printCommandExecution(
            `${program.name()} ${name}`,
            args,
            result ?? undefined,
            values,
          );
        }
      } catch (error) {
        if (handleNoKadenaDirectory(error)) return;
        if (error instanceof CommandError) {
          printCommandError(error);
          if (prompted) {
            printCommandExecution(
              `${program.name()} ${name}`,
              args,
              error.args,
              values,
            );
          }
          process.exitCode = error.exitCode;
          return;
        }
        log.error(`\nAn error occurred: ${error.message}\n`);
        if (IS_TEST) {
          log.error(error.stack);
        } else {
          log.debug(error.stack);
          log.info(
            `Is this a bug? Let us know:\n${generateBugReportLink(
              getCommandExecution(`${program.name()} ${name}`, args, values),
              error.stack ?? error.message,
            )}`,
          );
        }
        process.exitCode = 1;
      }
    });
  };

function handleQuietOption(
  args: Record<string, unknown>,
  options: ReturnType<ReturnType<typeof createOption>>[],
): void {
  if (args.quiet === true) {
    const missing = options.filter(
      (option) =>
        option.isOptional === false &&
        args[option.key] === undefined &&
        option.defaultValue === undefined,
    );
    if (missing.length) {
      log.error(
        `\nMissing required arguments:\n${missing
          .map((m) => options.find((q) => q.key === m.key)!)
          .map((m) => `- ${m.key} (${m.option.flags})\n`)
          .join('')}`,
      );
      log.warning('Remove the --quiet flag to enable interactive prompts');
      throw new CommandError({ exitCode: 1 });
    }
  }
}

function getCommandExecution(
  command: string,
  args: Record<string, unknown>,
  generalArgs: string[] = [],
): string {
  return `${CLINAME} ${command} ${Object.getOwnPropertyNames(args)
    .map((arg) => {
      let displayValue: string | null = null;
      const value = args[arg];

      if (Array.isArray(value)) {
        displayValue = `"${value.join(',')}"`;
      } else if (typeof value === 'string') {
        displayValue = `"${value}"`;
      } else if (typeof value === 'number') {
        displayValue = value.toString();
      } else if (typeof value === 'boolean' && value) {
        return arg.length === 1 ? `-${arg}` : `--${arg}`;
      } else if (value === null || (typeof value === 'boolean' && !value)) {
        return undefined;
      } else if (
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === Object.prototype
      ) {
        return Object.entries(value)
          .map(([key, val]) =>
            // Do not show keys starting with _ (used for password)
            !key.startsWith('_') ? `--${key}="${val}"` : null,
          )
          .filter(notEmpty)
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
