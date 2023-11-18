import type { Chalk } from 'chalk';
import chalk from 'chalk';

import type { Option } from 'commander';
import { clearCLI } from './helpers.js';

interface IDependency {
  condition: () => Promise<boolean> | boolean;
  action: () => Promise<void> | void;
  message: string;
}

const orangeUnderlined: Chalk = chalk.hex('#FFA500').underline;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createOption<
  T extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prompt: (previousQuestions?: any, args?: any) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validation: any;
    option: Option;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expand?: (label: string) => any;
    dependsOn?: IDependency[];
  },
>(option: T) {
  return (optional: boolean = true) => ({
    ...option,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prompt: async (previousQuestions: any, args: any) => {
      if (option.dependsOn) {
        for (const dependency of option.dependsOn) {
          let conditionMet = await dependency.condition();

          if (!conditionMet) {
            clearCLI();
            console.log(orangeUnderlined(dependency.message));
            await dependency.action();

            // Recheck
            conditionMet = await dependency.condition();

            // Abort
            if (!conditionMet) {
              console.log(
                chalk.redBright(
                  `Dependency condition not aborting: (${dependency.message})`,
                ),
              );
              process.exit(1);
            }
          }
        }
      }
      return option.prompt(previousQuestions, args);
    },
    validation: optional ? option.validation.optional() : option.validation,
  });
}
