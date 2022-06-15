export interface SignCommand {
  sig: string;
  hash: string;
  pubKey: string;
}

export interface PreparedCommand {
  hash: string;
  sigs: Sig[];
  cmd: string;
}

export interface Sig {
  sig: string;
}

export interface SignedSig {
  hash: string;
  sig: string | undefined;
  publicKey: string;
}
