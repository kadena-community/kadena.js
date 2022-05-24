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

export interface Cap {
  name: string;
  args: [string];
}

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
