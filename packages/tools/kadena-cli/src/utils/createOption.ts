import { Option } from 'commander';
import { z } from 'zod';
import { keys } from '../prompts/index.js';

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

export interface IOptionCreatorObject {
  key: string;
  prompt: IPrompt<any>;
  validation: z.ZodSchema;
  option: Option;
  expand?: (value: any) => unknown;
  transform?: (value: any) => unknown;
  defaultIsOptional?: boolean;
}

export interface IOptionSettings {
  isOptional?: boolean;
  disableQuestion?: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createOption<const T extends IOptionCreatorObject>(data: T) {
  return (settings?: IOptionSettings) => {
    const isOptional = settings?.isOptional ?? data.defaultIsOptional ?? true;
    const isInQuestions = settings?.disableQuestion ?? false;
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const prompt: T['prompt'] = (
      responses: Record<string, unknown>,
      args: Record<string, unknown>,
    ) => data.prompt(responses, args, isOptional);
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

export const testoptioncreator = createOption({
  key: 'keyAlias',
  prompt: keys.keyAliasPrompt,
  validation: z.string(),
  option: new Option(
    '-a, --key-alias <keyAlias>',
    'Enter an alias to store your key',
  ),
  expand(value: ReturnType<typeof keys.keyAliasPrompt>) {
    return { foo: 'bar' };
  },
  transform(value: ReturnType<typeof keys.keyAliasPrompt>) {
    return 123;
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestOption = ReturnType<typeof testoptioncreator>;

export interface IEmptyOption {
  key: string;
  option: Option;
  expand: (value: string) => unknown;
  transform: (value: string) => unknown;
  isOptional: boolean;
  isInQuestions: boolean;
  prompt: (responses: any, args: any, optional: boolean) => Promise<string>;
  validation: z.Schema;
}
