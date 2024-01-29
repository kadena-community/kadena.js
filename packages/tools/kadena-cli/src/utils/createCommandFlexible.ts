import type { Command } from 'commander';
import { getCommandExecution } from './createCommand.js';
import type { OptionType } from './createOption.js';
import { globalOptions } from './globalOptions.js';
import { handlePromptError } from './helpers.js';
import type { Fn, Prettify } from './typeUtilities.js';

export type OptionConfig<Option extends OptionType> = {
  [P in Option['key']]: Option['transform'] extends Fn
    ? Awaited<ReturnType<Option['transform']>>
    : Awaited<ReturnType<Option['prompt']>>;
} & (Option['expand'] extends Fn
  ? {
      [P in `${Option['key']}Config`]: Awaited<ReturnType<Option['expand']>>;
    }
  : {});

export async function executeOption<Option extends OptionType>(
  option: Option,
  args: Record<string, unknown> = {},
  originalArgs: Record<string, unknown> = {},
): Promise<
  Prettify<{
    value: unknown;
    config: OptionConfig<Option>;
  }>
> {
  let value = args[option.key];

  if (value === undefined) {
    if (args.quiet !== true && args.quiet !== 'true') {
      // @ts-ignore prompt is called with two arguments, it's typings here are wrong
      // but it is hard to fix while other types correct because prompt overwrites itself in createOption
      value = await option.prompt(args, originalArgs);
    } else if (option.isOptional === false) {
      throw new Error(
        `Missing required argument: ${option.key} (${option.option.flags})`,
      );
    }
  }

  const validate = (
    option.isOptional ? option.validation.optional() : option.validation
  ).safeParse(value);
  if (validate.success === false) {
    console.warn(`Invalid value for ${option.key}: ${value}`);
  }

  const newConfig = { [option.key]: value } as OptionConfig<Option>;
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

  return {
    value: value,
    config: newConfig,
  };
}

export const createCommandFlexible =
  <
    T extends OptionType[],
    C extends (
      option: {
        [K in T[number]['key']]: (
          customArgs?: Record<string, unknown>,
        ) => Promise<Prettify<OptionConfig<Extract<T[number], { key: K }>>>>;
      },
      values: string[],
    ) => Promise<Record<string, unknown> | void>,
  >(
    name: string,
    description: string,
    options: T,
    action: C,
  ): any =>
  (program: Command, version: string) => {
    let command = program.command(name).description(description);

    if (options.some((option) => option.allowUnknownOptions === true)) {
      command = command.allowUnknownOption(true);
    }

    command.addOption(globalOptions.quiet().option);
    options.forEach((option) => {
      command.addOption(option.option);
    });
    command.action(async (originalArgs, ...rest) => {
      let args = { ...originalArgs };

      // Automatically enable quiet mode if not in interactive environment
      if (!process.stdout.isTTY) args.quiet = true;

      const collectOptionsMap = options.reduce((acc, option) => {
        acc[option.key] = async (customArgs = {}) => {
          try {
            const { value, config } = await executeOption(
              option,
              {
                ...args,
                ...customArgs,
              },
              originalArgs,
            );

            // Keep track of previous args to prompts can use them
            args = { ...args, [option.key]: value };
            return config;
          } catch (error) {
            handlePromptError(error);
          }
        };
        return acc;
      }, {} as any);

      const values = rest.flatMap((r) => r.args);
      const result = await action(collectOptionsMap, values);

      // Give the option to update args used in the command by returning an object
      // Only update args that are already defined
      if (result !== undefined && typeof result === 'object') {
        for (const [key, value] of Object.entries(result)) {
          if (Object.hasOwn(args, key) === true) args[key] = value;
        }
      }

      console.log(
        `\nExecuted: ${getCommandExecution(`${program.name()} ${name}`, args)}`,
      );
    });
  };
