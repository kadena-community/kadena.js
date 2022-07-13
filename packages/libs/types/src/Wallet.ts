import type { ICap } from './PactCommand';

/**
 * Pact capability object with role and description to be consumed in Signing API
 * @param role - role of the capability.
 * @param description - description of the capability.
 * @param ICap - name and arguments of the capability
 * @alpha
 */
export interface ISigningCap {
  role: string;
  description: string;
  cap: ICap;
}
