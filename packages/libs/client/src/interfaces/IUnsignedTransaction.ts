/* eslint-disable */
/**
 * @alpha
 */
export interface ISigner {
  pubKey: string;
  sig: string | null;
}

/**
 * @alpha
 */
export interface IUnsignedChainweaverTransaction {
  // eslint-disable-next-line @rushstack/no-new-null
  sigs: ISigner[];
  cmd: string;
}

/**
 * @alpha
 */
export interface IUnsignedTransaction {
  hash: string;
  // eslint-disable-next-line @rushstack/no-new-null
  sigs: { [pubkey: string]: string | null };
  cmd: string;
}
