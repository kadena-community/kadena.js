import type { Option } from 'commander';

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
  },
>(option: T) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (optional: boolean = true) => ({
    ...option,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prompt: (previousQuestions: any, args: any) =>
      option.prompt(previousQuestions, args),
    validation: optional ? option.validation.optional() : option.validation,
  });
}
