import type { Option } from 'commander';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
//import type { createSymbol, skipSymbol } from './helpers.js';

export interface IPrompt {
  /**
   * Function that defines the prompt behavior.
   *
   * @param previousQuestions - The answers or data collected from previous prompts.
   * @param args - Command line arguments or other parameters influencing the prompt's behavior.
   * @param isOptional - Indicates whether the prompt is optional.
   * @returns A promise resolving to the user's input or a specific value indicating a skip or creation action.
   */
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    previousQuestions: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: any,
    isOptional: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any>;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createOption<
  T extends {
    prompt: IPrompt;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validation: any;
    option: Option;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expand?: (label: string) => any;
  },
>(option: T) {
  return (isOptional: boolean = true) => ({
    ...option,
    isOptional,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prompt: option.prompt,
    validation: isOptional ? option.validation.optional() : option.validation,
  });
}
