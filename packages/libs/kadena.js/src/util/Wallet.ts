import { Cap } from './PactCommand';

export interface SigningCap {
  role: string;
  description: string;
  cap: Cap;
}
