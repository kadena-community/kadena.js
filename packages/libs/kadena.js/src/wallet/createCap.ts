import type { ISigningCap } from '@kadena/types';
/**
 * Prepares a properly formatted cap object required in signing API.
 */
export function createCap(
  role: string,
  description: string,
  name: string,
  args: Array<string>,
): ISigningCap {
  return {
    role,
    description,
    cap: {
      name,
      args,
    },
  };
}
