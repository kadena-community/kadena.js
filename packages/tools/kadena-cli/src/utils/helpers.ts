import clear from 'clear';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';
import sanitize from 'sanitize-filename';
import { defaultKeysetsPath } from '../constants/keysets.js';
import { defaultNetworksPath } from '../constants/networks.js';
import type { ICustomKeysetsChoice } from '../keys/utils/keysetHelpers.js';
import type { ICustomNetworkChoice } from '../networks/utils/networkHelpers.js';

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

/**
 * Interface defining the structure of a question used in dynamic configuration prompts.
 * Each question is bound to a specific type, typically representing a configuration option.
 *
 * @template T - The type the question is bound to, typically an object of configuration options.
 */
export interface IQuestion<T> {
  /**
   * The property key within type T. This key corresponds to the specific configuration option the question relates to.
   */
  key: keyof T;

  /**
   * The prompt function responsible for retrieving the answer for this question.
   *
   * @param {Partial<T>} previousAnswers - An object containing answers provided for previous questions. Useful for conditional logic based on past responses.
   * @param {Partial<T>} args - Command line arguments or other external parameters that might influence the prompt's behavior.
   * @param {boolean} isOptional - Indicates whether answering this question is optional.
   * @returns {Promise<T[keyof T]>} - A promise that resolves to the answer provided by the user for this question.
   */
  prompt: (
    previousAnswers: Partial<T>,
    args: Partial<T>,
    isOptional: boolean,
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
 * Collects user responses for a set of questions, allowing for dynamic configuration based on user input.
 * It iterates through each question, presenting it to the user and collecting the responses.
 *
 * @template T - The type representing the structure of configuration options.
 * @param {Partial<T>} args - The initial or provided answers for some of the questions. These can be used to pre-populate answers or provide defaults.
 * @param {IQuestion<T>[]} questions - A list of questions to be presented to the user.
 * @param {boolean} [isOptional=false] - A flag to indicate whether answering questions is optional. If true, users can choose to skip questions.
 * @returns {Promise<T>} - A promise that resolves to an object containing the collected responses.
 */
export async function collectResponses<T>(
  args: Partial<T>,
  questions: IQuestion<T>[],
  isOptional: boolean
): Promise<T> {
  const responses: Partial<T> = { ...args };
  const generator = questionGenerator(args, questions);

  let result = generator.next();
  while (result.done !== true) {
    const question = result.value;
    const response = await question.prompt(responses, args, isOptional);

    responses[question.key as keyof T] = response;

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

export function getExistingNetworks(): ICustomNetworkChoice[] {
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

export async function getExistingKeysets(): Promise<ICustomKeysetsChoice[]> {
  try {
    return readdirSync(defaultKeysetsPath).map((filename) => ({
      value: path.basename(filename.toLowerCase(), '.yaml'),
      name: path.basename(filename.toLowerCase(), '.yaml'),
    }));
  } catch (error) {
    console.error('Error reading keyset directory:', error);
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
  return sanitize(str);
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

/**
 * Clears the CLI. Only executes in production environments.
 *
 * @param {boolean} [full=false] - If true, performs a full clear; otherwise, performs a standard clear.
 */
export function clearCLI(full: boolean = false): void {
  if (process.env.NODE_ENV === 'production') {
    if (full) {
      clear(true);
    } else {
      clear();
    }
  }
}

export const skipSymbol = Symbol('skip');
export const createSymbol = Symbol('createSymbol');
