import type { Option } from 'commander';
import type { z } from 'zod';

/**
 * Function that defines the prompt behavior.
 *
 * @param previousQuestions - The answers or data collected from previous prompts.
 * @param args - Command line arguments or other parameters influencing the prompt's behavior.
 * @param isOptional - Indicates whether the prompt is optional.
 * @returns A promise resolving to the user's input or a specific value indicating a skip or creation action.
 */
export type IPrompt<T> = (
  previousQuestions: Record<string, unknown>,
  args: Record<string, unknown>,
  isOptional: boolean,
) => T | Promise<T>;

// Should be used by OptionType but that causes issues in createCommandFlexible
// See @ts-ignore comment there for details
// type IPromptCreator<T> = (
//   responses: Record<string, unknown>,
//   args: Record<string, unknown>,
// ) => T;

export interface IOptionCreatorObject {
  key: string;
  prompt: IPrompt<any>;
  validation: z.ZodSchema;
  option: Option;
  expand?: (value: any, args: Record<string, unknown>) => unknown;
  transform?: (value: any, args: Record<string, unknown>) => unknown;
  defaultIsOptional?: boolean;
  allowUnknownOptions?: boolean;
}

export interface IOptionSettings {
  isOptional?: boolean;
  disableQuestion?: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createOption<const T extends IOptionCreatorObject>(data: T) {
  return (settings?: IOptionSettings) => {
    const isOptional = settings?.isOptional ?? data.defaultIsOptional ?? true;
    const isInQuestions = settings?.disableQuestion !== true ?? true;
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const prompt: T['prompt'] = (responses, args) =>
      data.prompt(responses, args, isOptional);
    const validation =
      isOptional === true ? data.validation.optional() : data.validation;
    return {
      ...data,
      isOptional,
      isInQuestions,
      prompt,
      validation,
    };
  };
}

export type OptionType = Omit<
  ReturnType<ReturnType<typeof createOption>>,
  'prompt'
> & {
  prompt: IPrompt<any>;
};
