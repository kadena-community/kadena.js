import { PactValue } from './PactValue';

export interface Exec {
  data: object;
  code: string;
}

export interface Cont {
  proof: string | null;
  pactId: string;
  rollback: boolean;
  step: number;
  data: object;
}

export type Payload = Exec | Cont;

/**
 * @typedef {object} Cap - A pact capability to be signed.
 * @property {string} name - Qualified name of the capability.
 *                           Example format:
 *                           - "<namespace>.<moduleName>.<capability>"
 *                           - "<moduleName>.<capability>"
 * @property {array} args - Array of PactValue arguments the capability expects.
 */
export type Cap = {
  name: string;
  args: Array<PactValue>;
};

export interface PubKey {
  pubKey: string;
  scheme?: string;
  addr?: string;
  clist?: [Cap];
}

export interface Meta {
  creationTime: number;
  ttl: number;
  gasLimit: number;
  gasPrice: number;
  sender: string;
  chainId: string;
}

export interface PactCommand {
  networkId: string | null;
  payload: Payload;
  signers: [PubKey];
  meta: Meta;
  nonce: string;
}
