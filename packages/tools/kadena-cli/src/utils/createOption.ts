import type { Option } from 'commander';
import { createSymbol, skipSymbol } from './helpers.js';

export interface IPrompt {
  (previousQuestions: any, args: any, isOptional: boolean): Promise<any | typeof skipSymbol | typeof createSymbol>;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createOption<
  T extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prompt: IPrompt,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validation: any;
    option: Option;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expand?: (label: string) => any;
  },
>(option: T) {
  return (optional: boolean = true) => ({
    ...option,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prompt: (previousQuestions: any, args: any) =>
      option.prompt(previousQuestions, args, optional),
    validation: optional ? option.validation.optional() : option.validation,
  });
}
