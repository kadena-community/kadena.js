export interface KeyPair {
  publicKey: string;
  secretKey?: string;
  clist?: [];
}

export interface KeyPairClist {
  publicKey: string;
  secretKey?: string;
}
