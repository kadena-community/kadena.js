/**
 * @alpha
 */
export interface ISignature {
  sig: string | undefined | null;
}

/**
 * @alpha
 */
export interface ISignedSignatureWithHash extends ISignature {
  hash: string;
  sig: string | undefined | null;
  pubKey: string;
}

/**
 * @alpha
 */
export interface IUnsignedSignatureWithHash extends ISignature {
  hash: string;
  sig: string | undefined | null;
  pubKey?: string;
}

/**
 * @alpha
 */
export type SignatureWithHash =
  | ISignedSignatureWithHash
  | IUnsignedSignatureWithHash;

/**
 * @alpha
 */
export type SignCommand = SignatureWithHash;

/**
 * @alpha
 */
export interface ISignedCommand {
  hash: string;
  sigs: ISignature[];
  cmd: string;
}
