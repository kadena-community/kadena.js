import { SigningCap } from '../util';
/**
 * Prepares a properly formatted cap object required in signing API.
 */
export default function mkCap(
  role: string,
  description: string,
  name: string,
  args: string[] = [],
): SigningCap {
  return {
    role,
    description,
    cap: {
      name,
      args,
    },
  };
}
