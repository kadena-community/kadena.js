export interface Signature {
  sig: string | undefined;
}

export interface SignedSignatureWithHash extends Signature {
  hash: string;
  sig: string | undefined;
  pubKey: string;
}

export interface UnsignedSignatureWithHash extends Signature {
  hash: string;
  sig: string | undefined;
  pubKey?: string;
}

export type SignatureWithHash =
  | SignedSignatureWithHash
  | UnsignedSignatureWithHash;

export type SignCommand = SignatureWithHash;

export interface SignedCommand {
  hash: string;
  sigs: Signature[];
  cmd: string;
}
