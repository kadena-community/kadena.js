import type { TConfigOptions } from '../config/configOptions';

import { getConfig } from './globalConfig';

import type { Command } from 'commander';

/**
 * Assigns a value to an object's property if the value is neither undefined nor an empty string.
 * This function provides a type-safe way to conditionally update properties on an object.
 *
 * @template T - The type of the object to which the value might be assigned.
 * @template K - The type of the property key on the object.
 * @param {T} obj - The target object to which the value might be assigned.
 * @param {K} key - The property key on the object where the value might be assigned.
 * @param {T[K] | undefined} value - The value to be potentially assigned. If undefined or empty string, no assignment occurs.
 */
export function safeAssign<T, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K] | undefined,
): void {
  if (value !== undefined && value !== '') {
    obj[key] = value;
  }
}

/**
 * Merges properties from the source object into the target object,
 * overwriting properties on the target only if they are defined in the source.
 *
 * @template T - The type of the target object and the source object.
 * @param {T} target - The target object that will receive properties from the source.
 * @param {Partial<T>} source - The source object from which properties will be taken.
 * @returns {T} - The merged object.
 */
export function mergeConfigs<T extends object>(
  target: T,
  source: Partial<T>,
): T {
  for (const key in source) {
    if (key in target) {
      safeAssign(target, key as keyof T, source[key]);
    }
  }
  return target;
}

/* Interface defining a question structure.
 * @template T The type to which the question is bound (typically an object of configuration options).
 */
export interface IQuestion<T> {
  /** The key representing the property within the type T. */
  key: keyof T;

  /**
   * The prompt function to retrieve the answer for this question.
   * @param previousAnswers Previously provided answers for other questions.
   * @returns A promise resolving to the answer of the question.
   */
  prompt: (
    config: Partial<TConfigOptions>,
    previousAnswers: Partial<T>,
    args: Partial<T>,
  ) => Promise<T[keyof T]>;
}

/**
 * Generator function that iterates over a list of questions and yields questions that are yet to be answered.
 * @template T The type of configuration options the questions correspond to.
 * @param args The initial or provided answers for some of the questions.
 * @param questions A list of questions to iterate over.
 * @yields A question that is yet to be answered.
 */
export function* questionGenerator<T>(
  args: Partial<T>,
  questions: IQuestion<T>[],
): Generator<IQuestion<T>, void, void> {
  for (const question of questions) {
    if (args[question.key] === undefined) {
      yield question;
    }
  }
}

/**
 * Collects user responses for a set of questions.
 * @template T The type of configuration options the questions correspond to.
 * @param args The initial or provided answers for some of the questions.
 * @param questions A list of questions for which to collect responses.
 * @returns A promise that resolves to an object of collected responses.
 */

export async function collectResponses<T>(
  args: Partial<T>,
  questions: IQuestion<T>[],
): Promise<T> {
  const responses: Partial<T> = {
    ...args,
  };
  const generator = questionGenerator(args, questions);

  let result = generator.next();
  while (result.done === false) {
    const question = result.value;
    const config = getConfig();
    responses[question.key as keyof T] = await question.prompt(
      config,
      responses,
      args,
    );

    result = generator.next();
  }

  return responses as T;
}

/**
 * Extracts the public key from a given account string.
 *
 * @param {string} account - The account string in the format `[kctwu]:[a-zA-Z0-9]{64}`.
 *
 * @returns {string} - The extracted public key from the account.
 *
 * @throws {Error} - Throws an error if the account format is invalid.
 *
 * @example
 * const account = 'k:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
 * const pubKey = getPubKeyFromAccount(account);
 * console.log(pubKey); // Outputs: abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01
 */
export function getPubKeyFromAccount(account: string): string {
  if (!account.toLowerCase().match(/^[kctwu]:[a-zA-Z0-9]{64}$/)) {
    throw new Error('Invalid account');
  }

  const pubKey = account.toLowerCase().slice(2);
  return pubKey;
}

/**
 * Creates a new sub-command with specified arguments and attaches it to the given Commander program.
 *
 * @template T - The type of the arguments that the sub-command will receive.
 *
 * @param {string} name - The name of the sub-command.
 * @param {string} description - The description for the sub-command, to be displayed in help messages.
 * @param {(args: T) => Promise<void> | void} actionFn - The action function to be executed when the sub-command is called.
 *   This function can be either synchronous or asynchronous and receives the arguments passed to the sub-command.
 *
 * @returns {(program: Command) => void} - A function that, when invoked with a Commander program, adds the
 *   sub-command to that program.
 *
 * @throws Will throw an error if the actionFn results in a rejected promise.
 *
 * @example
 * interface MyArgs {
 *   verbose: boolean;
 * }
 * const myAction = async (args: MyArgs) => {
 *   if (args.verbose) {
 *     await someAsyncFunction();
 *     console.log("Verbose mode on!");
 *   }
 * };
 * createSimpleSubCommand('my-command', 'This is my command', myAction)(program);
 */
export function createSimpleSubCommand<T>(
  name: string,
  description: string,
  actionFn: (args: T) => Promise<void> | void,
): (program: Command) => void {
  return (program: Command) => {
    program
      .command(name)
      .description(description)
      .action(async (args, ...rest) => {
        try {
          await actionFn(args);
        } catch (error) {
          console.error(`Error executing command ${name}:`, error);
          process.exit(1);
        }
      });
  };
}
