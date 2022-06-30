import type { Cap } from './PactCommand';

/**
 * Pact capability object with role and description to be consumed in Signing API
 * @param role - role of the capability.
 * @param description - description of the capability.
 * @param Cap - name and arguments of the capability
 */
export interface SigningCap {
  role: string;
  description: string;
  cap: Cap;
}
