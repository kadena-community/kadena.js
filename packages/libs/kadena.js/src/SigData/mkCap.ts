import type { Cap } from '../util/PactCommand';
import type { PactValue } from '../util/PactValue';

/**
 * Helper function for creating a pact capability object.
 * Output can be used with the `mkSignerCList` function.
 * @param {string} name - Qualified name of the capability.
 * @param {array} args - Array of PactValue arguments the capability expects (default: empty array).
 * @return {Cap} - A properly formatted Cap object required in SigBuilder.
 */
export default function mkCap(name: string, args: Array<PactValue> = []): Cap {
  return {
    name,
    args,
  };
}
