import type { Command } from 'commander';
import { getCommandExecution } from './createCommand.js';
import type { OptionType } from './createOption.js';
import { globalOptions } from './globalOptions.js';
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
    if (args.quiet !== 'true') {
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
    ) => Promise<any>,
  >(
    name: string,
    description: string,
    options: T,
    action: C,
  ): any =>
  (program: Command, version: string) => {
    const command = program
      .command(name)
      .description(description)
      .allowUnknownOption();
    command.addOption(globalOptions.quiet().option);
    options.forEach((option) => {
      command.addOption(option.option);
    });
    command.action(async (originalArgs, ...rest) => {
      let args = { ...originalArgs };

      const collectOptionsMap = options.reduce((acc, option) => {
        acc[option.key] = async (customArgs = {}) => {
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
        };
        return acc;
      }, {} as any);

      const values = rest.flatMap((r) => r.args);
      await action(collectOptionsMap, values);

      console.log(
        `\nExecuted: ${getCommandExecution(`${program.name()} ${name}`, args)}`,
      );
    });
  };
