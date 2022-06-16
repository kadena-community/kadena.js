export type SignCommand = SignedSig | UnsignedSig;

export interface PreparedCommand {
  hash: string;
  sigs: Sig[];
  cmd: string;
}

export interface Sig {
  sig: string | undefined;
}

export interface SignedSig {
  hash: string;
  sig: string | undefined;
  pubKey: string;
}

export interface UnsignedSig {
  hash: string;
  sig: string | undefined;
  pubKey?: string;
}
