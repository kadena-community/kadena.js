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
  prompt: IPrompt<unknown>;
  validation: z.ZodSchema;
  option: Option;
  expand?: (label: string) => unknown;
  transform?: (key: string) => unknown;
  defaultIsOptional?: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createOption<const T extends IOptionCreatorObject>(data: T) {
  return (
    {
      isOptional,
      disableQuestion: isInQuestions = true,
    }: {
      isOptional?: boolean;
      disableQuestion?: boolean;
    } = { disableQuestion: true },
  ) => {
    const {
      key,
      option,
      expand,
      transform,
      prompt,
      validation,
      defaultIsOptional,
    } = data;
    const optional = isOptional ?? defaultIsOptional ?? true;
    return {
      key: key as T['key'],
      option,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expand: expand as T['expand'] extends (...args: any[]) => unknown
        ? (value: Awaited<ReturnType<T['prompt']>>) => ReturnType<T['expand']>
        : undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform: transform as T['transform'] extends (...args: any[]) => unknown
        ? (
            value: Awaited<ReturnType<T['prompt']>>,
          ) => ReturnType<T['transform']>
        : undefined,
      isOptional: optional,
      isInQuestions,
      prompt: ((responses, args) =>
        prompt(responses, args, optional)) as T['prompt'],
      validation: (isOptional === true
        ? validation.optional()
        : validation) as T['validation'],
    };
  };
}

const testoption = createOption({
  key: 'keyAlias',
  prompt: keys.keyAliasPrompt,
  validation: z.string(),
  option: new Option(
    '-a, --key-alias <keyAlias>',
    'Enter an alias to store your key',
  ),
  expand() {
    return { foo: 'bar' };
  },
  transform(key) {
    return 123;
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TestOption = ReturnType<typeof testoption>;
