import { load } from 'js-yaml';
import path from 'path';
import sanitize from 'sanitize-filename';
import type { ZodError } from 'zod';
import { MAX_CHARACTERS_LENGTH } from '../constants/config.js';
import { defaultDevnetsPath, devnetDefaults } from '../constants/devnets.js';
import { defaultNetworksPath } from '../constants/networks.js';
import type { ICustomDevnetsChoice } from '../devnet/utils/devnetHelpers.js';
import { writeDevnet } from '../devnet/utils/devnetHelpers.js';
import type { ICustomNetworkChoice } from '../networks/utils/networkHelpers.js';
import { services } from '../services/index.js';
import { CommandError, printCommandError } from './command.util.js';
import { log } from './logger.js';

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
  ) => Promise<T[keyof T]>;
}

export function handlePromptError(error: unknown): never {
  if (error instanceof CommandError) {
    printCommandError(error);
  } else if (error instanceof Error) {
    if (error.message.includes('User force closed the prompt')) {
      // Usually NEVER process.exit, this one is an exception since it us the uses's intention
      process.exit(0);
    } else {
      log.debug(error);
      log.error(error.message);
    }
  } else {
    log.error('Unexpected error executing option', error);
  }
  throw new CommandError({ errors: [], exitCode: 1 });
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
): Promise<T> {
  const responses: Partial<T> = { ...args };

  for (const question of questions) {
    if (args[question.key] === undefined) {
      try {
        const response = await question.prompt(responses, args);
        responses[question.key] = response;
      } catch (error) {
        handlePromptError(error);
      }
    }
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

export async function getExistingNetworks(): Promise<ICustomNetworkChoice[]> {
  await services.filesystem.ensureDirectoryExists(defaultNetworksPath);

  try {
    return (await services.filesystem.readDir(defaultNetworksPath)).map(
      (filename) => ({
        value: path.basename(filename.toLowerCase(), '.yaml'),
        name: path.basename(filename.toLowerCase(), '.yaml'),
      }),
    );
  } catch (error) {
    log.error('Error reading networks directory:', error);
    return [];
  }
}

type ICustomChoice = ICustomDevnetsChoice | ICustomNetworkChoice;

export async function getConfiguration(
  configurationPath: string,
): Promise<ICustomChoice[]> {
  try {
    return (await services.filesystem.readDir(configurationPath)).map(
      (filename) => ({
        value: path.basename(filename.toLowerCase(), '.yaml'),
        name: path.basename(filename.toLowerCase(), '.yaml'),
      }),
    );
  } catch (error) {
    log.error(`Error reading ${configurationPath} directory:`, error);
    return [];
  }
}

export async function ensureDevnetsConfiguration(): Promise<void> {
  if (await services.filesystem.directoryExists(defaultDevnetsPath)) {
    return;
  }
  await services.filesystem.ensureDirectoryExists(defaultDevnetsPath);
  await writeDevnet(devnetDefaults.devnet);
}

export async function getExistingDevnets(): Promise<ICustomDevnetsChoice[]> {
  await ensureDevnetsConfiguration();

  return getConfiguration(defaultDevnetsPath);
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
 * Checks if a string contains only characters valid in filenames
 *
 * @param {string} str - The input string that needs to be checked.
 * @returns {boolean} - Returns `true` if the string is valid
 *
 * @example
 * const isValid = isValidFilename("abc-123"); // Outputs: true
 */
export function isValidFilename(str: string): boolean {
  str = str.trim();
  if (str.length === 0) return false;

  // Based on https://superuser.com/a/358861
  const regex = /[\\\/:*?"<>|]/;

  return !regex.test(str);
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

// export const skipSymbol = Symbol('skip');
// export const createSymbol = Symbol('createSymbol');

export const notEmpty = <TValue>(
  value: TValue | null | undefined,
): value is TValue => value !== null && value !== undefined;

export const truncateText = (
  str: string,
  maxLength: number = MAX_CHARACTERS_LENGTH,
): string =>
  str.length > maxLength ? `${str.substring(0, maxLength - 3)}...` : str;

export const maskStringPreservingStartAndEnd = (
  str: string,
  maxLength = 15,
  maskChar = '.',
  maskCharLength = 4,
): string => {
  if (str.length <= maxLength) {
    return str;
  } else {
    const startChars = str.substring(0, (maxLength - maskCharLength) / 2);
    const endChars = str.substring(
      str.length - (maxLength - maskCharLength) / 2,
    );
    return `${startChars}${maskChar.repeat(maskCharLength)}${endChars}`;
  }
};

export const isNotEmptyString = (value: unknown): value is string =>
  value !== null && value !== undefined && value !== '';

/**
 * Prints zod error issues in format
 * ```code
 * {key}: [issues by key]\n
 * ...repeat
 * ```
 */
export const formatZodError = (error: ZodError): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const format = error.format() as any;
  const formatted = Object.keys(format)
    .map((key) => {
      if (key === '_errors') return null;
      return `${key}: ${format[key]?._errors.join(', ')}`;
    })
    .filter(notEmpty);
  return formatted.join('\n');
};

export const safeJsonParse = <T extends unknown>(value: string): T | null => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

export const safeYamlParse = <T extends unknown>(value: string): T | null => {
  try {
    return load(value) as T;
  } catch (e) {
    return null;
  }
};

export const passwordPromptTransform =
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  (flag: string) =>
    async (
      passwordFile: string | { _password: string },
      args: Record<string, unknown>,
    ): Promise<string> => {
      const password =
        typeof passwordFile === 'string'
          ? passwordFile === '-'
            ? (args.stdin as string | null)
            : await services.filesystem.readFile(passwordFile)
          : passwordFile._password;

      if (password === null) {
        throw new CommandError({
          errors: [`Password file not found: ${passwordFile}`],
          exitCode: 1,
        });
      }

      const trimmedPassword = password.trim();

      if (typeof passwordFile !== 'string') {
        log.info(`You can use the ${flag} flag to provide a password.`);
      }

      if (trimmedPassword.length < 8) {
        throw new CommandError({
          errors: ['Password should be at least 8 characters long.'],
          exitCode: 1,
        });
      }

      if (trimmedPassword.includes('\n')) {
        log.warning(
          'Password contains new line characters. Make sure you are using the correct password.',
        );
      }

      return trimmedPassword;
    };
