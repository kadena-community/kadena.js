import { getCombinedConfig } from '../config/configHelpers';
import type { TConfigOptions } from '../config/configQuestions';
import { defaultNetworksPath } from '../constants/networks';

import type { Command, Option } from 'commander';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';

export interface ICustomChoice {
  value: string;
  name?: string;
  description?: string;
  disabled?: boolean | string;
}

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
  config?: Partial<TConfigOptions>,
): Promise<T> {
  const responses: Partial<T> = {
    ...args,
  };
  const generator = questionGenerator(args, questions);

  let result = generator.next();
  while (result.done === false) {
    const question = result.value;
    const currentConfig = config || {};
    responses[question.key as keyof T] = await question.prompt(
      currentConfig,
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
 * Creates and attaches a new sub-command with specified arguments and options to the provided Commander program.
 *
 * @template T - The type of the arguments that the sub-command will receive.
 *
 * @param {string} name - The name identifier of the sub-command.
 * @param {string} description - A brief description of the sub-command, displayed in help messages.
 * @param {(args: T) => Promise<void> | void} actionFn - A function defining the actions to be executed when the sub-command is invoked.
 *   It may be either synchronous or asynchronous and receives the arguments passed to the sub-command.
 * @param {Array<Option>} [options] - An optional array of Commander Option instances to be associated with the sub-command.
 *
 * @returns {(program: Command) => void} - A function that, when invoked with a Commander program, attaches the
 *   created sub-command to that program.
 *
 * @throws Will throw an error if the actionFn results in a rejected promise.
 *
 * @example
 * // Define command-specific options
 * const myOptions = [
 *   new Option('-v, --verbose', 'output extra debugging'),
 *   new Option('-s, --silent', 'suppress output')
 * ];
 *
 * // Define the action function to be executed when the sub-command is invoked
 * interface MyArgs {
 *   verbose: boolean;
 * }
 * const myAction = async (args: MyArgs) => {
 *   if (args.verbose) {
 *     await someAsyncFunction();
 *     console.log("Verbose mode activated!");
 *   }
 * };
 *
 * // Create and attach the sub-command to the Commander program
 * createSimpleSubCommand('my-command', 'This is a sample command', myAction, myOptions)(program);
 */

export function createSimpleSubCommand<T>(
  name: string,
  description: string,
  actionFn: (args: T) => Promise<void> | void,
  options: Option[] = [],
): (program: Command) => void {
  return (program: Command) => {
    const command = program.command(name).description(description);
    options.forEach((option) => {
      command.addOption(option);
    });
    command.action(async (args, ...rest) => {
      try {
        await actionFn(args);
      } catch (error) {
        console.error(`Error executing command ${name}:`, error);
        process.exit(1);
      }
    });
  };
}

/**
 * Capitalizes the first letter of a string.
 *
 * @function
 * @param {string} str - The string to capitalize.
 * @returns {string} The string with the first letter capitalized.
 * @example
 *
 * const lowerCaseString = "hello";
 * const upperCaseString = capitalizeFirstLetter(lowerCaseString);
 * console.log(upperCaseString); // Outputs: Hello
 */
export function capitalizeFirstLetter(str: string): string {
  if (typeof str !== 'string' || str.length === 0) return '';

  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getExistingNetworks(): ICustomChoice[] {
  if (!existsSync(defaultNetworksPath)) {
    mkdirSync(defaultNetworksPath, { recursive: true });
  }

  try {
    return readdirSync(defaultNetworksPath).map((filename) => ({
      value: path.basename(filename.toLowerCase(), '.yaml'),
      name: path.basename(filename.toLowerCase(), '.yaml'),
    }));
  } catch (error) {
    console.error('Error reading networks directory:', error);
    return [];
  }
}

/**
 * Sanitizes a string to create a safe filename by replacing illegal, control,
 * reserved and trailing characters with hyphens. It ensures that the file does
 * not end with a hyphen.
 *
 * @param {string} str - The input string that needs to be sanitized.
 * @returns {string} - The sanitized string, ensuring it does not end with a hyphen.
 *
 * @example
 * const originalString = "This is a <sample> string:file\\name?";
 * const sanitizedString = sanitizeFilename(originalString);
 * console.log(sanitizedString); // Outputs: This-is-a--sample--string-file-name
 */
export function sanitizeFilename(str: string): string {
  const illegalRe = /[\/\?<>\\:\*\|":\s]/g;
  /* eslint-disable-next-line */
  const controlRe = /[\x00-\x1f\x80-\x9f]/g;
  const reservedRe = /^\.+$/;
  const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
  const windowsTrailingRe = /[\. ]+$/;

  if (typeof str !== 'string') {
    throw new Error('Input must be string');
  }

  str = str.replace(illegalRe, '-');
  str = str.replace(controlRe, '-');
  str = str.replace(reservedRe, '-');
  str = str.replace(windowsReservedRe, '-');
  str = str.replace(windowsTrailingRe, '-');

  // Ensure that the filename does not end with a hyphen
  str = str.replace(/-+$/, '').toLowerCase();

  return str;
}

/**
 * Checks if the input string contains only alphabetic characters.
 *
 * @function
 * @export
 * @param {string} str - The input string to be checked.
 * @returns {boolean} Returns true if the string only contains alphabetic characters (either lower case or upper case), and false if the string contains any non-alphabetic characters.
 *
 * @example
 *
 * isAlphabetic("HelloWorld"); // returns true
 * isAlphabetic("123ABC"); // returns false
 * isAlphabetic("Hello World!"); // returns false
 */
export function isAlphabetic(str: string): boolean {
  const regex = /^[A-Za-z]+$/;
  return regex.test(str);
}

/**
 * Checks if a string contains only alphabetic characters and numbers.
 *
 * @param {string} str - The input string that needs to be checked.
 * @returns {boolean} - Returns `true` if the string is alphanumeric, otherwise returns `false`.
 *
 * @example
 * const isAlnum = isAlphanumeric("abc123"); // Outputs: true
 */
export function isAlphanumeric(str: string): boolean {
  const regex = /^[A-Za-z0-9]+$/;
  return regex.test(str);
}

/**
 * Checks if a string contains only numeric characters.
 *
 * @param {string} str - The input string that needs to be checked.
 * @returns {boolean} - Returns `true` if the string is numeric, otherwise returns `false`.
 *
 * @example
 * const isNum = isNumeric("12345"); // Outputs: true
 */
export function isNumeric(str: string): boolean {
  const regex = /^[0-9]+$/;
  return regex.test(str);
}

/**
 * Processes a project and returns configuration options.
 *
 * @async
 * @function
 * @param {string} projectName - The name of the project.
 * @param {string[]} [keys] - The keys of the configuration options to return.
 * If not provided or if the array is empty, an empty object is returned.
 * @returns {Promise<Record<string, unknown>>} A promise that resolves to an object
 * containing the requested configuration options.
 *
 * @example
 * // Get 'chainId', 'network' configuration options of 'myProject'
 * processProject('myProject', ['chainId', 'network'])
 */
export async function processProject(
  projectName: string,
  keys?: string[],
): Promise<Record<string, unknown>> {
  const combinedConfig = getCombinedConfig(projectName);

  if (!keys || keys.length === 0) return {};

  const filteredConfig: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in combinedConfig) {
      filteredConfig[key] = combinedConfig[key as keyof typeof combinedConfig];
    }
  }

  return filteredConfig;
}

/**
 * Retrieves the 'key' property from each object in an array.
 *
 * @function
 * @template T - The type of the objects in the input array.
 * @param {Array<IQuestion<T>>} arr - The array of objects from which to extract 'key' properties.
 * @returns {Array<string>} - An array of strings representing the 'key' properties of the input objects.
 * @example
 * // Returns ['receiver', 'network', 'chainId', 'networkId']
 * getQuestionKeys(fundQuestions);
 */
export function getQuestionKeys<T>(arr: Array<IQuestion<T>>): Array<string> {
  return arr.map((question) => question.key as string);
}
