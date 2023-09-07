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
 * Represents a generic question interface.
 *
 * @template Key - Represents the key of the type of the response.
 * @template TResponse - Represents the type of the response.
 *
 * @interface
 * @property {Key} key - The property key of the object being asked about.
 * @property {function} question - A function that prompts a question and returns a promise of the answer.
 */
interface IGenericQuestion<Key extends keyof TResponse, TResponse> {
  key: Key;
  question: () => Promise<TResponse[Key]>;
}

/**
 * Collects responses for a given array of questions.
 *
 * @template TResponse - Represents the type of the response.
 *
 * @param {Array<IGenericQuestion<keyof TResponse, TResponse>>} questions - An array of questions to be asked.
 *
 * @returns {Promise<TResponse>} - A promise that resolves to an object containing the responses.
 */
export async function collectResponses<TResponse>(
  questions: Array<IGenericQuestion<keyof TResponse, TResponse>>,
): Promise<TResponse> {
  const responses: Partial<TResponse> = {};

  for (const q of questions) {
    const answer = await q.question();
    safeAssign(responses, q.key, answer);
  }

  return responses as TResponse;
}

/**
 * Represents a choice interface for user selection.
 *
 * @template Value - The type of the value property.
 *
 * @interface
 * @property {Value} value - The actual value for the choice.
 * @property {string} [name] - The display name for the choice.
 * @property {string} [description] - A brief description for the choice.
 * @property {boolean|string} [disabled] - A flag to disable the choice or a reason why the choice is disabled.
 */
export interface IChoice<Value> {
  value: Value;
  name?: string;
  description?: string;
  disabled?: boolean | string;
}
