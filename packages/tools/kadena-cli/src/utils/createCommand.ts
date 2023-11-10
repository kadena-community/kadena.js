import chalk from 'chalk';
import type { Command } from 'commander';
import { z } from 'zod';
import type { GlobalOptions } from './helpers.js';
import { collectResponses } from './helpers.js';
import { Combine2, First, Prettify, Pure, Tail } from './typeUtilities.js';

const formatLength: 80 = 80;
const formatConfig = (key: string, value?: string | number, prefix: string = ''): string => {
  const valueDisplay = value === undefined
    ? chalk.red('Not Set')
    : chalk.green(value.toString());
  const keyValue = `${key}: ${valueDisplay}`;
  const remainingWidth =
    formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
  return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
};

const displayConfig = (config: Record<string, string | number | object>, indentation: string = ''): void => {
  Object.getOwnPropertyNames(config).forEach((key) => {
    const value = config[key];
    const isObject = typeof value === 'object';
    console.log(
      formatConfig(indentation + key, isObject ? '' : value),
    );
    if (isObject) {
      displayConfig(value as unknown as Record<string, string | number | object>, indentation + '  ');
    }
  });
}

type AsOption<T> = T extends {
  key: infer K;
  prompt: (...arg: any[]) => infer R;
}
  ? K extends string
    ? {
        [P in K]: Pure<R>;
      } & (T extends { expand: (...args: any[]) => infer Ex }
        ? {
            [P in `${K}Config`]: Pure<Ex>;
          }
        : {})
    : never
  : never;

type Combine<Tuple extends any[]> = Tuple extends [infer one]
  ? AsOption<one>
  : Combine2<
      AsOption<First<Tuple>>,
      Tail<Tuple> extends any[] ? Combine<Tail<Tuple>> : {}
    >;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createCommand<
  T extends ReturnType<GlobalOptions[keyof GlobalOptions]>[],
>(
  name: string,
  description: string,
  options: [...T],
  action: (finalConfig: Prettify<Combine<T>>) => any,
) {
  return async (program: Command, version: string) => {
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

        console.log(chalk.yellow(
          `\nexecuting: kadena ${program.name()} ${name} ${Object.getOwnPropertyNames(
            newArgs,
          )
            .map((arg) => `--${arg.replace(/[A-Z]/g, (match: string) => '-' + match.toLowerCase())} ${newArgs[arg]}`)
            .join(' ')}`,
        ));

        // zod validation
        const zodValidationObject = options.reduce(
          (zObject, { key, validation }) => {
            zObject[key] = validation;
            return zObject;
          },
          {} as Record<string, any>,
        );

        z.object(zodValidationObject).parse(newArgs);

        const config = { ...newArgs };
        for (let option of options) {
          if ('expand' in option) {
            config[`${option.key}Config`] = await option.expand(newArgs[option.key]);
          }
        }

        console.log();
        displayConfig(config);

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
