export interface Exec {
  data: object;
  code: string;
}
export interface Payload {
  exec: Exec;
}

export interface Cap {
  name: stinrg;
  args: [string];
}

export interface PubKey {
  pubKey: string;
  scheme?: string;
  addr?: string;
  clist?;
  [Cap];
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
