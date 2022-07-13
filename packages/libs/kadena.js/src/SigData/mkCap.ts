import type { ICap, PactValue } from '@kadena/types';

/**
 * Helper function for creating a pact capability object.
 * Output can be used with the `mkSignerCList` function.
 * @param name Qualified name of the capability.
 * @param args Array of PactValue arguments the capability expects (default: empty array).
 * @return A properly formatted ICapobject required in SigBuilder.
 */
export function mkCap(name: string, args: Array<PactValue> = []): ICap {
  return {
    name,
    args,
  };
}
